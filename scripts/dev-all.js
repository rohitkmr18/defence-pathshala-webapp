const { spawn } = require("child_process");

console.log("\x1b[36m%s\x1b[0m", "[dev:all] Starting Defence Pathshala development servers (Frontend + Backend)...");

const isWindows = process.platform === "win32";

// 1. Start FastAPI backend
const backend = spawn(
  "python",
  ["-m", "uvicorn", "app.main:app", "--reload", "--port", "8000", "--app-dir", "backend"],
  {
    stdio: "inherit",
  }
);

// 2. Start Next.js frontend
const frontend = isWindows
  ? spawn("cmd.exe", ["/c", "npm", "run", "dev", "--prefix", "frontend"], { stdio: "inherit" })
  : spawn("npm", ["run", "dev", "--prefix", "frontend"], { stdio: "inherit" });

const cleanup = (code = 0) => {
  console.log("\n\x1b[33m%s\x1b[0m", "[dev:all] Stopping servers...");

  try {
    if (backend && !backend.killed && backend.pid) {
      if (isWindows) {
        spawn("taskkill", ["/pid", backend.pid.toString(), "/f", "/t"]);
      } else {
        backend.kill("SIGTERM");
      }
    }
  } catch {}

  try {
    if (frontend && !frontend.killed && frontend.pid) {
      if (isWindows) {
        spawn("taskkill", ["/pid", frontend.pid.toString(), "/f", "/t"]);
      } else {
        frontend.kill("SIGTERM");
      }
    }
  } catch {}

  process.exit(code);
};

process.on("SIGINT", () => cleanup(0));
process.on("SIGTERM", () => cleanup(0));

backend.on("exit", (code) => {
  if (code !== null && code !== 0) {
    console.error(`\x1b[31m[Backend] exited with code ${code}\x1b[0m`);
  }
});

frontend.on("exit", (code) => {
  if (code !== null && code !== 0) {
    console.error(`\x1b[31m[Frontend] exited with code ${code}\x1b[0m`);
  }
});
