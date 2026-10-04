export type BookingPrefill = {
  note?: string;
  label?: string;
};

export function openBooking(prefill?: BookingPrefill) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<BookingPrefill | undefined>("open-booking", { detail: prefill })
  );
}