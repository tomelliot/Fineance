export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent}%`;
}

export function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split("-");
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

