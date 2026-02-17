"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-black text-white shadow-md"
          : "text-slate-700 bg-slate-100 hover:bg-slate-200 hover:shadow-sm"
      }`}
    >
      {children}
    </Link>
  );
}
