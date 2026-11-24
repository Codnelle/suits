export type BookingPrefill = {
  note?: string;
  label?: string;
  // a window picked from Master G's diary on /tailor
  zone?: string;
  date?: string;
  time?: string;
};

export function openBooking(prefill?: BookingPrefill) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<BookingPrefill | undefined>("open-booking", { detail: prefill })
  );
}