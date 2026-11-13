// Embedded PostgreSQL only: no URL, credentials, hosted client or remote apply option.
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '../../frontend/node_modules/@electric-sql/pglite/dist/index.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const migration = readFileSync(resolve(root, 'supabase/migrations',
  readdirSync(resolve(root, 'supabase/migrations')).find(f => f.endsWith('_capf_p2_b1_foundation.sql'))), 'utf8');

export async function initialize(db) {
  const existing = await db.query("select to_regclass('public.capf_p2_questions') as name");
  if (existing.rows[0].name) return;
  // Test/local roles only. Never run platform stubs on hosted Supabase.
  await db.exec('create role anon; create role authenticated; grant usage on schema public to anon, authenticated;');
  await db.exec(migration);
}

export async function ingest(db, data) {
  if (data.mapping_version !== 'package-a-0.2-to-b1-v1' || data.records.length !== 56 ||
      new Set(data.records.map(r => r.record_id)).size !== 56)
    throw new Error('CAPF_INVALID_PACKAGE');
  return db.transaction(async tx => {
    const duplicate = await tx.query('select id from capf_p2_private.import_batches where manifest_hash=$1', [data.manifest_hash]);
    if (duplicate.rows.length) return { imported: 0, duplicate: true };
    const batch = (await tx.query(
      'insert into capf_p2_private.import_batches(manifest_hash,mapping_version,files,validation) values($1,$2,$3,$4) returning id',
      [data.manifest_hash, data.mapping_version, data.files, data.validation])).rows[0].id;
    const sourceIds = new Map();
    for (const s of data.sources) {
      const result = await tx.query(
        'insert into capf_p2_private.sources(year,official_url,raw) values($1,$2,$3) on conflict(year) do nothing returning id',
        [s.year, s.official_pdf_url, s]);
      const id = result.rows[0]?.id ?? (await tx.query('select id from capf_p2_private.sources where year=$1',[s.year])).rows[0].id;
      sourceIds.set(s.year, id);
    }
    await tx.query('insert into public.capf_p2_taxonomy_versions(version,ontology) values($1,$2) on conflict(version) do nothing',
      [data.taxonomy.version, data.taxonomy]);
    const taxonomy = (await tx.query('select id,ontology from public.capf_p2_taxonomy_versions where version=$1',[data.taxonomy.version])).rows[0];
    const same = await tx.query('select ontology=$1::jsonb as same from public.capf_p2_taxonomy_versions where id=$2',[data.taxonomy,taxonomy.id]);
    if (!same.rows[0].same) throw new Error('CAPF_TAXONOMY_VERSION_CONFLICT');
    await tx.query('insert into public.capf_p2_rubric_versions(version,rubric,anchors) values($1,$2,$3) on conflict(version) do nothing',
      [data.rubric.version,data.rubric,data.anchors]);
    const rubricSame = await tx.query('select rubric=$1::jsonb and anchors=$2::jsonb as same from public.capf_p2_rubric_versions where version=$3',
      [data.rubric,data.anchors,data.rubric.version]);
    if (!rubricSame.rows[0].same) throw new Error('CAPF_RUBRIC_VERSION_CONFLICT');
    for (const r of data.records) {
      await tx.query('insert into public.capf_p2_questions(record_id,year,section,original_label) values($1,$2,$3,$4) on conflict(record_id) do nothing',
        [r.record_id,r.year,r.section,r.original_label]);
      const q = (await tx.query('select * from public.capf_p2_questions where record_id=$1 for update',[r.record_id])).rows[0];
      if (q.year!==r.year || q.section!==r.section || q.original_label!==r.original_label) throw new Error('CAPF_IDENTITY_CONFLICT');
      const previous = await tx.query('select id,content_hash,revision from public.capf_p2_question_revisions where question_id=$1 order by revision desc limit 1',[q.id]);
      let revisionId = previous.rows[0]?.content_hash===r.content_hash ? previous.rows[0].id : null;
      if (!revisionId) {
        const fields = ['prompt','marks','selection_rule','word_limit','word_limit_status','primary_domain','secondary_tags',
          'demand_tags','demand_card','source_url','source_page_reported','content_hash'];
        const values = [q.id, (previous.rows[0]?.revision ?? 0)+1, sourceIds.get(r.year),taxonomy.id,
          ...fields.map(f => ['secondary_tags','demand_tags','demand_card'].includes(f) ? JSON.stringify(r[f]) : r[f])];
        revisionId = (await tx.query(
          'insert into public.capf_p2_question_revisions(question_id,revision,source_id,taxonomy_id,'+
          fields.join(',')+') values('+values.map((_,i)=>'$'+(i+1)).join(',')+') returning id',values)).rows[0].id;
      }
      await tx.query('insert into capf_p2_private.raw_records(batch_id,record_id,revision_id,raw_record) values($1,$2,$3,$4)',
        [batch,r.record_id,revisionId,r.raw_record]);
    }
    return { imported: data.records.length, duplicate: false };
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 2) throw new Error('No remote target or apply flags are supported');
  const directory = resolve(root, '.capf-private');
  mkdirSync(directory, {recursive:true});
  const db = new PGlite(resolve(directory,'database'));
  try {
    await initialize(db);
    const result = await ingest(db, JSON.parse(readFileSync(resolve(directory,'canonical.json'),'utf8')));
    const counts = await db.query("select count(*)::int as total, count(*) filter(where state='DRAFT')::int as draft from public.capf_p2_question_revisions");
    await db.exec('set role anon');
    const visible = await db.query('select count(*)::int as count from public.capf_p2_published_questions');
    console.log(JSON.stringify({...result,...counts.rows[0],public_records:visible.rows[0].count}));
  } finally { await db.close(); }
}
