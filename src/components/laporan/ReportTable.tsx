import { periodeFromValue } from "@/lib/periode";
import type { Interaction } from "@/lib/types";

export function ReportTable({ rows }: { rows: Interaction[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Tabel Kunjungan</h2>
      <p className="mb-3 text-xs text-gray-400">
        {rows.length} interaksi tercatat pada periode terpilih
      </p>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Belum ada kunjungan tercatat.</p>
      ) : (
        <div className="max-h-96 overflow-auto rounded-md border border-gray-100">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="sticky top-0 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">No</th>
                <th className="px-3 py-2 font-medium">Periode</th>
                <th className="px-3 py-2 font-medium">Nama Stakeholder</th>
                <th className="px-3 py-2 font-medium">Tujuan</th>
                <th className="px-3 py-2 font-medium">Tipe</th>
                <th className="px-3 py-2 font-medium">Hasil Pembahasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-500">
                    {row.periode ? periodeFromValue(row.periode).monthLabel : "-"}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">{row.stakeholder_name || "-"}</td>
                  <td className="px-3 py-2 text-gray-700">{row.tujuan || "-"}</td>
                  <td className="px-3 py-2 text-gray-500">{row.stakeholder_type || "-"}</td>
                  <td className="px-3 py-2 text-gray-500">{row.hasil_pembahasan || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
