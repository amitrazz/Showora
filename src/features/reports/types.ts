export interface KPIMetrics {
  revenue: number;
  revenueGrowth: number;
  profit: number;
  profitGrowth: number;
  unitsSold: number;
  unitsSoldGrowth: number;
  inventoryValue: number;
  outstandingPayments: number;
  expenses: number;
  expenseGrowth: number;
  netProfit: number;
  netProfitMargin: number;
  averageDealValue: number;
  customerGrowth: number;
  repeatCustomers: number;
  gstCollected: number;
  gstPaid: number;
}

export interface TimeSeriesData {
  date: string; // ISO date or "Jan 2026"
  revenue?: number;
  profit?: number;
  expenses?: number;
  sales?: number;
  target?: number;
}

export interface DistributionData {
  name: string;
  value: number;
  color?: string;
}

export interface SalesByExecutive {
  name: string;
  revenue: number;
  units: number;
  target: number;
}

export interface InventoryHealthData {
  model: string;
  available: number;
  reserved: number;
  allocated: number;
}

export interface InsightCard {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  metric?: string;
}

export interface FilterState {
  dateRange: 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'last_year' | 'custom';
  branch: string;
  brand: string;
  salesExecutive: string;
}
