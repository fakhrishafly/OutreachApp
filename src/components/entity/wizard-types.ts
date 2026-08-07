import { getCurrentPeriode } from "@/lib/periode";
import type { PotentialScore, Source, Stage } from "@/lib/types";

export interface DetailForm {
  tujuan: string;
  pic_name: string;
  pic_role: string;
  phone: string;
  email: string;
  source: Source | "";
  potential_score: PotentialScore | "";
}

export interface HasilForm {
  periode: string;
  stage_after: Stage | "";
  hasil_pembahasan: string;
  next_action: string;
  next_follow_up_date: string;
  attachment: string;
}

export const initialDetailForm: DetailForm = {
  tujuan: "",
  pic_name: "",
  pic_role: "",
  phone: "",
  email: "",
  source: "",
  potential_score: "",
};

export function initialHasilForm(): HasilForm {
  return {
    periode: getCurrentPeriode().value,
    stage_after: "",
    hasil_pembahasan: "",
    next_action: "",
    next_follow_up_date: "",
    attachment: "",
  };
}
