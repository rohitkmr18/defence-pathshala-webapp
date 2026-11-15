// Smoke the built Next routes with CAPF disabled and no hosted configuration.
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as pause } from 'node:timers/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { offlineEnvironment } from './check.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const socket=createServer();socket.listen(0,'127.0.0.1');await once(socket,'listening');
const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],
  {cwd:resolve(root,'frontend'),env:offlineEnvironment(process.env),stdio:['ignore','pipe','pipe']});
let output='';child.stdout.on('data',b=>{output+=b;});child.stderr.on('data',b=>{output+=b;});
const base='http://127.0.0.1:'+port;
try{
  let ready=false;
  for(let i=0;i<100;i++){
    if(child.exitCode!==null) throw new Error('Next exited before readiness');
    try{await fetch(base+'/api/capf-paper2/questions');ready=true;break;}catch{await pause(200);}
  }
  assert.ok(ready,'Next readiness timeout');
  for(const path of ['/api/capf-paper2/questions','/api/capf-paper2/questions/CAPF-P2-2020-Q1-a']){
    const response=await fetch(base+path);
    assert.equal(response.status,404);
    assert.deepEqual(await response.json(),{error:'CAPF_NOT_AVAILABLE'});
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal((await fetch(base+path,{method:'POST'})).status,405);
  }
  console.log('PASS: built list/detail routes return closed 404; mutations return 405.');
}catch(error){console.error(output);throw error;}
finally{child.kill();await once(child,'exit');}
