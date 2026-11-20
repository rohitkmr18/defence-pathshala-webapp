// Background autosave for the mock player.
// Answers update on screen immediately; this queue sends them to the server one at a time,
// keeps only the latest state per question, and retries transient failures with backoff.
// The server write is an idempotent upsert, so retrying a request that may already have
// landed is safe.

export type MockOptionKey = "A" | "B" | "C" | "D";
export type MockSavePayload = {
  questionId: string;
  selected: MockOptionKey | null;
  markedForReview: boolean;
  timeSpentSeconds?: number;
};
export type MockSaveState = {
  pending: number;
  saving: boolean;
  failures: number;
  fatal: string | null;
};
/** Thrown by the sender. `status` is the HTTP status, or undefined for network errors and timeouts. */
export class MockSaveError extends Error {
  constructor(message: string, readonly status?: number) { super(message); }
}

// 400/401/403/404/409 will not succeed on retry (bad input, signed out, closed or expired session).
const FATAL = new Set([400, 401, 403, 404, 409]);
export const MOCK_RETRY_DELAYS_MS = [400, 1200, 3000, 6000, 10000];

type Options = {
  send: (payload: MockSavePayload) => Promise<void>;
  onChange?: (state: MockSaveState) => void;
  isOnline?: () => boolean;
  sleep?: (ms: number) => Promise<void>;
  delays?: number[];
};

export class MockSaveQueue {
  private queue = new Map<string, MockSavePayload>();
  private inflight: MockSavePayload | null = null;
  private running = false;
  private failures = 0;
  private fatal: string | null = null;
  private waiters: (() => void)[] = [];
  private readonly send: Options["send"];
  private readonly onChange: NonNullable<Options["onChange"]>;
  private readonly isOnline: NonNullable<Options["isOnline"]>;
  private readonly sleep: NonNullable<Options["sleep"]>;
  private readonly delays: number[];

  constructor(options: Options) {
    this.send = options.send;
    this.onChange = options.onChange ?? (() => {});
    this.isOnline = options.isOnline ?? (() => true);
    this.sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    this.delays = options.delays ?? MOCK_RETRY_DELAYS_MS;
  }

  /** Latest state wins: a newer payload for the same question replaces an unsent one. */
  enqueue(payload: MockSavePayload) {
    if (this.fatal) return;
    this.queue.delete(payload.questionId);
    this.queue.set(payload.questionId, payload);
    this.emit();
    void this.run();
  }

  /** Called when connectivity returns, or by a "retry now" control. */
  kick() { this.failures = 0; void this.run(); }

  /** Unsent payloads, including the one in flight (for local backup across reloads). */
  snapshot(): MockSavePayload[] {
    const list = [...this.queue.values()];
    if (this.inflight && !this.queue.has(this.inflight.questionId)) list.unshift(this.inflight);
    return list;
  }

  state(): MockSaveState {
    return { pending: this.snapshot().length, saving: this.running && this.inflight !== null, failures: this.failures, fatal: this.fatal };
  }

  /** Resolves true once everything is saved, false on timeout, a fatal error or going offline. */
  flush(timeoutMs = 15000): Promise<boolean> {
    if (this.isIdle()) return Promise.resolve(true);
    this.failures = 0;
    void this.run();
    return new Promise((resolve) => {
      const timer = setTimeout(() => { done(false); }, timeoutMs);
      const done = (ok: boolean) => { clearTimeout(timer); this.waiters = this.waiters.filter((w) => w !== check); resolve(ok); };
      const check = () => {
        if (this.isIdle()) done(true);
        else if (this.fatal || (!this.running && !this.isOnline())) done(false);
      };
      this.waiters.push(check);
    });
  }

  private isIdle() { return this.queue.size === 0 && this.inflight === null; }

  private emit() {
    this.onChange(this.state());
    for (const w of [...this.waiters]) w();
  }

  private async run() {
    if (this.running || this.fatal) return;
    this.running = true;
    try {
      while (this.queue.size && !this.fatal) {
        if (!this.isOnline()) break; // Resumes via kick() on the "online" event.
        const [id, payload] = this.queue.entries().next().value as [string, MockSavePayload];
        this.queue.delete(id);
        this.inflight = payload;
        this.emit();
        try {
          await this.send(payload);
          this.failures = 0;
        } catch (error) {
          const status = error instanceof MockSaveError ? error.status : undefined;
          if (status !== undefined && FATAL.has(status)) {
            this.fatal = error instanceof Error ? error.message : "Save rejected";
            this.queue.delete(id);
            this.queue.set(id, payload); // Keep it so a reload can report what was unsaved.
          } else {
            if (!this.queue.has(id)) this.queue.set(id, payload); // A newer answer supersedes this one.
            this.failures += 1;
            this.inflight = null;
            this.emit();
            await this.sleep(this.delays[Math.min(this.failures - 1, this.delays.length - 1)]);
          }
        } finally {
          this.inflight = null;
        }
      }
    } finally {
      this.running = false;
      this.emit();
    }
  }
}

const backupKey = (sessionId: string) => `mock-unsaved:${sessionId}`;

/** Unsent answers survive a reload in localStorage; they are re-sent on the next load. */
export function backupUnsaved(sessionId: string, payloads: MockSavePayload[]) {
  try {
    if (payloads.length) localStorage.setItem(backupKey(sessionId), JSON.stringify(payloads));
    else localStorage.removeItem(backupKey(sessionId));
  } catch { /* Storage is optional. */ }
}

export function readUnsaved(sessionId: string, validIds: Set<string>): MockSavePayload[] {
  try {
    const raw = JSON.parse(localStorage.getItem(backupKey(sessionId)) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((p): p is MockSavePayload =>
      p && typeof p === "object" && validIds.has(p.questionId)
      && (p.selected === null || ["A", "B", "C", "D"].includes(p.selected))
      && typeof p.markedForReview === "boolean"
      && (p.timeSpentSeconds === undefined || (Number.isInteger(p.timeSpentSeconds) && p.timeSpentSeconds >= 0)));
  } catch { return []; }
}
