"use client";

import { useState } from "react";
import { Loader2, Mic, MicOff, Paperclip, X } from "lucide-react";
import { STAGE_STYLE } from "@/lib/colors";
import { STAGES } from "@/lib/types";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Field, inputClass } from "./Field";
import { PeriodeSelect } from "./PeriodeSelect";
import type { HasilForm } from "./wizard-types";

export function StepHasil({
  value,
  onChange,
}: {
  value: HasilForm;
  onChange: (value: HasilForm) => void;
}) {
  function set<K extends keyof HasilForm>(key: K, v: HasilForm[K]) {
    onChange({ ...value, [key]: v });
  }

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");

  const { supported, listening, start, stop } = useSpeechToText({
    onResult: (text) =>
      set("hasil_pembahasan", (value.hasil_pembahasan ? value.hasil_pembahasan + " " : "") + text),
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    setFileName(file.name);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      set("attachment", data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal");
      setFileName("");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Periode" required>
        <PeriodeSelect value={value.periode} onChange={(v) => set("periode", v)} />
      </Field>

      <Field label="Stage Setelah Kunjungan" required>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage) => {
            const style = STAGE_STYLE[stage];
            const active = value.stage_after === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => set("stage_after", stage)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? style.badge + " ring-1 ring-gray-900 ring-offset-1"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Hasil Pembahasan">
        <div className="relative">
          <textarea
            value={value.hasil_pembahasan}
            onChange={(e) => set("hasil_pembahasan", e.target.value)}
            rows={4}
            placeholder="Ringkasan hasil diskusi..."
            className={inputClass + " resize-none pr-11"}
          />
          {supported && (
            <button
              type="button"
              onClick={listening ? stop : start}
              className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                listening
                  ? "animate-pulse bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label={listening ? "Berhenti merekam" : "Mulai voice-to-text"}
            >
              {listening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          )}
        </div>
        {!supported && (
          <p className="mt-1 text-xs text-gray-400">
            Voice-to-text tidak didukung di browser ini.
          </p>
        )}
      </Field>

      <Field label="Next Action">
        <input
          value={value.next_action}
          onChange={(e) => set("next_action", e.target.value)}
          placeholder="mis. Kirim proposal kerja sama"
          className={inputClass}
        />
      </Field>

      <Field label="Next Follow-up Date">
        <input
          type="date"
          value={value.next_follow_up_date}
          onChange={(e) => set("next_follow_up_date", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Attachment (opsional)">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-500 hover:border-gray-400">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
          <span className="truncate">
            {uploading ? "Mengunggah..." : fileName || "Unggah foto dokumentasi / kartu nama"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
        {value.attachment && !uploading && (
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <a
              href={value.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 underline"
            >
              Lihat lampiran
            </a>
            <button
              type="button"
              onClick={() => {
                set("attachment", "");
                setFileName("");
              }}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
      </Field>
    </div>
  );
}
