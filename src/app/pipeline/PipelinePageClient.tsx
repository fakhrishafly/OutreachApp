"use client";

import { useEffect, useMemo, useState } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { PeriodeFilterBar } from "@/components/filters/PeriodeFilterBar";
import { defaultPeriodeFilter, periodeMatches, type PeriodeFilterValue } from "@/lib/filters";
import { computeLatestPerStakeholder } from "@/lib/pipeline";
import type { Interaction, Stage, StakeholderType } from "@/lib/types";

export default function PipelinePageClient() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<PeriodeFilterValue>(() => defaultPeriodeFilter());
  const [typeFilter, setTypeFilter] = useState<StakeholderType | "">("");
  const [picFilter, setPicFilter] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interactions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat data pipeline");
      setInteractions(data.interactions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data pipeline");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const picOptions = useMemo(() => {
    const set = new Set<string>();
    for (const i of interactions) if (i.pic_name) set.add(i.pic_name);
    return Array.from(set).sort();
  }, [interactions]);

  const cards = useMemo(() => {
    const filtered = interactions.filter((i) => periodeMatches(filter, i.periode));
    let result = computeLatestPerStakeholder(filtered);
    if (typeFilter) result = result.filter((c) => c.stakeholder_type === typeFilter);
    if (picFilter) result = result.filter((c) => c.latest.pic_name === picFilter);
    return result;
  }, [interactions, filter, typeFilter, picFilter]);

  async function handleStageChange(stakeholderId: string, newStage: Stage) {
    const card = cards.find((c) => c.stakeholder_id === stakeholderId);
    if (!card) return;
    const interactionId = card.latest.id;
    const previousStage = card.latest.stage_after;
    if (previousStage === newStage) return;

    setError("");
    setInteractions((prev) =>
      prev.map((i) => (i.id === interactionId ? { ...i, stage_after: newStage } : i))
    );

    try {
      const res = await fetch(`/api/interactions/${interactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_after: newStage }),
      });
      if (!res.ok) throw new Error("Gagal mengubah stage");
    } catch {
      setInteractions((prev) =>
        prev.map((i) => (i.id === interactionId ? { ...i, stage_after: previousStage } : i))
      );
      setError("Gagal mengubah stage. Coba lagi.");
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-gray-900">Pipeline</h1>
        <p className="text-sm text-gray-500">
          Status semua stakeholder di sepanjang pipeline. Geser kartu atau ganti lewat dropdown
          untuk update stage dengan cepat.
        </p>
      </div>

      <PeriodeFilterBar value={filter} onChange={setFilter}>
        <PipelineFilters
          type={typeFilter}
          onTypeChange={setTypeFilter}
          pic={picFilter}
          onPicChange={setPicFilter}
          picOptions={picOptions}
        />
      </PeriodeFilterBar>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">Memuat pipeline...</p>
      ) : cards.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Tidak ada data untuk filter ini.</p>
      ) : (
        <KanbanBoard cards={cards} onStageChange={handleStageChange} />
      )}
    </div>
  );
}
