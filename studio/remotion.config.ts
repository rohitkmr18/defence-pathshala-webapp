import { Config } from "@remotion/cli/config";

// Headless Chromium preinstalled in the cloud image; swiftshader/ANGLE gives
// deterministic CPU WebGL so Three.js scenes render without a GPU.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ?? "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
);
Config.setChromiumOpenGlRenderer("swangle");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setConcurrency(2);
Config.setPublicDir("public");
