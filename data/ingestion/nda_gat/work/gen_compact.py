import json,re,sys
sys.argv=['x']
exec(open('gen_nda_ii_2026_gk_batch_sql.py').read().split("def q(s)")[0])
def q(s): return "$q$"+s+"$q$"
CATn={'E':'Easy','M':'Moderate','H':'Hard'}
vals=[]
for r in rows:
    o=[r['options'][k] for k in 'ABCD']
    vals.append("(%d,%s,%s,%s,%s,%s,'%s',%s,%s,%s,%s,%s,%s,%s,'%s',%s)"%(r['q_num'],q(r['question_text']),q(o[0]),q(o[1]),q(o[2]),q(o[3]),r['answer'],q(r['subject']),q(r['topic']),q(r['subtopic']),q(r['theme']),q(r['q_pattern']),q(r['explanation']),q(comp(r['subject'],r['topic'])+'|'+SRC[r['subject']]),r['difficulty'],'true' if r['q_num'] in NEG else 'false'))
PID_=json.dumps(PID) if 'PID' in dir() else None
sql="""with b as (select id from dp_ingest.batches where batch_code='NDA_2026_II_GAT_GK_SET_A'),
v(n,qt,a,b_,c,d,k,subj,top,sub,th,pat,ex,cs,df,neg) as (values
"""+",\n".join(vals)+"""
)
insert into dp_ingest.rows(batch_id,q_num,raw_question,raw_opt_a,raw_opt_b,raw_opt_c,raw_opt_d,extraction_confidence,extraction_flags,question_id,question,opt_a,opt_b,opt_c,opt_d,content_hash,source_key_opt,key_authority,key_source_url,llm_opt,final_opt,key_discrepancy,subject,topic,subtopic,theme,q_type,q_pattern,pattern_id,explanation,source,is_negative,tags,static_current_link,difficulty_score,difficulty_category,source_fidelity_confidence,taxonomy_confidence,intelligence_confidence,review_required,row_status,release_disposition,taxonomy_concept,competency_id,source_id,temporal_context_id,expected_knowledge,source_accessibility,preparation_accessibility,cognitive_complexity,esac_score,relation_degree,same_concept_degree,cross_exam_variant_degree,conceptual_variant_degree,model_audit)
select b.id,v.n,v.qt,v.a,v.b_,v.c,v.d,0.98,'{}'::text[],'NDA_II_2026_GK_'||lpad(v.n::text,3,'0'),v.qt,v.a,v.b_,v.c,v.d,
 encode(sha256(convert_to(lower(regexp_replace(v.qt,'\\s+',' ','g'))||'|'||lower(v.a||'|'||v.b_||'|'||v.c||'|'||v.d),'UTF8')),'hex'),
 v.k,'MODEL_ONLY','dp-solved://NDA_2026_II_GAT_GK_SET_A',v.k,v.k,false,v.subj,v.top,v.sub,v.th,'Knowledge',v.pat,
 (select pattern_id from public.dp_pattern_dictionary where display_label=v.pat),v.ex,'NDA II 2026 General Ability Test Part B (English side)',v.neg,
 array['format:single_mcq','key:dp_solved'],case when v.subj='Current Affairs' then 'Current Affairs' else 'Static' end,
 case v.df when 'E' then 20 when 'M' then 42.25 else 62 end, case v.df when 'E' then 'Easy' when 'M' then 'Moderate' else 'Hard' end,
 0.97,0.85,0.85,false,'ENRICHED','INCLUDE',v.th,split_part(v.cs,'|',1),split_part(v.cs,'|',2),
 case when v.subj='Current Affairs' then 'TEMP.CURRENT_DEVELOPMENT' else 'TEMP.STATIC' end,
 80,case when v.subj='Current Affairs' then 70 else 90 end,100,60,
 100-case v.df when 'E' then 20 when 'M' then 42.25 else 62 end,0,0,0,0,
 jsonb_build_object('answer_audit',jsonb_build_object('authority','DP_SOLVED_INTERNAL','note','Not an official UPSC key'),'source_explanation_evidence',jsonb_build_object('captured',true,'provider','DP internal solved key','text',v.ex))
from b, v;"""
open('compact.sql','w').write(sql); print(len(sql))
