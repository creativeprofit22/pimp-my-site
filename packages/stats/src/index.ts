/** Visitors and "stayed 30s" counts for one variant over one window. */
export interface VisitCounts {
  variant: string;
  visitors: number;
  stayed30: number;
}

/** Outcome of the weekly decision rule (ADR 0004). */
export interface WeeklyDecision {
  outcome: "keep" | "promote" | "no-call";
  /** Variant that should be live after the decision. */
  winner: string;
  /** Short human-readable reason, shown in the weekly report. */
  reason: string;
}

/** Signature every decision rule implements. */
export type DecisionRule = (control: VisitCounts, challenger: VisitCounts) => WeeklyDecision;
