"use client";

import { useEffect, useMemo, useState } from "react";
import { FunnelChartCard } from "@/components/dashboard/FunnelChartCard";
import { VisitByTypeChart } from "@/components/dashboard/VisitByTypeChart";
import { PeriodeFilterBar } from "@/components/filters/PeriodeFilterBar";
import { ActivePipelineList } from "@/components/laporan/ActivePipelineList";
import { ConversionList } from "@/components/laporan/ConversionList";
import { GenerateReportButton } from "@/components/laporan/GenerateReportButton";
import { ReportTable } from "@/components/laporan/ReportTable";
import { ReportVsTargetChart } from "@/components/laporan/ReportVsTargetChart";
import {
  computeActivePipelineList,
  computeConversionList,
  computeFunnel,
  computeLatestPerStakeholder,
  computeVisitVsTargetForRange,
  computeVisitsByType,
} from "@/lib/analytics";
import { defaultPeriodeFilter, periodeMatches, type PeriodeFilterValue } from "@/lib/filters";
import { periodeFromValue, periodeRange } from "@/lib/periode";
import type { ReportData } from "@/lib/report";
import type { Interaction, Target } from "@/lib/types";

export default function LaporanPageClient() {
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
      setError(err instanceof Error ? err.message : "Gagal memuat data laporan");
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
  const cards = useMemo(() => computeLatestPerStakeholder(filteredInteractions), [filteredInteractions]);

  const periodeLabel = useMemo(() => {
    if (filter.mode === "single") return periodeFromValue(filter.periode).label;
    const from = periodeFromValue(filter.periodeFrom);
    const to = periodeFromValue(filter.periodeTo);
    return from.value === to.value ? from.label : `${from.monthLabel} – ${to.monthLabel}`;
  }, [filter]);

  const periodeValues = useMemo(() => {
    if (filter.mode === "single") return [filter.periode];
    return periodeRange(filter.periodeFrom, filter.periodeTo);
  }, [filter]);

  const funnelData = useMemo(() => computeFunnel(cards), [cards]);
  const visitsByType = useMemo(() => computeVisitsByType(filteredInteractions), [filteredInteractions]);
  const vsTarget = useMemo(
    () => computeVisitVsTargetForRange(interactions, targets, periodeValues),
    [interactions, targets, periodeValues]
  );
  const conversions = useMemo(() => computeConversionList(filteredInteractions), [filteredInteractions]);
  const activePipeline = useMemo(() => computeActivePipelineList(cards), [cards]);

  const reportData: ReportData = {
    periodeLabel,
    funnel: funnelData,
    visitsByType,
    vsTarget,
    table: filteredInteractions,
    conversions,
    activePipeline,
  };

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-gray-900">Laporan</h1>
        <p className="text-sm text-gray-500">
          Preview lalu generate laporan PPT otomatis berdasarkan filter periode.
        </p>
      </div>

      <PeriodeFilterBar value={filter} onChange={setFilter} />

      <div className="mb-5">
        <GenerateReportButton data={reportData} disabled={loading || filteredInteractions.length === 0} />
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">Memuat data laporan...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FunnelChartCard data={funnelData} />
          <VisitByTypeChart data={visitsByType} />

          <div className="lg:col-span-2">
            <ReportVsTargetChart data={vsTarget} />
          </div>

          <div className="lg:col-span-2">
            <ReportTable rows={filteredInteractions} />
          </div>

          <ConversionList items={conversions} />
          <ActivePipelineList cards={activePipeline} />
        </div>
      )}
    </div>
  );
}
