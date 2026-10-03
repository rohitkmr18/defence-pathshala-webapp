const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const isWindows = process.platform === "win32";
const rootDir = path.resolve(__dirname, "..");
const backendDir = path.resolve(rootDir, "backend");

// 1. Frontend production build verification
console.log("\x1b[36m%s\x1b[0m", "[verify] 1/2 Verifying frontend production build...");

const frontend = isWindows
  ? spawnSync("cmd.exe", ["/c", "npm", "run", "build", "--prefix", "frontend"], {
      cwd: rootDir,
      stdio: "inherit",
    })
  : spawnSync("npm", ["run", "build", "--prefix", "frontend"], {
      cwd: rootDir,
      stdio: "inherit",
    });

if (frontend.status !== 0) {
  console.error("\x1b[31m%s\x1b[0m", "[verify] Frontend build verification failed!");
  process.exit(frontend.status || 1);
}

// 2. Backend import verification
console.log("\x1b[36m%s\x1b[0m", "[verify] 2/2 Verifying backend import (app.main)...");

const venvPythonWin = path.resolve(backendDir, ".venv", "Scripts", "python.exe");
const venvPythonPosix = path.resolve(backendDir, ".venv", "bin", "python");

let pythonCmd = "python";
if (isWindows && fs.existsSync(venvPythonWin)) {
  pythonCmd = venvPythonWin;
} else if (fs.existsSync(venvPythonPosix)) {
  pythonCmd = venvPythonPosix;
}

const backend = spawnSync(
  pythonCmd,
  ["-c", "import app.main; print('[verify] Backend app.main imported successfully.')"],
  {
    cwd: backendDir,
    stdio: "inherit",
    env: {
      ...process.env,
      PYTHONPATH: backendDir,
      SUPABASE_URL: process.env.SUPABASE_URL || "https://placeholder.supabase.co",
      SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || "placeholder-jwt-secret-placeholder-32-chars",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key",
    },
  }
);

if (backend.status !== 0) {
  console.error("\x1b[31m%s\x1b[0m", "[verify] Backend import verification failed!");
  process.exit(backend.status || 1);
}

console.log("\x1b[32m%s\x1b[0m", "[verify] All verifications passed successfully!");
