"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Today" },
  { href: "/admin/visits", label: "Home visits" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-1 overflow-x-auto" aria-label="CRM">
      {LINKS.map((l) => {
        const on = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "page" : undefined}
            className="whitespace-nowrap text-[13px] px-3 py-1.5 rounded-full transition-colors"
            style={on ? { background: "var(--color-bone)", color: "#fff" } : { color: "var(--color-bone)" }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
