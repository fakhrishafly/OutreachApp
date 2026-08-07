"use client";

import { useState } from "react";
import { EntityWizard } from "@/components/entity/EntityWizard";
import { InteractionList } from "@/components/entity/InteractionList";

export default function EntityPageClient() {
  const [tab, setTab] = useState<"form" | "riwayat">("form");
  const [listRefreshKey, setListRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900">Entity</h1>
        <p className="text-sm text-gray-500">
          Isi data stakeholder &amp; kunjungan Business Development.
        </p>
      </div>

      <div className="mb-5 inline-flex rounded-md border border-gray-200 bg-white p-1 text-sm">
        <button
          type="button"
          onClick={() => setTab("form")}
          className={`rounded px-3 py-1.5 font-medium transition-colors ${
            tab === "form" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Isi Kunjungan
        </button>
        <button
          type="button"
          onClick={() => setTab("riwayat")}
          className={`rounded px-3 py-1.5 font-medium transition-colors ${
            tab === "riwayat" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Riwayat Interaksi
        </button>
      </div>

      {tab === "form" ? (
        <EntityWizard onSaved={() => setListRefreshKey((k) => k + 1)} />
      ) : (
        <InteractionList refreshKey={listRefreshKey} />
      )}
    </div>
  );
}
