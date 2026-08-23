"use client";

import type { ReactNode } from "react";
import type { PeriodeFilterValue } from "@/lib/filters";
import { CompactPeriodeSelect } from "./CompactPeriodeSelect";

export function PeriodeFilterBar({
  value,
  onChange,
  children,
}: {
  value: PeriodeFilterValue;
  onChange: (value: PeriodeFilterValue) => void;
  children?: ReactNode;
}) {
  return (
    <div className="sticky top-14 z-10 -mx-4 mb-5 border-b border-gray-200 bg-gray-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:top-0">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onChange({ ...value, mode: "single" })}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              value.mode === "single" ? "bg-gray-900 text-white" : "text-gray-600"
            }`}
          >
            Periode Tunggal
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, mode: "range" })}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              value.mode === "range" ? "bg-gray-900 text-white" : "text-gray-600"
            }`}
          >
            Rentang Periode
          </button>
        </div>

        {value.mode === "single" ? (
          <CompactPeriodeSelect
            value={value.periode}
            onChange={(periode) => onChange({ ...value, periode })}
          />
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CompactPeriodeSelect
              value={value.periodeFrom}
              onChange={(periodeFrom) => onChange({ ...value, periodeFrom })}
            />
            <span>s/d</span>
            <CompactPeriodeSelect
              value={value.periodeTo}
              onChange={(periodeTo) => onChange({ ...value, periodeTo })}
            />
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
