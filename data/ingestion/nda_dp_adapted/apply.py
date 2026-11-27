import json, hashlib, re, sys
sys.path.insert(0,'.')
from fixes import FIX, P_BODY
R='/home/claude/defence-pathshala-webapp/data/ingestion/'
FILES=['nda_maths/prod_load/nda_ii_2026_maths.json','nda_maths/prod_load/nda_ii_2025_maths.json','nda_gat/prod_load/nda_ii_2025_gat.json',
       'nda_maths/prod_load/nda_i_2024_maths.json','nda_maths/prod_load/nda_ii_2024_maths.json','nda_gat/prod_load/nda_ii_2024_gat.json']
def norm(s): return re.sub(r'\s+',' ',s).strip().lower()
def chash(q,o): return hashlib.sha256(json.dumps([norm(q),sorted(map(norm,o))]).encode()).hexdigest()
OLD_P = None; ORIG={}; done={}; sql=[]
def q(s): assert '$Q$' not in s; return '$Q$'+s+'$Q$'
for f in FILES:
    d=json.load(open(R+f))
    for r in d['questions']:
        fx=FIX.get(r['question_id'])
        if not fx: continue
        if fx.get('stem_sub'):
            a,b=fx['stem_sub']; assert r['question'].count(a)==1,(r['question_id'],a); r['question']=r['question'].replace(a,b)
        if fx.get('passage'):
            pid=r['passage_id']; p=[x for x in d['passages'] if x['id']==pid][0]
            old=ORIG.setdefault(pid,p['body']); assert r['question'].startswith(old), r['question_id']
            r['question']=P_BODY+r['question'][len(old):]; p['body']=P_BODY; OLD_P=pid
        for k,v in fx.get('opts',{}).items(): r[k]=v
        r['llm_opt']=r['final_opt']=fx['key']; r['explanation']=fx['expl']
        r['tags']=[t for t in r['tags'] if t!='review:source_defect_candidate']+['edit:dp_adapted']
        r['is_active']=True; r['content_status']='SOURCE_MATCHED'; r['source_version']='dp-adapted-v1'
        r['content_hash']=chash(r['question'],[r['opt_a'],r['opt_b'],r['opt_c'],r['opt_d']])
        for i in d['intelligence']:
            if i['question_id']==r['question_id']:
                i.update(requires_content_review=False, release_eligible=True, production_eligible=True, human_review_required=False)
        d.get('withheld',{}).pop(r['question_id'],None)
        done[r['question_id']]=1
        tags='{'+','.join(r['tags'])+'}'
        sql.append(f"update questions set question={q(r['question'])}, opt_a={q(r['opt_a'])}, opt_b={q(r['opt_b'])}, opt_c={q(r['opt_c'])}, opt_d={q(r['opt_d'])}, llm_opt='{fx['key']}', final_opt='{fx['key']}', explanation={q(r['explanation'])}, tags='{tags}', is_active=true, content_status='SOURCE_MATCHED', source_version='dp-adapted-v1', content_version=content_version+1, content_hash='{r['content_hash']}', updated_at=now() where question_id='{r['question_id']}';")
        sql.append(f"update dp_question_intelligence_v1 set requires_content_review=false, release_eligible=true, production_eligible=true, human_review_required=false, updated_at=now() where question_id='{r['question_id']}';")
    json.dump(d,open(R+f,'w'),ensure_ascii=False,indent=1)
sql.append(f"update question_passages set body={q(P_BODY)} where id='{OLD_P}';")
assert set(done)==set(FIX), set(FIX)-set(done)
open('fix.sql','w').write("do $do$ begin\n"+"\n".join(sql)+"\nend $do$;")
print(len(sql), sorted(done))
