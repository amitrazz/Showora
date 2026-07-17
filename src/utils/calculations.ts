export const GST_RATE = 0.28; // 28% GST on bikes

export function calculateGST(baseAmount: number): number {
  return baseAmount * GST_RATE;
}

export function calculateTotalWithGST(baseAmount: number): number {
  return baseAmount + calculateGST(baseAmount);
}

export function calculateProfit(sellingPrice: number, costPrice: number): number {
  return sellingPrice - costPrice;
}

export function calculateProfitMargin(sellingPrice: number, costPrice: number): number {
  if (sellingPrice === 0) return 0;
  const profit = calculateProfit(sellingPrice, costPrice);
  return (profit / sellingPrice) * 100;
}
