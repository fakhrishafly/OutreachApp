"use client";

import { useEffect, useState } from "react";
import { CompactPeriodeSelect } from "@/components/filters/CompactPeriodeSelect";
import { getCurrentPeriode } from "@/lib/periode";
import type { Target } from "@/lib/types";

export function TargetEditor({
  targets,
  onSaved,
}: {
  targets: Target[];
  onSaved: (target: Target) => void;
}) {
  const [periode, setPeriode] = useState(() => getCurrentPeriode().value);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = targets.find((t) => t.periode === periode);
    setValue(existing ? String(existing.target_visit) : "");
    setSaved(false);
  }, [periode, targets]);

  async function handleSave() {
    setError("");
    const target_visit = Number(value);
    if (!Number.isFinite(target_visit) || target_visit < 0) {
      setError("Masukkan angka valid (≥ 0).");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periode, target_visit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan target");
      onSaved(data.target);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan target");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Atur Target Kunjungan</h2>
      <p className="mb-3 text-xs text-gray-400">Target bisa diubah kapan saja per periode</p>
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Periode</label>
          <CompactPeriodeSelect value={periode} onChange={setPeriode} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Target Kunjungan</label>
          <input
            type="number"
            min={0}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSaved(false);
            }}
            placeholder="0"
            className="w-28 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        {saved && <span className="text-xs text-emerald-600">Tersimpan</span>}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
