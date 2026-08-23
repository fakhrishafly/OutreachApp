import { STAKEHOLDER_TYPES, type StakeholderType } from "@/lib/types";

const selectClass =
  "rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

export function PipelineFilters({
  type,
  onTypeChange,
  pic,
  onPicChange,
  picOptions,
}: {
  type: StakeholderType | "";
  onTypeChange: (value: StakeholderType | "") => void;
  pic: string;
  onPicChange: (value: string) => void;
  picOptions: string[];
}) {
  return (
    <>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as StakeholderType | "")}
        className={selectClass}
      >
        <option value="">Semua Tipe</option>
        {STAKEHOLDER_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select value={pic} onChange={(e) => onPicChange(e.target.value)} className={selectClass}>
        <option value="">Semua PIC</option>
        {picOptions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </>
  );
}
