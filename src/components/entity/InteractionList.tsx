"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, RefreshCw, Search } from "lucide-react";
import { POTENTIAL_SCORE_STYLE, STAGE_STYLE } from "@/lib/colors";
import { periodeFromValue } from "@/lib/periode";
import type { Interaction } from "@/lib/types";

export function InteractionList({ refreshKey }: { refreshKey?: number | string }) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    load();
  }, [refreshKey]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interactions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat riwayat");
      setInteractions(data.interactions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat riwayat");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interactions;
    return interactions.filter((i) =>
      [i.stakeholder_name, i.tujuan, i.pic_name].some((v) =>
        (v ?? "").toLowerCase().includes(q)
      )
    );
  }, [interactions, query]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama stakeholder, tujuan, atau PIC..."
            className="w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <button
          type="button"
          onClick={load}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
          aria-label="Muat ulang"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && interactions.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">Memuat riwayat interaksi...</p>
      )}

      {!loading && filtered.length === 0 && !error && (
        <p className="py-8 text-center text-sm text-gray-400">
          Belum ada interaksi tercatat.
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((i) => (
          <InteractionCard key={i.id} interaction={i} />
        ))}
      </div>
    </div>
  );
}

function InteractionCard({ interaction }: { interaction: Interaction }) {
  const scoreStyle = interaction.potential_score
    ? POTENTIAL_SCORE_STYLE[interaction.potential_score]
    : null;
  const stageStyle = interaction.stage_after ? STAGE_STYLE[interaction.stage_after] : null;
  const periode = interaction.periode ? periodeFromValue(interaction.periode) : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">{interaction.stakeholder_name}</p>
          <p className="text-xs text-gray-500">
            {interaction.stakeholder_type} · {interaction.tujuan}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {scoreStyle && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${scoreStyle.badge}`}
            >
              {scoreStyle.emoji} {interaction.potential_score}
            </span>
          )}
          {stageStyle && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${stageStyle.badge}`}
            >
              {interaction.stage_after}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        {periode && <span>{periode.label}</span>}
        {interaction.pic_name && <span>PIC: {interaction.pic_name}</span>}
        {interaction.next_follow_up_date && (
          <span className="flex items-center gap-1">
            <CalendarClock size={12} /> {interaction.next_follow_up_date}
          </span>
        )}
      </div>
    </div>
  );
}
