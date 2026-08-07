import {
  ClipboardList,
  Columns3,
  FileText,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/entity", label: "Entity", icon: ClipboardList },
  { href: "/pipeline", label: "Pipeline", icon: Columns3 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/laporan", label: "Laporan", icon: FileText },
];
