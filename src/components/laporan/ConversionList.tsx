import type { Interaction } from "@/lib/types";

export function ConversionList({ items }: { items: Interaction[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Conversion Periode Ini</h2>
      <p className="mb-3 text-xs text-gray-400">10 stakeholder yang closing pada periode terpilih</p>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Belum ada conversion.</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {items.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-2 rounded-md border border-gray-100 px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{c.stakeholder_name}</p>
                <p className="truncate text-gray-500">{c.tujuan}</p>
              </div>
              <span className="shrink-0 text-gray-400">{c.pic_name || "-"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
