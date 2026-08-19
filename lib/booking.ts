export function openBooking() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-booking"));
}
