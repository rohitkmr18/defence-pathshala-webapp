export function analyticsEnvironment(): string {
  return process.env.NEXT_PUBLIC_DP_DEPLOYMENT_ENV || process.env.NODE_ENV || "development";
}

export function releaseContext() {
  return {
    deployment_environment: analyticsEnvironment(),
    git_sha: process.env.NEXT_PUBLIC_DP_GIT_SHA || "unknown",
  };
}
