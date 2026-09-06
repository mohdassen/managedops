import type { ReadinessItem } from './domain';

export type ReadinessDecision = 'GO' | 'CONDITIONAL_GO' | 'NO_GO' | 'INSUFFICIENT_EVIDENCE';

export interface ReadinessResult {
  score: number;
  decision: ReadinessDecision;
  criticalGaps: ReadinessItem[];
  blocked: ReadinessItem[];
  unknown: ReadinessItem[];
}

const weights: Record<ReadinessItem['status'], number> = {
  ready: 1,
  partial: 0.5,
  blocked: 0,
  unknown: 0,
};

export function calculateReadiness(items: ReadinessItem[]): ReadinessResult {
  if (!items.length) return { score: 0, decision: 'INSUFFICIENT_EVIDENCE', criticalGaps: [], blocked: [], unknown: [] };

  const score = Math.round((items.reduce((sum, item) => sum + weights[item.status], 0) / items.length) * 100);
  const criticalGaps = items.filter(item => item.critical && item.status !== 'ready');
  const blocked = items.filter(item => item.status === 'blocked');
  const unknown = items.filter(item => item.status === 'unknown');

  let decision: ReadinessDecision;
  if (criticalGaps.length || score < 70) decision = 'NO_GO';
  else if (score >= 85) decision = 'GO';
  else decision = 'CONDITIONAL_GO';

  return { score, decision, criticalGaps, blocked, unknown };
}
