"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_NEUTRAL, STAGE_HEX } from "@/lib/colors";
import type { FunnelPoint } from "@/lib/analytics";
import { ChartEmptyState } from "./ChartEmptyState";

export function FunnelChartCard({ data }: { data: FunnelPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Funnel Pipeline</h2>
      <p className="mb-3 text-xs text-gray-400">Jumlah stakeholder per stage</p>
      {total === 0 ? (
        <ChartEmptyState />
      ) : (
        // A true tapered funnel assumes values shrink monotonically stage to
        // stage. Real pipelines don't work that way (a later stage can have
        // more stakeholders than an earlier one, or sit at 0) — with
        // Recharts' Funnel that produces overlapping, unreadable slivers.
        // A horizontal bar per stage stays legible for any distribution
        // while still reading top-to-bottom like a funnel.
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis
              type="category"
              dataKey="stage"
              width={100}
              tick={{ fontSize: 12, fill: "#374151" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: CHART_NEUTRAL.grid }}
              formatter={(value) => [`${value} stakeholder`, ""]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
              <LabelList
                dataKey="count"
                position="right"
                fill="#374151"
                fontSize={12}
                fontWeight={500}
              />
              {data.map((d) => (
                <Cell key={d.stage} fill={STAGE_HEX[d.stage]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
