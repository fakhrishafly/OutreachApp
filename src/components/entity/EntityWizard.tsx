"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Stakeholder } from "@/lib/types";
import { StepDetail } from "./StepDetail";
import { StepHasil } from "./StepHasil";
import { StepReview } from "./StepReview";
import { StepStakeholder } from "./StepStakeholder";
import { WizardProgress } from "./WizardProgress";
import { initialDetailForm, initialHasilForm, type DetailForm, type HasilForm } from "./wizard-types";

export function EntityWizard({ onSaved }: { onSaved?: () => void }) {
  const [step, setStep] = useState(1);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loadingStakeholders, setLoadingStakeholders] = useState(true);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [detail, setDetail] = useState<DetailForm>(initialDetailForm);
  const [hasil, setHasil] = useState<HasilForm>(() => initialHasilForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  async function loadStakeholders() {
    setLoadingStakeholders(true);
    try {
      const res = await fetch("/api/stakeholders");
      const data = await res.json();
      if (res.ok) setStakeholders(data.stakeholders ?? []);
    } finally {
      setLoadingStakeholders(false);
    }
  }

  useEffect(() => {
    loadStakeholders();
  }, []);

  function resetWizard() {
    setStep(1);
    setSelectedStakeholder(null);
    setDetail(initialDetailForm);
    setHasil(initialHasilForm());
    setSaveError("");
    setSaved(false);
  }

  function handleStakeholderCreated(s: Stakeholder) {
    setStakeholders((prev) => [s, ...prev]);
    setSelectedStakeholder(s);
  }

  function canProceed() {
    if (step === 1) return Boolean(selectedStakeholder);
    if (step === 2) return Boolean(detail.tujuan && detail.source && detail.potential_score);
    if (step === 3) return Boolean(hasil.periode && hasil.stage_after);
    return true;
  }

  async function handleSubmit() {
    if (!selectedStakeholder) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stakeholder_id: selectedStakeholder.id,
          ...detail,
          ...hasil,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan kunjungan");
      setSaved(true);
      onSaved?.();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan kunjungan");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-14 text-center">
        <CheckCircle2 size={40} className="text-emerald-600" />
        <p className="text-base font-semibold text-gray-900">Kunjungan berhasil disimpan</p>
        <p className="text-sm text-gray-500">Data tercatat di Google Sheets.</p>
        <button
          type="button"
          onClick={resetWizard}
          className="mt-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Isi Kunjungan Baru
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-6">
        <WizardProgress step={step} />
      </div>

      {step === 1 && (
        <StepStakeholder
          stakeholders={stakeholders}
          loading={loadingStakeholders}
          selected={selectedStakeholder}
          onSelect={setSelectedStakeholder}
          onCreated={handleStakeholderCreated}
        />
      )}
      {step === 2 && <StepDetail value={detail} onChange={setDetail} />}
      {step === 3 && <StepHasil value={hasil} onChange={setHasil} />}
      {step === 4 && selectedStakeholder && (
        <StepReview stakeholder={selectedStakeholder} detail={detail} hasil={hasil} onEdit={setStep} />
      )}

      {saveError && <p className="mt-4 text-sm text-red-600">{saveError}</p>}

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="rounded-md px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-0"
        >
          Kembali
        </button>
        {step < 4 ? (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-40"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Kunjungan"}
          </button>
        )}
      </div>
    </div>
  );
}
