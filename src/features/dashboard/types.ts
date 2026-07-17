export interface DashboardMetrics {
  totalRevenue: number;
  revenueTrend: number;
  bikesSold: number;
  bikesSoldTrend: number;
  activeCustomers: number;
  activeCustomersTrend: number;
  pendingInvoices: number;
  recentSales: RecentSale[];
  revenueByMonth: RevenueData[];
}

export interface RecentSale {
  id: string;
  customerName: string;
  customerEmail: string;
  bikeModel: string;
  amount: number;
  date: string;
}

export interface RevenueData {
  name: string;
  total: number;
}
