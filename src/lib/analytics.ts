import { buildPeriodeTimeline, periodeFromValue } from "./periode";
import { computeLatestPerStakeholder, type PipelineCard } from "./pipeline";
import { STAGES, STAKEHOLDER_TYPES, stageOrder, type Interaction, type Target } from "./types";

export interface FunnelPoint {
  stage: (typeof STAGES)[number];
  count: number;
}

/** Count of stakeholders currently sitting at each stage (by their latest interaction). */
export function computeFunnel(cards: PipelineCard[]): FunnelPoint[] {
  const counts = new Map<string, number>(STAGES.map((s) => [s, 0]));
  for (const card of cards) {
    counts.set(card.latest.stage_after, (counts.get(card.latest.stage_after) ?? 0) + 1);
  }
  return STAGES.map((stage) => ({ stage, count: counts.get(stage) ?? 0 }));
}

export interface TypeVisitPoint {
  type: string;
  count: number;
}

/** Count of visits (interactions, not unique stakeholders) per stakeholder type. */
export function computeVisitsByType(interactions: Interaction[]): TypeVisitPoint[] {
  const counts = new Map<string, number>(STAKEHOLDER_TYPES.map((t) => [t, 0]));
  for (const i of interactions) {
    const type = i.stakeholder_type ?? "Lainnya";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return STAKEHOLDER_TYPES.map((type) => ({ type, count: counts.get(type) ?? 0 }));
}

export interface VisitVsTargetPoint {
  periode: string;
  label: string;
  actual: number;
  target: number;
}

/**
 * Actual visits vs target, across every period from the earliest data point
 * to today — not filtered by the page's periode filter, per spec ("tampilkan
 * SEMUA periode yang tersedia").
 */
export function computeVisitVsTarget(
  interactions: Interaction[],
  targets: Target[]
): VisitVsTargetPoint[] {
  const timeline = buildPeriodeTimeline([
    ...interactions.map((i) => i.periode),
    ...targets.map((t) => t.periode),
  ]);

  const actualCounts = new Map<string, number>();
  for (const i of interactions) {
    if (!i.periode) continue;
    actualCounts.set(i.periode, (actualCounts.get(i.periode) ?? 0) + 1);
  }
  const targetMap = new Map(targets.map((t) => [t.periode, t.target_visit]));

  return timeline.map((periode) => ({
    periode,
    label: periodeFromValue(periode).shortLabel,
    actual: actualCounts.get(periode) ?? 0,
    target: targetMap.get(periode) ?? 0,
  }));
}

/** Cards with an upcoming follow-up date, nearest first. */
export function computeFollowUpList(cards: PipelineCard[], limit = 10): PipelineCard[] {
  return cards
    .filter((c) => c.latest.next_follow_up_date)
    .sort((a, b) => a.latest.next_follow_up_date.localeCompare(b.latest.next_follow_up_date))
    .slice(0, limit);
}

/** Hot leads first, then by how far along the pipeline they've progressed. */
export function computeTopLeads(cards: PipelineCard[], limit = 10): PipelineCard[] {
  const scoreRank = { Hot: 0, Warm: 1, Cold: 2 } as const;
  return [...cards]
    .sort((a, b) => {
      const scoreDiff = scoreRank[a.latest.potential_score] - scoreRank[b.latest.potential_score];
      if (scoreDiff !== 0) return scoreDiff;
      return stageOrder(b.latest.stage_after) - stageOrder(a.latest.stage_after);
    })
    .slice(0, limit);
}

export { computeLatestPerStakeholder };
