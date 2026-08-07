const STEPS = ["Stakeholder", "Detail", "Hasil", "Review"];

export function WizardProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const isDone = idx < step;
        const isActive = idx === step;
        const isLast = idx === STEPS.length;

        return (
          <div key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? "bg-gray-900 text-white"
                    : isActive
                      ? "border-2 border-gray-900 text-gray-900"
                      : "border border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? "✓" : idx}
              </div>
              <span
                className={`text-[11px] whitespace-nowrap ${
                  isActive || isDone ? "font-medium text-gray-900" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-2 mb-4 h-0.5 flex-1 ${isDone ? "bg-gray-900" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
