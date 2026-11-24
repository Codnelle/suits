import type { Metadata } from "next";
import Link from "next/link";
import { crm } from "@/lib/crm";
import { logout } from "../actions";
import AdminNav from "./AdminNav";

export const metadata: Metadata = {
  title: "Shahee CRM",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const ready = crm() !== null;
  return (
    <div className="min-h-[100svh] bg-[var(--color-ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-ink)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-[clamp(16px,3vw,40px)] h-16 flex items-center justify-between gap-6">
          <Link href="/admin" className="flex items-baseline gap-3">
            <img src="/media/shahee-logo.png" alt="Shahee" className="h-[16px] w-auto self-center" />
            <span className="font-[family-name:var(--font-display)] italic text-[15px] text-[var(--color-ash)]">CRM</span>
          </Link>
          <AdminNav />
          <form action={logout}>
            <button className="text-[12px] text-[var(--color-ash)] hover:text-[var(--color-bone)]">Log out</button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-[clamp(16px,3vw,40px)] py-10">
        {ready ? (
          children
        ) : (
          <div className="max-w-xl rounded-[6px] border border-[var(--color-line)] bg-[#FBF9F6] p-6">
            <h1 className="font-[family-name:var(--font-display)] text-[24px] text-[var(--color-bone)]">The CRM isn&apos;t connected yet</h1>
            <p className="text-[14px] text-[var(--color-ash)] mt-3 leading-relaxed">
              Add <code>SUPABASE_URL</code> and <code>SUPABASE_SECRET_KEY</code> to the site&apos;s environment (in Vercel, and in
              <code> .env.local</code> for local work), then reload. Bookings and orders start saving here as soon as they are set.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
