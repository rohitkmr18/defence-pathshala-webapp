-- No historical rows are rewritten. NULL identifies legacy, non-verbatim editions.
alter table public.current_affairs_posts
  add column approved_editorial_source text,
  add column approved_editorial_sha256 text,
  add column approved_editorial_version integer,
  add constraint approved_editorial_integrity check (
    (approved_editorial_source is null and approved_editorial_sha256 is null and approved_editorial_version is null)
    or (approved_editorial_source is not null and approved_editorial_sha256 is not null
        and approved_editorial_version is not null and approved_editorial_version = 1
        and encode(sha256(convert_to(approved_editorial_source, 'UTF8')), 'hex') = approved_editorial_sha256)
  );

-- A deliberate content edit requires another explicitly approved edition/version, never UPDATE.
create function public.protect_approved_editorial_source() returns trigger
language plpgsql security invoker set search_path = public, pg_temp as $$
begin
  if (old.published or old.approved_editorial_source is not null) and
     (new.approved_editorial_source, new.approved_editorial_sha256, new.approved_editorial_version)
     is distinct from
     (old.approved_editorial_source, old.approved_editorial_sha256, old.approved_editorial_version) then
    raise exception 'Approved editorial source is immutable';
  end if;
  return new;
end;
$$;
revoke all on function public.protect_approved_editorial_source() from public, anon, authenticated;
create trigger immutable_approved_editorial_source before update on public.current_affairs_posts
for each row execute function public.protect_approved_editorial_source();

-- Atomic, insert-only Current Affairs publisher. Never modify an existing edition.
-- Deployed separately after migration review; execute only through service_role.
create or replace function public.publish_current_affairs_edition_atomic(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  edition_id uuid;
  story_id uuid;
  s jsonb;
  q jsonb;
  idx integer := 0;
  qnum integer := 0;
  total_mcqs integer := 0;
  opts jsonb;
  status text;
  hash_value text;
  linked_id text;
  approved jsonb;
begin
  if jsonb_typeof(payload) is distinct from 'object'
     or coalesce(payload->>'date','') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     or nullif(btrim(payload->>'title'),'') is null
     or nullif(btrim(payload->>'summary'),'') is null
     or jsonb_typeof(payload->'stories') is distinct from 'array'
     or jsonb_array_length(payload->'stories') < 1
     or jsonb_array_length(payload->'stories') > 8 then
    raise exception 'Invalid edition payload';
  end if;
  -- Prevent writes by a caller lacking privileged database role.
  if current_user <> 'service_role' then
    raise exception 'Only service_role may publish';
  end if;
  approved := payload->'approvedEditorial';
  if approved->>'version' is distinct from '1'
     or jsonb_typeof(approved->'source') is distinct from 'string'
     or encode(sha256(convert_to(approved->>'source', 'UTF8')), 'hex') is distinct from approved->>'sha256'
     or (approved->>'source')::jsonb is distinct from (payload - 'approvedEditorial') then
    raise exception 'Approved editorial source mismatch';
  end if;
  for s in select value from jsonb_array_elements(payload->'stories') loop
    if nullif(btrim(s->>'editorialMarkdown'),'') is null
       or jsonb_typeof(s->'linkedPyqIds') is distinct from 'array' then
      raise exception 'Complete editorial and PYQ references required';
    end if;
    for linked_id in select jsonb_array_elements_text(s->'linkedPyqIds') loop
      -- Lock the corpus row before checking the eligible read model to prevent races.
      perform 1 from public.questions where question_id = linked_id and is_active is true for share;
      if not found then raise exception 'Linked PYQ inactive: %', linked_id; end if;
      if linked_id !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$'
         or not exists (select 1 from public.v_dp_question_intelligence_v2
                        where question_id = linked_id and content_eligible is true) then
        raise exception 'Linked PYQ unavailable: %', linked_id;
      end if;
    end loop;
  end loop;
  insert into public.current_affairs_posts
    (date,slug,title,summary,total_stories,total_slides,published,approved_editorial_source,approved_editorial_sha256,approved_editorial_version)
  values
    ((payload->>'date')::date,payload->>'date',
     payload->>'title',
     payload->>'summary',
     jsonb_array_length(payload->'stories'),0,false,approved->>'source',approved->>'sha256',1)
  returning id into edition_id;

  for s in select value from jsonb_array_elements(payload->'stories') loop
    idx := idx + 1;
    if nullif(btrim(s->>'headline'),'') is null
       or nullif(btrim(s->>'whatHappened'),'') is null
       or jsonb_typeof(s->'keyFacts') <> 'array'
       or jsonb_array_length(s->'keyFacts') = 0
       or nullif(btrim(s->>'sourceUrl'),'') is null then
      raise exception 'Invalid story %', idx;
    end if;
    hash_value := md5(lower(btrim(s->>'headline')) || '|' || btrim(s->>'sourceUrl'));
    insert into public.current_affairs_stories
      (post_id,story_number,headline,summary,category,subject,topic,subtopic,theme,
       exam_relevance,future_angle,keywords,what_happened,why_it_matters,key_facts,
       conceptual_linkage,static_link,exam_tags,source_name,source_url,source_date,
       content_hash,dp_score)
    values
      (edition_id,idx,s->>'headline',s->>'summary',s->>'category',
       s->>'subject',s->>'topic',s->>'subtopic',s->>'theme',
       s->>'examRelevance',s->>'futureAngle',
       array(select jsonb_array_elements_text(coalesce(s->'keywords','[]'::jsonb))),
       s->>'whatHappened',s->>'whyItMatters',s->'keyFacts',
       s->>'conceptualLinkage',s->>'staticLink',
       array(select jsonb_array_elements_text(coalesce(s->'examTags','[]'::jsonb))),
       s->>'sourceName',s->>'sourceUrl',nullif(s->>'sourceDate','')::date,
       hash_value,nullif(s->>'dpScore','')::smallint)
    returning id into story_id;

    if s ? 'mcqs' and jsonb_typeof(s->'mcqs') <> 'array' then
      raise exception 'Invalid MCQs for story %',idx;
    end if;
    for q in select value from jsonb_array_elements(coalesce(s->'mcqs','[]'::jsonb)) loop
      qnum := qnum + 1;
      total_mcqs := total_mcqs + 1;
      opts := q->'options';
      status := q->>'contentStatus';
      if status is distinct from 'VERIFIED' or nullif(btrim(q->>'sourceUrl'),'') is null
         or nullif(btrim(q->>'question'),'') is null
         or (q->>'correctOption') is null or (q->>'correctOption') not in ('A','B','C','D')
         or nullif(btrim(q->>'explanation'),'') is null
         or nullif(btrim(q->>'examEdge'),'') is null
         or jsonb_typeof(opts) is distinct from 'object'
         or exists (select 1 from (values ('A'),('B'),('C'),('D')) as letters(k)
                    where nullif(btrim(opts->>letters.k),'') is null)
         or (select count(distinct lower(btrim(value))) from jsonb_each_text(opts)
             where key in ('A','B','C','D')) <> 4 then
        raise exception 'Unverified or invalid MCQ %',qnum;
      end if;
      insert into public.current_affairs_mcqs
        (story_id,question_number,question,option_a,option_b,option_c,option_d,
         correct_option,explanation,difficulty,subject,topic,subtopic,concept,
         exam_tags,question_type,exam_edge,mock_eligible,content_status,source_url)
      values
        (story_id,qnum,q->>'question',opts->>'A',opts->>'B',opts->>'C',opts->>'D',
         (q->>'correctOption')::char(1),q->>'explanation',
         coalesce(nullif(q->>'difficulty',''),'Moderate'),
         coalesce(q->>'subject',s->>'subject'),coalesce(q->>'topic',s->>'topic'),
         q->>'subtopic',q->>'concept',
         array(select jsonb_array_elements_text(coalesce(q->'examTags',s->'examTags','[]'::jsonb))),
         q->>'questionType',q->>'examEdge',coalesce((q->>'mockEligible')::boolean,false),
         status,q->>'sourceUrl');
    end loop;
  end loop;
  if total_mcqs < 3 or total_mcqs > 5 then
    raise exception 'Edition must have 3 to 5 verified MCQs';
  end if;
  if (select count(*) from public.current_affairs_stories where post_id=edition_id) <> idx
     or (select count(*) from public.current_affairs_mcqs m join public.current_affairs_stories s on s.id=m.story_id where s.post_id=edition_id) <> total_mcqs then
    raise exception 'Publication count mismatch';
  end if;
  update public.current_affairs_posts set published=true where id=edition_id;
  return edition_id;
end;
$$;
revoke all on function public.publish_current_affairs_edition_atomic(jsonb) from public, anon, authenticated;
grant execute on function public.publish_current_affairs_edition_atomic(jsonb) to service_role;
