// Read-only public HTTP baseline. Requires curl and Node >= 18.
// Run from repo root: node scripts/perf-public-baseline.mjs
import { execFileSync } from "node:child_process";
const base = process.env.PERF_BASE_URL || "https://www.defencepathshala.in";
const urls = ["/", "/pyqs/cds", "/pyqs/capf", "/pyqs/nda", "/current-affairs", "/afcat", "/mock/cds-gk", "/auth/login"].map(p => new URL(p, base).href);
if (!process.env.PERF_BASE_URL) urls.unshift("https://defencepathshala.in/");
const runs = 5;
const results = [];
for (const url of urls) {
  for (let run = 1; run <= runs; run++) {
    try {
      const raw = execFileSync("curl", ["--silent","--show-error","--location","--max-redirs","5","--max-time","25","--output","/dev/null","--write-out","%{json}",url], {encoding:"utf8",stdio:["ignore","pipe","pipe"]});
      const r = JSON.parse(raw);
      results.push({url,run,status:r.http_code,finalUrl:r.url_effective,redirects:r.num_redirects,dnsMs:Math.round(r.time_namelookup*1000),connectMs:Math.round(r.time_connect*1000),tlsMs:Math.round(r.time_appconnect*1000),redirectMs:Math.round(r.time_redirect*1000),ttfbMs:Math.round(r.time_starttransfer*1000),totalMs:Math.round(r.time_total*1000),bytes:r.size_download});
    } catch (error) {
      results.push({url,run,error:"curl failed",exitCode:error.status ?? null});
    }
  }
}
const summary = urls.map(url => {
  const rows = results.filter(r=>r.url===url && !r.error && r.status>=200 && r.status<300);
  const median = key => {const s=rows.map(r=>r[key]).sort((a,b)=>a-b);return s.length ? s[Math.floor(s.length/2)] : null;};
  return {url,successful:rows.length,attempts:runs,medianTtfbMs:median("ttfbMs"),medianTotalMs:median("totalMs")};
});
console.log(JSON.stringify({timestamp:new Date().toISOString(),base,method:"sequential unauthenticated HTTP GET; separate curl process per sample; cache state uncontrolled",summary,results},null,2));
if (summary.some(r=>r.successful!==runs)) process.exitCode=1;
