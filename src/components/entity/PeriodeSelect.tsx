"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generatePeriodeList, getCurrentPeriode } from "@/lib/periode";

export function PeriodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [year, setYear] = useState(() =>
    value ? Number(value.split("-")[0]) : new Date().getFullYear()
  );
  const periods = useMemo(() => generatePeriodeList(year), [year]);
  const current = getCurrentPeriode();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setYear((y) => y - 1)}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Tahun sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-900">{year}</span>
        <button
          type="button"
          onClick={() => setYear((y) => y + 1)}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Tahun berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {periods.map((p) => {
          const active = value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="font-medium">{p.monthLabel}</div>
              <div className={active ? "text-gray-300" : "text-gray-400"}>{p.label}</div>
            </button>
          );
        })}
      </div>

      {value !== current.value && (
        <button
          type="button"
          onClick={() => {
            setYear(current.start.getFullYear());
            onChange(current.value);
          }}
          className="mt-2 text-xs font-medium text-gray-500 underline"
        >
          Gunakan periode berjalan ({current.monthLabel})
        </button>
      )}
    </div>
  );
}
