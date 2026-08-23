"use client";

import { useDroppable } from "@dnd-kit/core";
import { STAGE_STYLE } from "@/lib/colors";
import type { PipelineCard } from "@/lib/pipeline";
import type { Stage } from "@/lib/types";
import { KanbanCardItem } from "./KanbanCard";

export function KanbanColumn({
  stage,
  cards,
  onStageChange,
}: {
  stage: Stage;
  cards: PipelineCard[];
  onStageChange: (stakeholderId: string, newStage: Stage) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const style = STAGE_STYLE[stage];

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-lg border-t-4 bg-white ${style.accent} ${
        isOver ? "ring-2 ring-gray-900/20" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
        <h3 className="text-sm font-semibold text-gray-900">{stage}</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {cards.length}
        </span>
      </div>
      <div className="min-h-[120px] flex-1 space-y-2 p-2">
        {cards.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-gray-300">Kosong</p>
        )}
        {cards.map((card) => (
          <KanbanCardItem key={card.stakeholder_id} card={card} onStageChange={onStageChange} />
        ))}
      </div>
    </div>
  );
}
