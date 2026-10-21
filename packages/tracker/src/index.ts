/** Kinds of events the tracker sends. */
export type TrackerEventKind = "view" | "scroll" | "stayed30" | "exit";

/** One event as sent to the ingest endpoint. No personal data, no IP, no cookies. */
export interface TrackerEvent {
  kind: TrackerEventKind;
  /** Variant id shown to this visitor, e.g. "a". */
  variant: string;
  /** Page path, e.g. "/". */
  path: string;
  /** Milliseconds since epoch, client clock. */
  at: number;
  /** Scroll depth 0..100, only for kind "scroll". */
  depth?: number;
}

/** Settings the page passes to the tracker. */
export interface TrackerConfig {
  /** Ingest URL on the server, e.g. "/api/events". */
  endpoint: string;
  /** Variant id currently rendered. */
  variant: string;
}
