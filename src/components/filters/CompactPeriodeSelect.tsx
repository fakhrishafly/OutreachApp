"use client";

import { useMemo } from "react";
import { generatePeriodeOptions } from "@/lib/periode";

export function CompactPeriodeSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const options = useMemo(() => generatePeriodeOptions(), []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        "rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
      }
    >
      {options.map((p) => (
        <option key={p.value} value={p.value}>
          {p.monthLabel}
        </option>
      ))}
    </select>
  );
}
