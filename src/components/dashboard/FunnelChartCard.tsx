"use client";

import { Cell, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import { STAGE_HEX } from "@/lib/colors";
import type { FunnelPoint } from "@/lib/analytics";
import { ChartEmptyState } from "./ChartEmptyState";

export function FunnelChartCard({ data }: { data: FunnelPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  // Combine stage + count into one label rendered inside each band — with
  // position="right" the label lands outside the band, which gets clipped
  // whenever a segment spans the chart's full width (e.g. equal-size stages).
  const labeled = data.map((d) => ({ ...d, label: `${d.stage} — ${d.count}` }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Funnel Pipeline</h2>
      <p className="mb-3 text-xs text-gray-400">Jumlah stakeholder per stage</p>
      {total === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <FunnelChart>
            <Tooltip formatter={(value) => [`${value} stakeholder`, ""]} />
            <Funnel dataKey="count" data={labeled} isAnimationActive={false}>
              <LabelList
                position="center"
                dataKey="label"
                fill="#ffffff"
                stroke="none"
                fontSize={12}
                fontWeight={500}
              />
              {data.map((d) => (
                <Cell key={d.stage} fill={STAGE_HEX[d.stage]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
