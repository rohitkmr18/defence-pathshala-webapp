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

// 2. Backend offline test verification
console.log("\x1b[36m%s\x1b[0m", "[verify] 2/2 Verifying backend routes and imports offline...");

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
  ["-m", "pytest", "tests", "-q"],
  {
    cwd: backendDir,
    stdio: "inherit",
    env: {
      ...process.env,
      PYTHONPATH: backendDir,
    },
  }
);

if (backend.status !== 0) {
  console.error("\x1b[31m%s\x1b[0m", "[verify] Backend offline test verification failed!");
  process.exit(backend.status || 1);
}

console.log("\x1b[32m%s\x1b[0m", "[verify] All verifications passed successfully!");
