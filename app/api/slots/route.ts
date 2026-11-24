import { NextResponse } from "next/server";
import { copy } from "@/lib/copy";
import { buildDiary, parseHeld } from "@/lib/slots";
import { crm, heldWindows } from "@/lib/crm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/slots?zone=central&days=14
// Master G's open home-visit windows. A window is taken when the CRM has a
// requested or confirmed visit in it (in any zone — there is one Master G),
// or when SHAHEE_HELD lists it (comma separated, e.g.
// "2026-12-03, 2026-12-04 15:00, east:2026-12-05 10:00").
export async function GET(req: Request) {
  const url = new URL(req.url);
  const zoneId = url.searchParams.get("zone") ?? copy.booking.zones[0].id;
  const zone = copy.booking.zones.find((z) => z.id === zoneId);
  if (!zone) {
    return NextResponse.json({ error: `Unknown zone "${zoneId}"` }, { status: 400 });
  }
  const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 14, 1), 31);

  const held = parseHeld(process.env.SHAHEE_HELD);
  const db = crm();
  if (db) {
    try {
      for (const w of await heldWindows(db)) held.add(w);
    } catch (error) {
      // the diary still shows; a clash is caught when the visit is confirmed
      console.error("slots: could not read booked visits", error);
    }
  }

  const diary = buildDiary(zone.id, days, held);
  const open = diary.reduce((n, d) => n + d.slots.filter((s) => s.open).length, 0);

  return NextResponse.json(
    { zone: { id: zone.id, name: zone.name, areas: zone.areas }, open, days: diary },
    { headers: { "Cache-Control": "no-store" } }
  );
}
