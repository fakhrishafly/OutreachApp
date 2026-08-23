"use client";

import { useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { PipelineCard } from "@/lib/pipeline";
import { STAGES, type Stage } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";

export function KanbanBoard({
  cards,
  onStageChange,
}: {
  cards: PipelineCard[];
  onStageChange: (stakeholderId: string, newStage: Stage) => void;
}) {
  const columns = useMemo(() => {
    const map = new Map<Stage, PipelineCard[]>(STAGES.map((s) => [s, []]));
    for (const card of cards) {
      map.get(card.latest.stage_after)?.push(card);
    }
    return map;
  }, [cards]);

  // PointerSensor drives desktop mouse drag. TouchSensor requires a brief
  // long-press before a drag starts, so a normal horizontal swipe still
  // scrolls the board on touch devices — the per-card stage <select> is the
  // primary, always-reliable way to move a card on mobile.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStage = over.id as Stage;
    const stakeholderId = String(active.id);
    const card = cards.find((c) => c.stakeholder_id === stakeholderId);
    if (!card || card.latest.stage_after === newStage) return;
    onStageChange(stakeholderId, newStage);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            cards={columns.get(stage) ?? []}
            onStageChange={onStageChange}
          />
        ))}
      </div>
    </DndContext>
  );
}
