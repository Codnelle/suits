// Master G's diary. One tailor, three zones, six visit windows a day.
// The rules live here so the booking modal and /api/slots agree on what a
// bookable window is; the API layers held windows on top (SHAHEE_HELD).

export const TIMES = ["10:00", "11:30", "13:00", "15:00", "17:00", "19:00"] as const;
export type Time = (typeof TIMES)[number];

export type Slot = { time: Time; open: boolean };
export type Day = { date: string; weekday: string; label: string; slots: Slot[] };

// a window can't be booked inside this many hours of it starting
export const LEAD_HOURS = 4;
// Master G rests on Sundays
const CLOSED_WEEKDAYS = new Set([0]);

const IST_OFFSET_MIN = 330;

// "now" expressed as a wall-clock time in Bengaluru, whatever the server's zone
function istNow(now: Date) {
  return new Date(now.getTime() + (IST_OFFSET_MIN + now.getTimezoneOffset()) * 60_000);
}

const pad = (n: number) => String(n).padStart(2, "0");
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * The next `days` days of Master G's diary for one zone.
 * `held` is a set of "YYYY-MM-DD" (whole day) or "YYYY-MM-DD HH:MM" keys,
 * optionally prefixed "zone:" to hold a window in one zone only.
 */
export function buildDiary(zone: string, days: number, held: Set<string>, now = new Date()): Day[] {
  const today = istNow(now);
  const out: Day[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    if (CLOSED_WEEKDAYS.has(d.getDay())) continue;
    const date = isoDate(d);
    const dayHeld = held.has(date) || held.has(`${zone}:${date}`);
    const slots = TIMES.map((time) => {
      const [h, m] = time.split(":").map(Number);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
      const tooSoon = start.getTime() - today.getTime() < LEAD_HOURS * 3_600_000;
      const key = `${date} ${time}`;
      const open = !dayHeld && !tooSoon && !held.has(key) && !held.has(`${zone}:${key}`);
      return { time, open };
    });
    out.push({
      date,
      weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      slots,
    });
  }
  return out;
}

export function parseHeld(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}
