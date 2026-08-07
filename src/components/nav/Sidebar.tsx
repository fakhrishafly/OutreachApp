"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-white">
          <Building2 size={18} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-900">BPS Outreach</p>
          <p className="text-xs text-gray-500">Tracker</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <Link
          href="/entity"
          className="flex items-center justify-center gap-2 rounded-md bg-gray-900 text-white text-sm font-medium px-3 py-2.5 hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Isi Kunjungan
        </Link>
      </div>
    </aside>
  );
}
