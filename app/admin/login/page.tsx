import type { Metadata } from "next";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Sign in — Shahee CRM",
  robots: { index: false, follow: false },
};

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;
  const unset = !process.env.ADMIN_PASSWORD;
  return (
    <main className="min-h-[100svh] grid place-items-center bg-[var(--color-ink)] px-6">
      <form action={login} className="w-full max-w-sm">
        <img src="/media/shahee-logo.png" alt="Shahee" className="h-[18px] w-auto mb-10" />
        <h1 className="font-[family-name:var(--font-display)] text-[34px] leading-none text-[var(--color-bone)]">
          <em>the</em> CRM
        </h1>
        <p className="text-[13px] text-[var(--color-ash)] mt-3 mb-8">Bookings, orders and customers. Staff only.</p>

        {unset && (
          <p className="mb-5 text-[13px] text-[#9A4B3C]">
            No admin password is set. Add <code>ADMIN_PASSWORD</code> to the site&apos;s environment first.
          </p>
        )}
        {error === "1" && <p role="alert" className="mb-5 text-[13px] text-[#9A4B3C]">That password isn&apos;t right.</p>}
        {error === "setup" && <p role="alert" className="mb-5 text-[13px] text-[#9A4B3C]">Sign-in isn&apos;t set up on this server.</p>}

        <input type="hidden" name="next" value={next ?? "/admin"} />
        <label htmlFor="password" className="block text-[11px] tracking-[0.14em] uppercase text-[var(--color-ash)] mb-2">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-[4px] border border-[var(--color-line)] bg-white px-4 py-3 text-[15px] text-[var(--color-bone)] outline-none focus:border-[var(--color-bone)]"
        />
        <button className="pill w-full justify-center mt-5">Sign <em>in</em></button>
      </form>
    </main>
  );
}
