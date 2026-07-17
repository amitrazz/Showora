import { 
  KPIMetrics, 
  TimeSeriesData, 
  DistributionData, 
  SalesByExecutive, 
  InventoryHealthData,
  InsightCard
} from './types';
import { subMonths, format } from 'date-fns';

const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const mockKPIMetrics: KPIMetrics = {
  revenue: 45800000,
  revenueGrowth: 18.4,
  profit: 8200000,
  profitGrowth: 22.1,
  unitsSold: 342,
  unitsSoldGrowth: 12.5,
  inventoryValue: 23500000,
  outstandingPayments: 1250000,
  expenses: 3100000,
  expenseGrowth: 4.2,
  netProfit: 5100000,
  netProfitMargin: 11.1,
  averageDealValue: 133918,
  customerGrowth: 28.4,
  repeatCustomers: 45,
  gstCollected: 8244000,
  gstPaid: 5310000
};

export const generateTimeSeriesData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const d = subMonths(now, i);
    const baseRevenue = getRandomNum(3000000, 5000000);
    const trend = 1 + (11 - i) * 0.05; // Upward trend
    
    data.push({
      date: format(d, 'MMM yyyy'),
      revenue: Math.floor(baseRevenue * trend),
      profit: Math.floor(baseRevenue * trend * 0.18),
      expenses: Math.floor(baseRevenue * trend * 0.06),
      sales: Math.floor((baseRevenue * trend) / 130000),
      target: Math.floor(baseRevenue * trend * 1.1)
    });
  }
  return data;
};

export const mockRevenueTrend = generateTimeSeriesData();

export const mockSalesByModel: DistributionData[] = [
  { name: 'R15 V4', value: 145, color: '#3b82f6' },
  { name: 'MT-15', value: 120, color: '#10b981' },
  { name: 'FZ-S FI', value: 95, color: '#f59e0b' },
  { name: 'Aerox 155', value: 54, color: '#8b5cf6' },
  { name: 'Fascino', value: 42, color: '#ec4899' },
];

export const mockInventoryDistribution: DistributionData[] = [
  { name: 'Available', value: 65, color: '#10b981' },
  { name: 'Reserved', value: 20, color: '#f59e0b' },
  { name: 'Allocated', value: 12, color: '#3b82f6' },
  { name: 'Dead Stock', value: 3, color: '#ef4444' },
];

export const mockExpenseCategories: DistributionData[] = [
  { name: 'Staff Salary', value: 45, color: '#3b82f6' },
  { name: 'Rent', value: 30, color: '#8b5cf6' },
  { name: 'Marketing', value: 15, color: '#ec4899' },
  { name: 'Utilities', value: 10, color: '#f59e0b' },
];

export const mockSalesExecutives: SalesByExecutive[] = [
  { name: 'Rajesh Kumar', revenue: 12500000, units: 95, target: 11000000 },
  { name: 'Priya Singh', revenue: 9800000, units: 76, target: 10000000 },
  { name: 'Amit Patel', revenue: 8400000, units: 62, target: 8000000 },
  { name: 'Neha Sharma', revenue: 7200000, units: 54, target: 7500000 },
  { name: 'Vikram Desai', revenue: 5600000, units: 42, target: 6000000 },
];

export const mockInventoryHealth: InventoryHealthData[] = [
  { model: 'R15 V4', available: 12, reserved: 4, allocated: 2 },
  { model: 'MT-15', available: 8, reserved: 6, allocated: 3 },
  { model: 'FZ-S FI', available: 15, reserved: 2, allocated: 1 },
  { model: 'Aerox 155', available: 4, reserved: 3, allocated: 4 },
  { model: 'Fascino', available: 18, reserved: 1, allocated: 0 },
];

export const mockCustomerAcquisition: TimeSeriesData[] = generateTimeSeriesData().map(d => ({
  date: d.date,
  revenue: Math.floor((d.revenue || 0) / 100000) // Reusing revenue field to represent customer count for simplicity in chart
}));

export const mockSupplierPerformance: DistributionData[] = [
  { name: 'Yamaha Motors India', value: 85, color: '#3b82f6' },
  { name: 'MRF Tyres', value: 12, color: '#10b981' },
  { name: 'Motul Oils', value: 8, color: '#f59e0b' },
  { name: 'Vega Helmets', value: 5, color: '#8b5cf6' },
];

export const mockTaxRegister = [
  { month: 'Oct 2026', collected: 1250000, paid: 850000, liability: 400000, status: 'Filed' },
  { month: 'Sep 2026', collected: 1180000, paid: 810000, liability: 370000, status: 'Filed' },
  { month: 'Aug 2026', collected: 1320000, paid: 920000, liability: 400000, status: 'Filed' },
  { month: 'Jul 2026', collected: 1050000, paid: 750000, liability: 300000, status: 'Filed' },
];

export const mockInsights: InsightCard[] = [
  {
    id: '1',
    type: 'success',
    title: 'Revenue Surpassed Target',
    description: 'Revenue increased by 18.4% this quarter, exceeding the quarterly target by ₹2.5M.',
    metric: '₹4.58 Cr'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Stock Alert',
    description: 'Aerox 155 is moving fast. Only 4 units left available with 7 pending deliveries.',
    metric: '4 Units'
  },
  {
    id: '3',
    type: 'info',
    title: 'Top Performer',
    description: 'Rajesh Kumar generated the highest revenue this month.',
    metric: '95 Units'
  },
  {
    id: '4',
    type: 'danger',
    title: 'Outstanding Payments',
    description: 'There are 14 customers with overdue payments totaling ₹1.25M.',
    metric: '₹12.5L'
  }
];
