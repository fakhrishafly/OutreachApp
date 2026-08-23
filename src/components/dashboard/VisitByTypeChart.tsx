"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_NEUTRAL } from "@/lib/colors";
import type { TypeVisitPoint } from "@/lib/analytics";
import { ChartEmptyState } from "./ChartEmptyState";

export function VisitByTypeChart({ data }: { data: TypeVisitPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Visit per Tipe Stakeholder</h2>
      <p className="mb-3 text-xs text-gray-400">Jumlah kunjungan tercatat per tipe</p>
      {total === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ left: -20, bottom: 8 }}>
            <CartesianGrid stroke={CHART_NEUTRAL.grid} vertical={false} />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={55}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_NEUTRAL.primary} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
