export function calculateGST(baseAmount: number, gstRate: number): number {
  return baseAmount * (gstRate / 100);
}

export function calculateTotalWithGST(baseAmount: number, gstRate: number): number {
  return baseAmount + calculateGST(baseAmount, gstRate);
}

export function calculateProfit(sellingPrice: number, costPrice: number): number {
  return sellingPrice - costPrice;
}

export function calculateProfitMargin(sellingPrice: number, costPrice: number): number {
  if (sellingPrice === 0) return 0;
  const profit = calculateProfit(sellingPrice, costPrice);
  return (profit / sellingPrice) * 100;
}
