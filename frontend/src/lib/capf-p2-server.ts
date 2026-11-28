import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createUserClient } from "@/lib/supabase/server";
import {
  CAPF_P2_DEFAULT_DAILY_LIMIT,
  CAPF_P2_DEFAULT_MODEL,
  evaluationTool,
  systemPrompt,
  userPrompt,
  type CapfP2Target,
  type ImageInput,
} from "@/lib/capf-p2-evaluator";

export function capfP2Admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Evaluator database is not configured");
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function capfP2User() {
  const client = await createUserClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export function capfP2DailyLimit(): number {
  const n = Number(process.env.CAPF_P2_DAILY_LIMIT);
  return Number.isInteger(n) && n > 0 && n <= 100 ? n : CAPF_P2_DEFAULT_DAILY_LIMIT;
}

export function capfP2Model(): string {
  return process.env.CAPF_P2_MODEL || CAPF_P2_DEFAULT_MODEL;
}

export class EvaluatorUnavailable extends Error {}

interface ClaudeResult { input: unknown; inputTokens: number | null; outputTokens: number | null }

/** One forced tool call to the Claude Messages API. Throws on any failure. */
export async function callClaude(
  target: CapfP2Target,
  opts: { mode: "typed" | "photo"; answerText?: string; wordCount: number | null; images?: ImageInput[] },
): Promise<ClaudeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new EvaluatorUnavailable("ANTHROPIC_API_KEY is not set");
  const tool = evaluationTool(target.question);
  const content: unknown[] = [
    ...(opts.images ?? []).map((img) => ({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } })),
    { type: "text", text: userPrompt(target, { mode: opts.mode, wordCount: opts.wordCount, answerText: opts.answerText }) },
  ];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 110_000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: capfP2Model(),
        max_tokens: opts.mode === "photo" ? 6000 : 3000,
        system: systemPrompt(),
        tools: [tool],
        tool_choice: { type: "tool", name: tool.name },
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) throw new Error(`Claude API ${res.status}`);
    const body = (await res.json()) as { content?: { type: string; name?: string; input?: unknown }[]; usage?: { input_tokens?: number; output_tokens?: number } };
    const call = body.content?.find((c) => c.type === "tool_use" && c.name === tool.name);
    if (!call) throw new Error("No evaluation returned");
    return { input: call.input, inputTokens: body.usage?.input_tokens ?? null, outputTokens: body.usage?.output_tokens ?? null };
  } finally {
    clearTimeout(timer);
  }
}
