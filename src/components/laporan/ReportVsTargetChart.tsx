"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartEmptyState } from "@/components/dashboard/ChartEmptyState";
import { CHART_NEUTRAL } from "@/lib/colors";
import type { VisitVsTargetPoint } from "@/lib/analytics";

export function ReportVsTargetChart({ data }: { data: VisitVsTargetPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.actual + d.target, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Kunjungan Aktual vs Target</h2>
      <p className="mb-3 text-xs text-gray-400">Periode terpilih</p>
      {total === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid stroke={CHART_NEUTRAL.grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="actual" name="Aktual" fill={CHART_NEUTRAL.primary} radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar
              dataKey="target"
              name="Target"
              fill={CHART_NEUTRAL.secondary}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
