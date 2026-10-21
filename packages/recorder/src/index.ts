/** Settings for the optional session recorder. */
export interface RecorderConfig {
  /** Upload URL on the server. */
  endpoint: string;
  /** Share of sessions to record, 0..1. */
  sampleRate: number;
  /** Mask all text and inputs (default true, never turned off for production). */
  maskAll: boolean;
}

/** One batch of recorded events for one session. */
export interface RecordingChunk {
  /** Random per-session id, not linked to any person. */
  sessionId: string;
  variant: string;
  /** Opaque rrweb events. */
  events: readonly unknown[];
}
