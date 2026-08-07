import { Building2 } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center gap-2 h-14 px-4 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900 text-white">
        <Building2 size={16} />
      </div>
      <p className="text-sm font-semibold text-gray-900">BPS Outreach Tracker</p>
    </header>
  );
}
