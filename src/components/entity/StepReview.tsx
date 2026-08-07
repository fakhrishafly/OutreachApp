import type { ReactNode } from "react";
import { POTENTIAL_SCORE_STYLE } from "@/lib/colors";
import { periodeFromValue } from "@/lib/periode";
import type { Stakeholder } from "@/lib/types";
import type { DetailForm, HasilForm } from "./wizard-types";

export function StepReview({
  stakeholder,
  detail,
  hasil,
  onEdit,
}: {
  stakeholder: Stakeholder;
  detail: DetailForm;
  hasil: HasilForm;
  onEdit: (step: number) => void;
}) {
  const periode = hasil.periode ? periodeFromValue(hasil.periode) : null;

  return (
    <div className="space-y-4">
      <ReviewSection title="Stakeholder" onEdit={() => onEdit(1)}>
        <p className="font-medium text-gray-900">{stakeholder.name}</p>
        <p className="text-gray-500">{stakeholder.type}</p>
      </ReviewSection>

      <ReviewSection title="Detail Kunjungan" onEdit={() => onEdit(2)}>
        <Row label="Tujuan" value={detail.tujuan || "-"} />
        <Row label="PIC" value={[detail.pic_name, detail.pic_role].filter(Boolean).join(" · ") || "-"} />
        <Row label="Kontak" value={[detail.phone, detail.email].filter(Boolean).join(" · ") || "-"} />
        <Row label="Source" value={detail.source || "-"} />
        <Row
          label="Potential"
          value={
            detail.potential_score
              ? `${POTENTIAL_SCORE_STYLE[detail.potential_score].emoji} ${detail.potential_score}`
              : "-"
          }
        />
      </ReviewSection>

      <ReviewSection title="Hasil & Tindak Lanjut" onEdit={() => onEdit(3)}>
        <Row label="Periode" value={periode ? periode.label : "-"} />
        <Row label="Stage" value={hasil.stage_after || "-"} />
        <Row label="Hasil Pembahasan" value={hasil.hasil_pembahasan || "-"} />
        <Row label="Next Action" value={hasil.next_action || "-"} />
        <Row label="Follow-up" value={hasil.next_follow_up_date || "-"} />
        <Row label="Attachment" value={hasil.attachment ? "Terlampir" : "-"} />
      </ReviewSection>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-gray-200 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs font-medium text-gray-600 underline">
          Ubah
        </button>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-right text-gray-900 break-words">{value}</span>
    </div>
  );
}
