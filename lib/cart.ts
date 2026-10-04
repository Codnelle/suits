export type CartLine = {
  key: string;
  fabricId: string;
  configuration: Record<string, string>;
  measurements: Record<string, string>;
};

export const cartKey = (fabricId: string, configuration: Record<string, string>) =>
  `${fabricId}:${Object.entries(configuration)
    .map(([k, v]) => `${k}-${v}`)
    .join("_")}`;

const read = (): CartLine[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("shahee.cart");
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
};

const announce = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart-changed"));
};

const write = (lines: CartLine[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("shahee.cart", JSON.stringify(lines));
  } catch {
    /* storage unavailable — the cart simply won't persist */
  }
  announce();
};

export function cartLines(): CartLine[] {
  return read();
}

export function addToCart(line: Omit<CartLine, "key">): CartLine[] {
  const key = cartKey(line.fabricId, line.configuration);
  const lines = read();
  const next = [...lines.filter((l) => l.key !== key), { ...line, key }];
  write(next);
  return next;
}

export function removeFromCart(key: string): CartLine[] {
  const next = read().filter((l) => l.key !== key);
  write(next);
  return next;
}

export function clearCart(): CartLine[] {
  write([]);
  return [];
}