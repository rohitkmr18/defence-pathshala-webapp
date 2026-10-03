const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');
const migration = fs.readFileSync('supabase/migrations/20261003093440_atomic_onboarding.sql', 'utf8');
const uid = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
let db;
before(async () => {
  db = new PGlite();
  await db.exec(fs.readFileSync('scripts/test-support/onboarding-schema.sql', 'utf8'));
  for (const filename of ['001_create_profiles', '002_secure_profile_roles', '003_add_student_onboarding', '005_create_profile_trigger']) {
    await db.exec(fs.readFileSync(`database/migrations/${filename}.sql`, 'utf8'));
  }
  await db.exec(`create table public.user_exam_preferences (
    user_id uuid references public.profiles(id) on delete cascade,
    exam text check (exam in ('CDS','CAPF-AC','NDA','AFCAT','UPSC-CSE')),
    created_at timestamptz not null default now(), primary key (user_id, exam));
    alter table public.user_exam_preferences enable row level security;
    create policy own_exams on public.user_exam_preferences to authenticated
      using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
    grant usage on schema public to anon, authenticated, service_role;
    grant select, update on public.profiles to authenticated;
    grant select, insert, delete on public.user_exam_preferences to authenticated;`);
  await db.exec(migration);
});
beforeEach(async () => {
  await db.exec(`reset role;
    drop trigger if exists fail_save on public.profiles;
    drop trigger if exists fail_exam on public.user_exam_preferences;
    delete from auth.users;
    insert into auth.users(id) values ('${uid}'), ('${other}');
    select set_config('request.jwt.claim.sub', '${uid}', false);`);
});
after(async () => { await db?.close(); });
async function asUser(role = 'authenticated', id = uid) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${id}', false); set role ${role};`);
}
async function save({ name = null, year = null, exams = ['CDS'], edit = false } = {}) {
  const result = await db.query(`select public.${edit ? 'update_preparation_profile' : 'complete_onboarding'}($1,$2,$3::text[]) as profile`, [name, year, exams]);
  return result.rows[0].profile;
}
async function snapshot() {
  await db.exec('reset role');
  return (await db.query(`select p.id, p.role, p.full_name, p.target_year, p.onboarding_completed,
    coalesce((select jsonb_agg(exam order by exam) from public.user_exam_preferences e where e.user_id=p.id), '[]') as exams
    from public.profiles p order by p.id`)).rows;
}

test('real SQL transaction creates a missing owned profile with optional name/year and unique exams', async () => {
  await db.exec(`delete from public.profiles where id='${uid}'`);
  await asUser();
  const result = await save({ exams: ['CDS', 'CAPF-AC', 'CDS'] });
  assert.equal(result.onboarding_completed, true);
  assert.equal(result.full_name, null);
  assert.equal(result.target_year, null);
  assert.deepEqual(result.target_exams, ['CAPF-AC', 'CDS']);
  const rows = await snapshot();
  assert.equal(rows[0].role, 'student');
  assert.equal(rows[1].onboarding_completed, false);
});

test('repeat and queued duplicate submissions converge on first persisted setup', async () => {
  await asUser();
  const [first, duplicate] = await Promise.all([save({ name: 'First', year: 2027 }), save({ name: 'Second', exams: ['CAPF-AC'] })]);
  assert.deepEqual(duplicate, first);
  assert.deepEqual(await save({ name: 'Third' }), first);
  assert.equal(first.full_name, 'First');
  assert.equal((await snapshot())[0].exams.length, 1);
});

test('legacy completed user, role, old exam and year are unchanged by setup or migration replay', async () => {
  await db.exec(`alter table public.profiles disable trigger prevent_role_change_trigger;
    update public.profiles set role='admin', full_name='Legacy', target_year=2025, onboarding_completed=true where id='${uid}';
    alter table public.profiles enable trigger prevent_role_change_trigger;
    insert into public.user_exam_preferences(user_id, exam) values ('${uid}','NDA');`);
  const before = await snapshot();
  await asUser();
  const result = await save({ name: 'New', exams: ['CDS'] });
  assert.equal(result.full_name, 'Legacy'); assert.equal(result.target_year, 2025);
  assert.deepEqual(result.target_exams, ['NDA']);
  await db.exec('reset role'); await db.exec(migration);
  assert.deepEqual(await snapshot(), before);
});

for (const failure of ['exam insert', 'completion update', 'silent preference drop']) {
  test(`${failure} rolls back preferences and completion together`, async () => {
    await db.exec(`insert into public.user_exam_preferences(user_id,exam) values ('${uid}', 'CAPF-AC')`);
    const before = await snapshot();
    if (failure === 'completion update') {
      await db.exec(`create or replace function public.test_fail() returns trigger language plpgsql as $$
        begin raise exception 'save failure'; end; $$;
        create trigger fail_save before update on public.profiles for each row execute function public.test_fail();`);
    } else {
      await db.exec(`create or replace function public.test_fail() returns trigger language plpgsql as $$
        begin ${failure === 'silent preference drop' ? 'return null;' : "raise exception 'save failure';"} end; $$;
        create trigger fail_exam before insert on public.user_exam_preferences for each row execute function public.test_fail();`);
    }
    await asUser();
    await assert.rejects(save({ name: 'Cannot persist' }));
    assert.deepEqual(await snapshot(), before);
  });
}

test('failed transaction also rolls back missing-profile creation', async () => {
  await db.exec(`delete from public.profiles where id='${uid}';
    create or replace function public.test_fail() returns trigger language plpgsql as $$ begin raise exception 'failed'; end; $$;
    create trigger fail_exam before insert on public.user_exam_preferences for each row execute function public.test_fail();`);
  await asUser(); await assert.rejects(save());
  assert.equal((await snapshot()).some(p => p.id === uid), false);
});

test('anonymous/service-role calls, missing auth UID and role elevation are denied', async () => {
  for (const role of ['anon', 'service_role']) {
    await asUser(role); await assert.rejects(save(), /permission denied/);
  }
  await asUser('authenticated', ''); await assert.rejects(save(), /Authentication required/);
  await asUser();
  await assert.rejects(db.exec("update public.profiles set role='admin' where id=auth.uid()"), /Role changes are not allowed/);
  await assert.rejects(db.exec(`insert into public.profiles(id) values ('${uid}')`), /permission denied/);
  await save();
  assert.equal((await snapshot())[0].role, 'student');
});

test('ownership stays intact and dashboard target edits work only after setup', async () => {
  await asUser(); await assert.rejects(save({ edit: true }), /Complete setup/);
  await save({ name: 'Owner' });
  const edited = await save({ name: 'Owner', year: 2030, exams: ['AFCAT'], edit: true });
  assert.equal(edited.onboarding_completed, true); assert.deepEqual(edited.target_exams, ['AFCAT']);
  await asUser('authenticated', other);
  await db.exec(`update public.profiles set full_name='Intruder' where id='${uid}';
    delete from public.user_exam_preferences where user_id='${uid}';`);
  assert.equal((await snapshot())[0].full_name, 'Owner');
});

test('invalid new setup is rejected with no partial writes', async () => {
  const before = await snapshot();
  for (const args of [{ exams: [] }, { exams: ['NDA'] }, { exams: [null] }, { year: 2099 }, { name: 'x'.repeat(201) }]) {
    await asUser(); await assert.rejects(save(args), /Invalid preparation/);
    assert.deepEqual(await snapshot(), before);
  }
});
