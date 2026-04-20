const DEFAULT_USD_TO_NPR = 133;

function getUsdToNprRate(): number {
  const raw =
    process.env.NEXT_PUBLIC_USD_TO_NPR ??
    process.env.USD_TO_NPR ??
    String(DEFAULT_USD_TO_NPR);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_USD_TO_NPR;
}

export function usdToNpr(usd: number): number {
  const rate = getUsdToNprRate();
  return Math.round(usd * rate);
}

export function formatNprFromUsd(usd: number): string {
  const npr = usdToNpr(usd);
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(npr);
}

