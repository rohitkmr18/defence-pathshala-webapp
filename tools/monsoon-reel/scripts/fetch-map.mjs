import {mkdir, writeFile} from 'node:fs/promises';

const url='https://raw.githubusercontent.com/AbhinavSwami28/india-official-geojson/main/india-states-simplified.geojson';
const res=await fetch(url);
if(!res.ok) throw new Error('Map download failed: '+res.status);
const text=await res.text();
JSON.parse(text);
await mkdir(new URL('../public/maps/',import.meta.url),{recursive:true});
await writeFile(new URL('../public/maps/india.geojson',import.meta.url),text,'utf8');
console.log('India GeoJSON ready');