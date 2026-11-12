// Read-only synthetic upstream: all non-GET writes are refused.
const http = require('node:http');
const rows = ['CDS','CAPF-AC'].flatMap(exam => Array.from({length:12},(_,i)=>({
 id:`${exam}-${i}`, question_id:`${exam}_${i}`, exam,year:2026,subject:'History',topic:'Modern History',paper:exam==='CDS'?'General Knowledge':'Paper I',
 content_eligible:true, question:`Synthetic question ${i+1}?`,opt_a:'One',opt_b:'Two',opt_c:'Three',opt_d:'Four',final_opt:'B',explanation:'Synthetic explanation.',q_num:i+1,
})));
http.createServer((req,res)=>{
 res.setHeader('Content-Type','application/json');
 res.setHeader('Access-Control-Allow-Origin','*');
 if(req.method!=='GET' && req.method!=='HEAD'){res.statusCode=405;return res.end('{}')}
 const url=new URL(req.url,'http://127.0.0.1:4557');
 if(url.pathname==='/__qa')return res.end('{}');
 if(url.pathname==='/auth/v1/user'){res.statusCode=401;return res.end('{"message":"No user"}')}
 let result=url.pathname.endsWith('/v_dp_question_intelligence_v2')?rows:[];
 for(const [key,value] of url.searchParams){
  if(value.startsWith('eq.'))result=result.filter(r=>String(r[key])===value.slice(3));
  if(value.startsWith('ilike.'))result=result.filter(r=>String(r[key]).toLowerCase()===value.slice(6).toLowerCase());
 }
 res.end(JSON.stringify(result));
}).listen(4557,'127.0.0.1');
