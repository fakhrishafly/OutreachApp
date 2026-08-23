"use client";

import { useDraggable } from "@dnd-kit/core";
import { CalendarClock } from "lucide-react";
import { POTENTIAL_SCORE_STYLE } from "@/lib/colors";
import type { PipelineCard } from "@/lib/pipeline";
import { STAGES, type Stage } from "@/lib/types";

export function KanbanCardItem({
  card,
  onStageChange,
}: {
  card: PipelineCard;
  onStageChange: (stakeholderId: string, newStage: Stage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.stakeholder_id,
  });
  const score = POTENTIAL_SCORE_STYLE[card.latest.potential_score];

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-gray-200 bg-white p-2.5 text-xs shadow-sm ${
        isDragging ? "relative z-20 opacity-50" : ""
      }`}
    >
      <div {...listeners} {...attributes} className="cursor-grab touch-none active:cursor-grabbing">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{card.stakeholder_name}</p>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${score.badge}`}
          >
            {score.emoji}
          </span>
        </div>
        <p className="mt-0.5 text-gray-500">
          {card.stakeholder_type} · {card.latest.tujuan}
        </p>
        {card.latest.pic_name && (
          <p className="mt-1 text-gray-400">PIC: {card.latest.pic_name}</p>
        )}
        {card.latest.next_follow_up_date && (
          <p className="mt-1 flex items-center gap-1 text-gray-400">
            <CalendarClock size={11} /> {card.latest.next_follow_up_date}
          </p>
        )}
      </div>

      <select
        value={card.latest.stage_after}
        onChange={(e) => onStageChange(card.stakeholder_id, e.target.value as Stage)}
        className="mt-2 w-full rounded border border-gray-200 bg-gray-50 px-1.5 py-1 text-[11px] text-gray-600"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
