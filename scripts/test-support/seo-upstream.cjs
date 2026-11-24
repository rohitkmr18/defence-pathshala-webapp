// Read-only synthetic upstream: all non-GET writes are refused.
const http = require('node:http');
const rows = ['CDS','CAPF-AC'].flatMap(exam => Array.from({length:12},(_,i)=>({
 id:`${exam}-${i}`, question_id:`${exam}_${i}`, exam,year:2026,subject:'History',topic:'Modern History',paper:exam==='CDS'?'General Knowledge':'Paper I',
 content_eligible:true, question:`Synthetic question ${i+1}?`,opt_a:'One',opt_b:'Two',opt_c:'Three',opt_d:'Four',final_opt:'B',explanation:'Synthetic explanation.',q_num:i+1,
}))).concat(Array.from({length:6},(_,i)=>({id:`NDA-${i}`,question_id:`NDA_${i}`,exam:'NDA',year:2026,subject:i<3?'Trigonometry':'Vocabulary',topic:i<3?'Heights and Distances':'Antonyms',paper:i<3?'Mathematics':'General Ability Test',content_eligible:true,question:`NDA sample ${i+1}?`,opt_a:'One',opt_b:'Two',opt_c:'Three',opt_d:'Four',final_opt:'B',q_num:i+1}))).concat(Array.from({length:3},(_,i)=>({id:`CDS-EN-${i}`,question_id:`CDS_EN_${i}`,exam:'CDS',year:2026,subject:'English',topic:'Grammar',paper:'English',content_eligible:true,question:`English sample ${i+1}?`,opt_a:'One',opt_b:'Two',opt_c:'Three',opt_d:'Four',final_opt:'B',q_num:i+1})));
const knowledgeRows = [{
  slug:'qa-cds-pyq-guide', title:'Synthetic CDS PYQ Revision Guide',
  description:'Synthetic educational testing article used only during CI layout acceptance.',
  category:'Exam Strategy',exam:'CDS',author_name:'Synthetic Editorial Team',
  reviewed_by:null,status:'published',
  published_at:'2026-11-01T10:00:00Z',updated_at:'2026-11-02T10:00:00Z',
  blocks:[{type:'heading',text:'How to diagnose a CDS PYQ mistake'},{type:'paragraph',text:'Identify a concept gap, a recall failure or a time-management error.'},{type:'list',items:['Concept gap','Recall failure','Time error']}],
  sources:[{label:'UPSC previous question papers',url:'https://www.upsc.gov.in/examinations/previous-question-papers'}],
  related_practice_url:'/pyqs/cds',image_url:null
}];
http.createServer((req,res)=>{
 res.setHeader('Content-Type','application/json');
 res.setHeader('Access-Control-Allow-Origin','*');
 if(req.method!=='GET' && req.method!=='HEAD'){res.statusCode=405;return res.end('{}')}
 const url=new URL(req.url,'http://127.0.0.1:4557');
 if(url.pathname==='/__qa')return res.end('{}');
 if(url.pathname==='/auth/v1/user'){res.statusCode=401;return res.end('{"message":"No user"}')}
 let result=url.pathname.endsWith('/v_dp_question_intelligence_v2')?rows:
  url.pathname.endsWith('/knowledge_articles')?knowledgeRows:[];
 for(const [key,value] of url.searchParams){
  if(value.startsWith('eq.'))result=result.filter(r=>String(r[key])===value.slice(3));
  if(value.startsWith('ilike.'))result=result.filter(r=>String(r[key]).toLowerCase()===value.slice(6).toLowerCase());
  if(value.startsWith('lte.'))result=result.filter(r=>new Date(r[key]).getTime()<=new Date(value.slice(4)).getTime());
  if(value==='not.is.null')result=result.filter(r=>r[key]!==null && r[key]!==undefined);
  if(value.startsWith('in.(')) { const values=value.slice(4,-1).split(',').map(v=>v.replace(/^\"|\"$/g,'')); result=result.filter(r=>values.includes(String(r[key]))); }
 }
 if(req.method==='HEAD' || req.headers.prefer?.includes('count=exact')){
  res.setHeader('Content-Range',result.length ? `0-${result.length-1}/${result.length}` : '*/0');
  if(req.method==='HEAD') return res.end();
 }
 if(url.pathname.endsWith('/knowledge_articles') && req.headers.accept?.includes('application/vnd.pgrst.object+json')) {
  if(result.length > 1){res.statusCode=406;return res.end('{"message":"Too many rows"}')}
  if(result.length===0){res.statusCode=406;return res.end('{"code":"PGRST116","details":"The result contains 0 rows","message":"JSON object requested, multiple (or no) rows returned"}')}
  return res.end(JSON.stringify(result[0]));
 }
 res.end(JSON.stringify(result));
}).listen(4557,'127.0.0.1');
