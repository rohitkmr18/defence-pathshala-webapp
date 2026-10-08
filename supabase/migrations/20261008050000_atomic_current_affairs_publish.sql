-- Atomic, insert-only Current Affairs publisher. Never modify an existing edition.
-- Deployed separately after migration review; execute only through service_role.
create function public.publish_current_affairs_edition_atomic(payload jsonb)
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
begin
  if jsonb_typeof(payload) is distinct from 'object'
     or coalesce(payload->>'date','') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     or jsonb_typeof(payload->'stories') is distinct from 'array'
     or jsonb_array_length(payload->'stories') < 1
     or jsonb_array_length(payload->'stories') > 8 then
    raise exception 'Invalid edition payload';
  end if;
  -- Prevent writes by a caller lacking privileged database role.
  if current_user <> 'service_role' then
    raise exception 'Only service_role may publish';
  end if;
  insert into public.current_affairs_posts
    (date,slug,title,summary,total_stories,total_slides,published)
  values
    ((payload->>'date')::date,payload->>'date',
     coalesce(nullif(btrim(payload->>'title'),''),'Daily Current Affairs — '||(payload->>'date')),
     coalesce(payload->>'summary','Exam-focused daily current affairs briefing.'),
     jsonb_array_length(payload->'stories'),0,false)
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
      (edition_id,idx,btrim(s->>'headline'),s->>'summary',s->>'category',
       s->>'subject',s->>'topic',s->>'subtopic',s->>'theme',
       s->>'examRelevance',s->>'futureAngle',
       array(select jsonb_array_elements_text(coalesce(s->'keywords','[]'::jsonb))),
       btrim(s->>'whatHappened'),s->>'whyItMatters',s->'keyFacts',
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
        (story_id,qnum,btrim(q->>'question'),opts->>'A',opts->>'B',opts->>'C',opts->>'D',
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
