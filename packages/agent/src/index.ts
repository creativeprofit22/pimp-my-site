/** A proposed change to one variant file. */
export interface VariantProposal {
  /** File name inside variants/, e.g. "hero.json". Nothing else may be written. */
  file: string;
  /** Full new JSON content. */
  content: Record<string, unknown>;
  /** Kind of idea, used to learn which kinds win. */
  ideaKind: string;
  rationale: string;
}

/** What the agent produces once a week. */
export interface WeeklyReport {
  weekStart: string;
  summary: string;
  proposals: VariantProposal[];
}
