"use client";

import { useEffect, useMemo, useState } from "react";
import { FollowUpList } from "@/components/dashboard/FollowUpList";
import { FunnelChartCard } from "@/components/dashboard/FunnelChartCard";
import { TargetEditor } from "@/components/dashboard/TargetEditor";
import { TopLeadsList } from "@/components/dashboard/TopLeadsList";
import { VisitByTypeChart } from "@/components/dashboard/VisitByTypeChart";
import { VisitVsTargetChart } from "@/components/dashboard/VisitVsTargetChart";
import { PeriodeFilterBar } from "@/components/filters/PeriodeFilterBar";
import {
  computeFollowUpList,
  computeFunnel,
  computeLatestPerStakeholder,
  computeTopLeads,
  computeVisitVsTarget,
  computeVisitsByType,
} from "@/lib/analytics";
import { defaultPeriodeFilter, periodeMatches, type PeriodeFilterValue } from "@/lib/filters";
import type { Interaction, Target } from "@/lib/types";

export default function DashboardPageClient() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<PeriodeFilterValue>(() => defaultPeriodeFilter());

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [interactionsRes, targetsRes] = await Promise.all([
        fetch("/api/interactions"),
        fetch("/api/targets"),
      ]);
      const interactionsData = await interactionsRes.json();
      const targetsData = await targetsRes.json();
      if (!interactionsRes.ok) throw new Error(interactionsData.error || "Gagal memuat data");
      if (!targetsRes.ok) throw new Error(targetsData.error || "Gagal memuat data target");
      setInteractions(interactionsData.interactions ?? []);
      setTargets(targetsData.targets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredInteractions = useMemo(
    () => interactions.filter((i) => periodeMatches(filter, i.periode)),
    [interactions, filter]
  );
  const cards = useMemo(
    () => computeLatestPerStakeholder(filteredInteractions),
    [filteredInteractions]
  );

  const funnelData = useMemo(() => computeFunnel(cards), [cards]);
  const visitsByType = useMemo(() => computeVisitsByType(filteredInteractions), [filteredInteractions]);
  // Deliberately uses the unfiltered `interactions` — this chart always shows every period.
  const visitVsTarget = useMemo(
    () => computeVisitVsTarget(interactions, targets),
    [interactions, targets]
  );
  const followUps = useMemo(() => computeFollowUpList(cards), [cards]);
  const topLeads = useMemo(() => computeTopLeads(cards), [cards]);

  function handleTargetSaved(target: Target) {
    setTargets((prev) => {
      const exists = prev.some((t) => t.periode === target.periode);
      return exists ? prev.map((t) => (t.periode === target.periode ? target : t)) : [...prev, target];
    });
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Analytics & grafik ringkasan outreach.</p>
      </div>

      <PeriodeFilterBar value={filter} onChange={setFilter} />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">Memuat dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FunnelChartCard data={funnelData} />
          <VisitByTypeChart data={visitsByType} />

          <div className="lg:col-span-2">
            <VisitVsTargetChart data={visitVsTarget} />
          </div>

          <div className="lg:col-span-2">
            <TargetEditor targets={targets} onSaved={handleTargetSaved} />
          </div>

          <FollowUpList cards={followUps} />
          <TopLeadsList cards={topLeads} />
        </div>
      )}
    </div>
  );
}
