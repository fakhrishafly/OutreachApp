"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateReportPptx, type ReportData } from "@/lib/report";

export function GenerateReportButton({ data, disabled }: { data: ReportData; disabled?: boolean }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setGenerating(true);
    try {
      await generateReportPptx(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat laporan.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || generating}
        className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {generating ? "Membuat laporan..." : "Generate Laporan (PPT)"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
