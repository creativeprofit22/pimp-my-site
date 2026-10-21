/** A message to the site owner. */
export interface NotifyMessage {
  title: string;
  body: string;
  /** Optional approve/reject URLs for a pending change. */
  approveUrl?: string;
  rejectUrl?: string;
}

/** Anything that can deliver a message (Discord webhook first). */
export interface Notifier {
  send(message: NotifyMessage): Promise<void>;
}
