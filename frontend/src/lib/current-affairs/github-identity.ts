import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export const PUBLISH_AUDIENCE = "https://www.defencepathshala.in/api/current-affairs/automation";
export const PUBLISH_REPOSITORY = "rohitkmr18/defence-pathshala-webapp";
export const PUBLISH_WORKFLOW = `${PUBLISH_REPOSITORY}/.github/workflows/current-affairs-publish.yml@refs/heads/main`;
const issuer = "https://token.actions.githubusercontent.com";
const keys = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks`), { timeoutDuration: 5000 });

// Only the founder-triggered, main-branch publishing workflow is trusted.
// No Supabase role, browser cookie, or long-lived publishing key is accepted here.
export async function verifyPublishingIdentity(token: string, key: JWTVerifyGetKey = keys) {
  if (token.length > 12000) throw new Error("Invalid publishing identity");
  const { payload } = await jwtVerify(token, key, {
    issuer, audience: PUBLISH_AUDIENCE, algorithms: ["RS256"], maxTokenAge: "5m",
    requiredClaims: ["exp", "iat", "nbf", "jti", "sub", "run_id", "run_attempt"],
  });
  if (payload.repository !== PUBLISH_REPOSITORY || payload.repository_id !== "1387974858"
      || payload.repository_owner_id !== "321342611" || payload.actor_id !== "321342611"
      || payload.actor !== "rohitkmr18" || payload.ref !== "refs/heads/main"
      || payload.workflow_ref !== PUBLISH_WORKFLOW || payload.event_name !== "issues"
      || payload.runner_environment !== "github-hosted"
      || !/^\d+$/.test(String(payload.run_id)) || !/^\d+$/.test(String(payload.run_attempt))) {
    throw new Error("Publishing workflow not authorised");
  }
  return { actor: String(payload.actor), runId: String(payload.run_id), runAttempt: String(payload.run_attempt) };
}
