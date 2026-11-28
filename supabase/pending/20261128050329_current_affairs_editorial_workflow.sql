-- Private editorial workflow. Existing learner tables and the atomic publisher stay intact.
create table public.ca_editorial_drafts (
  revision bigint generated always as identity primary key,
  edition_date date not null,
  sha256 text not null,
  package text not null,
  created_at timestamptz not null default now(),
  unique (edition_date, sha256),
  check (encode(sha256(convert_to(package, 'UTF8')), 'hex') = sha256),
  check (((package::jsonb #>> '{edition,date}')::date = edition_date) is true)
);

create table public.ca_editorial_stages (
  edition_date date not null,
  stage smallint not null check (stage between 1 and 4),
  attempt integer not null default 0 check (attempt between 0 and 3),
  lease uuid,
  lease_until timestamptz,
  checkpoint jsonb,
  primary key (edition_date, stage)
);

create table public.ca_editorial_events (
  edition_date date not null,
  stage smallint not null,
  attempt integer not null,
  event text not null check (event in ('started', 'failed', 'expired', 'completed')),
  occurred_at timestamptz not null default clock_timestamp(),
  primary key (edition_date, stage, attempt, event)
);

alter table public.ca_editorial_drafts enable row level security;
alter table public.ca_editorial_stages enable row level security;
alter table public.ca_editorial_events enable row level security;
revoke all on public.ca_editorial_drafts, public.ca_editorial_stages, public.ca_editorial_events
  from public, anon, authenticated, service_role;
grant select, insert on public.ca_editorial_drafts, public.ca_editorial_events to service_role;
grant select, insert, update on public.ca_editorial_stages to service_role;

create function public.ca_save_editorial_draft(day date, digest text, snapshot text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if current_user <> 'service_role' then
    raise exception 'Only service_role may access editorial RPCs' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(21056, day - date '2000-01-01');
  insert into public.ca_editorial_drafts(edition_date, sha256, package)
    values (day, digest, snapshot) on conflict (edition_date, sha256) do nothing;
  if not exists (select 1 from public.ca_editorial_drafts
      where edition_date = day and sha256 = digest and package = snapshot) then
    raise exception 'Draft collision';
  end if;
end;
$$;

create function public.ca_editorial_stage(day date, step smallint, token uuid, action text, output jsonb default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  state public.ca_editorial_stages;
  current_time_at timestamptz;
begin
  if current_user <> 'service_role' then
    raise exception 'Only service_role may access editorial RPCs' using errcode = '42501';
  end if;
  if step not between 1 and 4 or token is null or action not in ('claim', 'complete', 'fail') then
    raise exception 'Invalid stage operation';
  end if;
  if step > 1 and not exists (select 1 from public.ca_editorial_stages
      where edition_date = day and stage = step - 1 and checkpoint is not null) then
    raise exception 'Prior stage has no checkpoint';
  end if;

  insert into public.ca_editorial_stages (edition_date, stage) values (day, step) on conflict do nothing;
  select * into strict state from public.ca_editorial_stages
    where edition_date = day and stage = step for update;
  current_time_at := clock_timestamp();
  if state.checkpoint is not null then
    return jsonb_build_object('status', 'completed', 'checkpoint', state.checkpoint);
  end if;
  if action = 'claim' then
    if state.lease_until > current_time_at then
      return jsonb_build_object('status', 'busy');
    end if;
    if state.lease is not null then
      insert into public.ca_editorial_events (edition_date, stage, attempt, event)
        values (day, step, state.attempt, 'expired') on conflict do nothing;
    end if;
    if state.attempt >= 3 then
      return jsonb_build_object('status', 'exhausted');
    end if;
    update public.ca_editorial_stages set attempt = attempt + 1, lease = token,
      lease_until = current_time_at + interval '5 minutes'
      where edition_date = day and stage = step;
    insert into public.ca_editorial_events (edition_date, stage, attempt, event)
      values (day, step, state.attempt + 1, 'started');
    return jsonb_build_object('status', 'claimed');
  end if;
  if state.lease is distinct from token or state.lease_until <= current_time_at then
    return jsonb_build_object('status', 'lost_lease');
  end if;
  if action = 'complete' and jsonb_typeof(output) is distinct from 'object' then
    raise exception 'Stage output must be an object';
  end if;
  if action = 'complete' and step = 4 then
    perform public.ca_save_editorial_draft(day, output->>'sha256', output->>'snapshot');
  end if;
  update public.ca_editorial_stages set lease = null, lease_until = null,
    checkpoint = case when action = 'complete' then output end
    where edition_date = day and stage = step;
  insert into public.ca_editorial_events (edition_date, stage, attempt, event)
    values (day, step, state.attempt, case when action = 'complete' then 'completed' else 'failed' end);
  return jsonb_build_object('status', case when action = 'complete' then 'completed' else 'failed' end);
end;
$$;

-- The publisher and runner share the exact canonical production eligibility gate.
create function public.ca_check_editorial_pyqs(ids text[])
returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  eligible_count integer;
begin
  if current_user <> 'service_role' then
    raise exception 'Only service_role may access editorial RPCs' using errcode = '42501';
  end if;
  if ids is null or cardinality(ids) > 256 or array_position(ids, null) is not null then
    return false;
  end if;
  perform 1 from public.questions where question_id = any(ids) and is_active is true
    order by question_id for share;
  select count(distinct eligible.question_id) into eligible_count
    from public.v_dp_question_intelligence_v2 eligible
    join public.questions question on question.question_id = eligible.question_id
    where eligible.question_id = any(ids) and question.is_active is true
      and eligible.production_eligible is true and eligible.content_eligible is true;
  return eligible_count = (select count(distinct id) from unnest(ids) as items(id));
end;
$$;

-- Legacy authorizations are deliberately administered by the database owner.
-- Service role may read them, and each exception expires within 48 hours.
create table public.ca_legacy_publish_exceptions (
  edition_date date primary key,
  source_sha256 text not null check (source_sha256 ~ '^[a-f0-9]{64}$'),
  reason text not null check (length(btrim(reason)) >= 12),
  granted_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null,
  check (expires_at > granted_at and expires_at <= granted_at + interval '48 hours')
);
alter table public.ca_legacy_publish_exceptions enable row level security;
revoke all on public.ca_legacy_publish_exceptions from public, anon, authenticated, service_role;
grant select on public.ca_legacy_publish_exceptions to service_role;

-- Serialize the stale-revision check with draft insertion and keep the existing
-- publisher's source, exact PYQ, uniqueness and atomic transaction checks.
create function public.ca_publish_editorial(day date, digest text, legacy_payload jsonb default null)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  draft public.ca_editorial_drafts;
begin
  if current_user <> 'service_role' then
    raise exception 'Only service_role may access editorial RPCs' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(21056, day - date '2000-01-01');
  select * into draft from public.ca_editorial_drafts where edition_date = day
    order by revision desc limit 1;
  if digest is null then
    if found or (legacy_payload->>'date')::date is distinct from day or not exists (
      select 1 from public.ca_legacy_publish_exceptions
      where edition_date = day and expires_at > clock_timestamp() and granted_at <= clock_timestamp()
        and source_sha256 = legacy_payload #>> '{approvedEditorial,sha256}'
    ) then
      raise exception 'Exact draft approval required; legacy exception missing or expired';
    end if;
  else
    if not found or draft.sha256 is distinct from digest
      or encode(sha256(convert_to(draft.package, 'UTF8')), 'hex') is distinct from digest then
      raise exception 'Missing, stale or mismatched draft approval';
    end if;
    legacy_payload := draft.package::jsonb->'edition';
  end if;
  if not public.ca_check_editorial_pyqs(array(
    select id from jsonb_array_elements(legacy_payload->'stories') story,
      lateral jsonb_array_elements_text(story->'linkedPyqIds') ids(id)
  )) then
    raise exception 'Linked PYQ is not eligible for production';
  end if;
  return public.publish_current_affairs_edition_atomic(legacy_payload);
end;
$$;

revoke all on function public.ca_save_editorial_draft(date, text, text),
  public.ca_editorial_stage(date, smallint, uuid, text, jsonb),
  public.ca_publish_editorial(date, text, jsonb),
  public.ca_check_editorial_pyqs(text[]) from public, anon, authenticated, service_role;
grant execute on function public.ca_save_editorial_draft(date, text, text),
  public.ca_editorial_stage(date, smallint, uuid, text, jsonb),
  public.ca_publish_editorial(date, text, jsonb),
  public.ca_check_editorial_pyqs(text[]) to service_role;
