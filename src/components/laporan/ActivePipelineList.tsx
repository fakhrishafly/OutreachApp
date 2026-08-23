import { POTENTIAL_SCORE_STYLE, STAGE_STYLE } from "@/lib/colors";
import type { PipelineCard } from "@/lib/pipeline";

export function ActivePipelineList({ cards }: { cards: PipelineCard[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Pipeline Aktif</h2>
      <p className="mb-3 text-xs text-gray-400">10 stakeholder di stage Lead–Consideration</p>
      {cards.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Tidak ada pipeline aktif.</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {cards.map((c) => {
            const score = POTENTIAL_SCORE_STYLE[c.latest.potential_score];
            const stage = STAGE_STYLE[c.latest.stage_after];
            return (
              <div
                key={c.stakeholder_id}
                className="flex items-start justify-between gap-2 rounded-md border border-gray-100 px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{c.stakeholder_name}</p>
                  <p className="truncate text-gray-500">{c.stakeholder_type}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${score.badge}`}
                  >
                    {score.emoji} {c.latest.potential_score}
                  </span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${stage.badge}`}>
                    {c.latest.stage_after}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
