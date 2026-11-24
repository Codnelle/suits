"use client";

import { useRef } from "react";

// A status dropdown that saves as soon as it changes.
export default function StatusSelect({
  action,
  id,
  value,
  options,
  back,
}: {
  action: (form: FormData) => void | Promise<void>;
  id: string;
  value: string;
  options: Record<string, string>;
  back: string;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="back" value={back} />
      <label className="sr-only" htmlFor={`status-${id}`}>Status</label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={value}
        onChange={() => form.current?.requestSubmit()}
        className="text-[12px] rounded-[4px] border border-[var(--color-line)] bg-white px-2 py-1.5 text-[var(--color-bone)] cursor-pointer"
      >
        {Object.entries(options).map(([k, label]) => (
          <option key={k} value={k}>{label}</option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="ml-2 text-[12px] underline">Save</button>
      </noscript>
    </form>
  );
}
