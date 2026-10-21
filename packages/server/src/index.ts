/** An event as stored by the server. Never contains an IP address. */
export interface StoredEvent {
  /** Salted, daily-rotating visitor hash (see ADR 0003). */
  visitor: string;
  variant: string;
  kind: "view" | "scroll" | "stayed30" | "exit";
  path: string;
  /** Server receive time, ms since epoch. */
  at: number;
  depth?: number;
}

/** Counts per variant for a time window, fed to `@pms/stats`. */
export interface VariantCounts {
  variant: string;
  visitors: number;
  stayed30: number;
}

/** Storage boundary. SQLite now, daily JSON-lines files as fallback. */
export interface EventStore {
  append(events: readonly StoredEvent[]): Promise<void>;
  countsFor(fromMs: number, toMs: number): Promise<VariantCounts[]>;
}

/** A proposed variant waiting for human approval. */
export interface ApprovalRequest {
  id: string;
  /** File under variants/, e.g. "hero.json". */
  file: string;
  summary: string;
  createdAt: number;
}
