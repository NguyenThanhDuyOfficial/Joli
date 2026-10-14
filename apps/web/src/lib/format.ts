export function formatPrice(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${trimZero(m)}tr`;
  }

  if (value >= 1_000) {
    const k = value / 1_000;
    return `${trimZero(k)}k`;
  }

  return value.toString();
}

function trimZero(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1);
}
