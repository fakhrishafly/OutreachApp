export const STAKEHOLDER_TYPES = [
  "Universitas/Politeknik",
  "Developer",
  "Kontraktor",
  "Konsultan",
  "Event or Exhibition",
  "Lainnya",
] as const;

export type StakeholderType = (typeof STAKEHOLDER_TYPES)[number];

export const SOURCES = [
  "Referral",
  "Cold Outreach",
  "Event",
  "Inbound",
  "Door to Door",
  "Tender Indonesia",
] as const;

export type Source = (typeof SOURCES)[number];

export const POTENTIAL_SCORES = ["Hot", "Warm", "Cold"] as const;

export type PotentialScore = (typeof POTENTIAL_SCORES)[number];

export const STAGES = [
  "Passive",
  "Lead",
  "Contacted",
  "Meeting",
  "Proposal Sent",
  "Consideration",
  "Conversion",
] as const;

export type Stage = (typeof STAGES)[number];

/** Stages that count as "pipeline aktif" — excludes Passive and Conversion. */
export const ACTIVE_PIPELINE_STAGES: Stage[] = [
  "Lead",
  "Contacted",
  "Meeting",
  "Proposal Sent",
  "Consideration",
];

/** Position of a stage along the pipeline sequence (higher = further along). */
export function stageOrder(stage: Stage): number {
  return STAGES.indexOf(stage);
}

export const TUJUAN_SUGGESTIONS = [
  "Meeting dengan Kaprodi",
  "Penjajakan Penelitian",
  "Presentasi Produk",
  "Follow-up Proposal",
  "Kunjungan Perkenalan",
  "Diskusi Kerja Sama",
  "Site Visit",
];

export interface Stakeholder {
  id: string;
  name: string;
  type: StakeholderType;
  created_at?: string;
}

export interface Interaction {
  id: string;
  stakeholder_id: string;
  tujuan: string;
  pic_name: string;
  pic_role: string;
  phone: string;
  email: string;
  source: Source;
  potential_score: PotentialScore;
  periode: string;
  stage_after: Stage;
  hasil_pembahasan: string;
  next_action: string;
  next_follow_up_date: string;
  attachment: string;
  created_at: string;
  // Joined at read time, not stored in the Interaction sheet.
  stakeholder_name?: string;
  stakeholder_type?: StakeholderType;
}

export interface Target {
  periode: string;
  target_visit: number;
}
