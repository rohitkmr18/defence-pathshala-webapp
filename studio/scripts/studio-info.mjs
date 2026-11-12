import { readFileSync } from "node:fs";
const info = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
console.log(info.name + " v" + info.version);
console.log("Scaffold only: rendering dependencies not installed.");
console.log("Next: inspect README.md and validate a five-second proof of concept.");
