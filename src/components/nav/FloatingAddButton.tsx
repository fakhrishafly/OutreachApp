import Link from "next/link";
import { Plus } from "lucide-react";

export function FloatingAddButton() {
  return (
    <Link
      href="/entity"
      className="md:hidden fixed z-40 right-4 bottom-20 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg active:scale-95 transition-transform"
      aria-label="Isi Kunjungan Baru"
    >
      <Plus size={26} />
    </Link>
  );
}
