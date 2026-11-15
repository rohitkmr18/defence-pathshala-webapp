// Whitelist child environment; no inherited database/provider credentials or npm hooks.
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export function offlineEnvironment(source) {
  const env = {};
  for (const [key,value] of Object.entries(source)) {
    if (['path','systemroot','windir','temp','tmp','home','userprofile','appdata','localappdata'].includes(key.toLowerCase()))
      env[key] = value;
  }
  return {...env, CDS_ENGLISH_PROD_LOAD:'0', NEXT_TELEMETRY_DISABLED:'1',
    NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:1', SUPABASE_URL:'http://127.0.0.1:1',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:'offline-anon', SUPABASE_SERVICE_ROLE_KEY:'',
    DATABASE_URL:'', BACKEND_URL:'http://127.0.0.1:1', CAPF_P2_LOCAL_READS:'0'};
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const modes = {
    test: ['--experimental-strip-types','--test','scripts/capf-p2/test.mjs'],
    types: ['frontend/node_modules/typescript/bin/tsc','--noEmit','--incremental','false','-p','frontend/tsconfig.json'],
    build: ['node_modules/next/dist/bin/next','build','--webpack'],
  };
  const mode = process.argv[2] ?? 'test';
  if (!modes[mode]) throw new Error('Use test, types or build');
  const result = spawnSync(process.execPath,modes[mode],{
    cwd:mode==='build'?resolve(root,'frontend'):root, env:offlineEnvironment(process.env),stdio:'inherit',
  });
  process.exit(result.status ?? 1);
}
