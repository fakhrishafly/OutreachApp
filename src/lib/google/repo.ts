import {
  appendRow,
  genId,
  INTERACTION_HEADERS,
  readSheet,
  SHEET_NAMES,
  STAKEHOLDER_HEADERS,
} from "./sheets";
import type { Interaction, Stakeholder, StakeholderType } from "../types";

export async function listStakeholders(): Promise<Stakeholder[]> {
  const rows = await readSheet(SHEET_NAMES.stakeholder, STAKEHOLDER_HEADERS);
  return rows
    .map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type as StakeholderType,
      created_at: r.created_at,
    }))
    .filter((s) => s.id);
}

export async function createStakeholder(input: {
  name: string;
  type: StakeholderType;
}): Promise<Stakeholder> {
  const stakeholder: Stakeholder = {
    id: genId("STK"),
    name: input.name.trim(),
    type: input.type,
    created_at: new Date().toISOString(),
  };
  await appendRow(SHEET_NAMES.stakeholder, STAKEHOLDER_HEADERS, stakeholder);
  return stakeholder;
}

export async function listInteractions(): Promise<Interaction[]> {
  const [rows, stakeholders] = await Promise.all([
    readSheet(SHEET_NAMES.interaction, INTERACTION_HEADERS),
    listStakeholders(),
  ]);
  const stakeholderMap = new Map(stakeholders.map((s) => [s.id, s]));

  return rows
    .map((r) => {
      const stakeholder = stakeholderMap.get(r.stakeholder_id);
      return {
        id: r.id,
        stakeholder_id: r.stakeholder_id,
        tujuan: r.tujuan,
        pic_name: r.pic_name,
        pic_role: r.pic_role,
        phone: r.phone,
        email: r.email,
        source: r.source,
        potential_score: r.potential_score,
        periode: r.periode,
        stage_after: r.stage_after,
        hasil_pembahasan: r.hasil_pembahasan,
        next_action: r.next_action,
        next_follow_up_date: r.next_follow_up_date,
        attachment: r.attachment,
        created_at: r.created_at,
        stakeholder_name: stakeholder?.name ?? "(stakeholder tidak ditemukan)",
        stakeholder_type: stakeholder?.type,
      } as Interaction;
    })
    .filter((i) => i.id)
    .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
}

export async function createInteraction(
  input: Omit<Interaction, "id" | "created_at" | "stakeholder_name" | "stakeholder_type">
): Promise<Interaction> {
  const interaction: Interaction = {
    ...input,
    id: genId("INT"),
    created_at: new Date().toISOString(),
  };
  await appendRow(SHEET_NAMES.interaction, INTERACTION_HEADERS, interaction);
  return interaction;
}
