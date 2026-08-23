"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_NEUTRAL } from "@/lib/colors";
import type { VisitVsTargetPoint } from "@/lib/analytics";
import { ChartEmptyState } from "./ChartEmptyState";

export function VisitVsTargetChart({ data }: { data: VisitVsTargetPoint[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Kunjungan Aktual vs Target</h2>
        <span className="text-[11px] text-gray-400">Semua periode</span>
      </div>
      <p className="mb-3 text-xs text-gray-400">Tidak dipengaruhi filter periode di atas</p>
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ left: -20 }}>
            <CartesianGrid stroke={CHART_NEUTRAL.grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Aktual"
              stroke={CHART_NEUTRAL.primary}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke={CHART_NEUTRAL.muted}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
