import { 
  KPIMetrics, 
  TimeSeriesData, 
  DistributionData, 
  SalesByExecutive, 
  InventoryHealthData,
  InsightCard,
  FilterState
} from './types';
import { 
  mockKPIMetrics, 
  mockRevenueTrend, 
  mockSalesByModel, 
  mockInventoryDistribution,
  mockExpenseCategories,
  mockSalesExecutives,
  mockInventoryHealth,
  mockInsights,
  mockCustomerAcquisition,
  mockSupplierPerformance,
  mockTaxRegister
} from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
  getKPIMetrics: async (_filters?: FilterState): Promise<KPIMetrics> => {
    await delay(600);
    return mockKPIMetrics;
  },

  getRevenueTrend: async (_filters?: FilterState): Promise<TimeSeriesData[]> => {
    await delay(700);
    return mockRevenueTrend;
  },

  getSalesByModel: async (_filters?: FilterState): Promise<DistributionData[]> => {
    await delay(500);
    return mockSalesByModel;
  },

  getInventoryDistribution: async (_filters?: FilterState): Promise<DistributionData[]> => {
    await delay(500);
    return mockInventoryDistribution;
  },

  getExpenseCategories: async (_filters?: FilterState): Promise<DistributionData[]> => {
    await delay(500);
    return mockExpenseCategories;
  },

  getSalesExecutives: async (_filters?: FilterState): Promise<SalesByExecutive[]> => {
    await delay(800);
    return mockSalesExecutives;
  },

  getInventoryHealth: async (_filters?: FilterState): Promise<InventoryHealthData[]> => {
    await delay(800);
    return mockInventoryHealth;
  },

  getInsights: async (_filters?: FilterState): Promise<InsightCard[]> => {
    await delay(400);
    return mockInsights;
  },

  getCustomerAcquisition: async (_filters?: FilterState): Promise<TimeSeriesData[]> => {
    await delay(500);
    return mockCustomerAcquisition;
  },

  getSupplierPerformance: async (_filters?: FilterState): Promise<DistributionData[]> => {
    await delay(600);
    return mockSupplierPerformance;
  },

  getTaxRegister: async (_filters?: FilterState): Promise<any[]> => {
    await delay(400);
    return mockTaxRegister;
  }
};
