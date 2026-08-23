import type { Interaction, StakeholderType } from "./types";

export interface PipelineCard {
  stakeholder_id: string;
  stakeholder_name: string;
  stakeholder_type: StakeholderType | undefined;
  /** The most recent interaction for this stakeholder (within whatever set was passed in). */
  latest: Interaction;
}

/**
 * Collapses an interaction list down to one card per stakeholder, keeping
 * only the most recent interaction. Assumes `interactions` is already
 * sorted newest-first (as `/api/interactions` returns it).
 */
export function computeLatestPerStakeholder(interactions: Interaction[]): PipelineCard[] {
  const seen = new Map<string, PipelineCard>();
  for (const interaction of interactions) {
    if (!seen.has(interaction.stakeholder_id)) {
      seen.set(interaction.stakeholder_id, {
        stakeholder_id: interaction.stakeholder_id,
        stakeholder_name: interaction.stakeholder_name ?? "-",
        stakeholder_type: interaction.stakeholder_type,
        latest: interaction,
      });
    }
  }
  return Array.from(seen.values());
}
