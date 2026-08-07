"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search } from "lucide-react";
import { STAKEHOLDER_TYPES, type Stakeholder, type StakeholderType } from "@/lib/types";
import { Field, inputClass } from "./Field";

export function StepStakeholder({
  stakeholders,
  loading,
  selected,
  onSelect,
  onCreated,
}: {
  stakeholders: Stakeholder[];
  loading: boolean;
  selected: Stakeholder | null;
  onSelect: (s: Stakeholder) => void;
  onCreated: (s: Stakeholder) => void;
}) {
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<StakeholderType | "">("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? stakeholders.filter((s) => s.name.toLowerCase().includes(q))
      : stakeholders;
    return list.slice(0, 50);
  }, [stakeholders, query]);

  async function handleCreate() {
    setError("");
    if (!name.trim() || !type) {
      setError("Nama dan tipe wajib diisi.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/stakeholders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah stakeholder");
      onCreated(data.stakeholder);
      setShowNew(false);
      setName("");
      setType("");
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah stakeholder");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Cari Stakeholder">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama lembaga/institusi..."
            className={inputClass + " pl-9"}
          />
        </div>
      </Field>

      <div className="max-h-64 divide-y divide-gray-100 overflow-y-auto rounded-md border border-gray-200">
        {loading && <p className="p-3 text-sm text-gray-400">Memuat...</p>}
        {!loading && filtered.length === 0 && (
          <p className="p-3 text-sm text-gray-400">
            Tidak ada hasil. Tambahkan stakeholder baru di bawah.
          </p>
        )}
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50 ${
              selected?.id === s.id ? "bg-gray-50" : ""
            }`}
          >
            <span>
              <span className="block font-medium text-gray-900">{s.name}</span>
              <span className="block text-xs text-gray-500">{s.type}</span>
            </span>
            {selected?.id === s.id && <Check size={16} className="shrink-0 text-gray-900" />}
          </button>
        ))}
      </div>

      {!showNew && (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Plus size={16} /> Tambah Stakeholder Baru
        </button>
      )}

      {showNew && (
        <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3">
          <Field label="Nama Lembaga/Institusi">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mis. Universitas Indonesia"
              className={inputClass}
            />
          </Field>
          <Field label="Tipe">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as StakeholderType)}
              className={inputClass}
            >
              <option value="">Pilih tipe...</option>
              {STAKEHOLDER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={creating}
              onClick={handleCreate}
              className="rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {creating ? "Menyimpan..." : "Simpan & Pilih"}
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="rounded-md px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div className="rounded-md border border-gray-900 bg-gray-900/5 px-3 py-2.5 text-sm">
          <span className="text-gray-500">Dipilih: </span>
          <span className="font-medium text-gray-900">{selected.name}</span>
          <span className="text-gray-500"> · {selected.type}</span>
        </div>
      )}
    </div>
  );
}
