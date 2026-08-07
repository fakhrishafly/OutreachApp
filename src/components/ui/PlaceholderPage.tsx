import { Construction } from "lucide-react";

export function PlaceholderPage({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <Construction size={32} className="text-gray-300" />
        <p className="text-sm font-medium text-gray-700">Segera hadir di {phase}</p>
        <p className="max-w-xs text-xs text-gray-400">
          Fitur ini akan dibangun setelah Fase 1 (Entity/Quick Capture) stabil dan dipakai harian.
        </p>
      </div>
    </div>
  );
}
