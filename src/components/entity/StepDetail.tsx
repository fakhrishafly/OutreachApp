"use client";

import { POTENTIAL_SCORE_STYLE } from "@/lib/colors";
import { POTENTIAL_SCORES, SOURCES, TUJUAN_SUGGESTIONS } from "@/lib/types";
import { Field, inputClass } from "./Field";
import type { DetailForm } from "./wizard-types";

export function StepDetail({
  value,
  onChange,
}: {
  value: DetailForm;
  onChange: (value: DetailForm) => void;
}) {
  function set<K extends keyof DetailForm>(key: K, v: DetailForm[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="space-y-4">
      <Field label="Tujuan Kunjungan" required>
        <input
          list="tujuan-suggestions"
          value={value.tujuan}
          onChange={(e) => set("tujuan", e.target.value)}
          placeholder="mis. Meeting dengan Kaprodi"
          className={inputClass}
        />
        <datalist id="tujuan-suggestions">
          {TUJUAN_SUGGESTIONS.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nama PIC">
          <input
            value={value.pic_name}
            onChange={(e) => set("pic_name", e.target.value)}
            placeholder="Contact person"
            className={inputClass}
          />
        </Field>
        <Field label="Jabatan PIC">
          <input
            value={value.pic_role}
            onChange={(e) => set("pic_role", e.target.value)}
            placeholder="mis. Kaprodi"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="No. Telepon">
          <input
            type="tel"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="08xx-xxxx-xxxx"
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="nama@instansi.ac.id"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Source" required>
        <select
          value={value.source}
          onChange={(e) => set("source", e.target.value as DetailForm["source"])}
          className={inputClass}
        >
          <option value="">Pilih source...</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Potential Score" required>
        <div className="flex gap-2">
          {POTENTIAL_SCORES.map((score) => {
            const style = POTENTIAL_SCORE_STYLE[score];
            const active = value.potential_score === score;
            return (
              <button
                key={score}
                type="button"
                onClick={() => set("potential_score", score)}
                className={`flex-1 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? style.badge + " ring-1 ring-gray-900 ring-offset-1"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {style.emoji} {score}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
