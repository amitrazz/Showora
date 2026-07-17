import { 
  KPIMetrics, 
  TimeSeriesData, 
  DistributionData, 
  SalesByExecutive, 
  InventoryHealthData,
  InsightCard,
  FilterState
} from './types';
import { api } from '@/lib/api';

export const reportService = {
  getKPIMetrics: async (filters?: FilterState): Promise<KPIMetrics> => {
    const response = await api.get<KPIMetrics>('/reports/kpis', { params: filters });
    return response.data;
  },

  getRevenueTrend: async (filters?: FilterState): Promise<TimeSeriesData[]> => {
    const response = await api.get<TimeSeriesData[]>('/reports/revenue-trend', { params: filters });
    return response.data;
  },

  getSalesByModel: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/sales-by-model', { params: filters });
    return response.data;
  },

  getInventoryDistribution: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/inventory-distribution', { params: filters });
    return response.data;
  },

  getExpenseCategories: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/expense-categories', { params: filters });
    return response.data;
  },

  getSalesExecutives: async (filters?: FilterState): Promise<SalesByExecutive[]> => {
    const response = await api.get<SalesByExecutive[]>('/reports/sales-executives', { params: filters });
    return response.data;
  },

  getInventoryHealth: async (filters?: FilterState): Promise<InventoryHealthData[]> => {
    const response = await api.get<InventoryHealthData[]>('/reports/inventory-health', { params: filters });
    return response.data;
  },

  getInsights: async (filters?: FilterState): Promise<InsightCard[]> => {
    const response = await api.get<InsightCard[]>('/reports/insights', { params: filters });
    return response.data;
  },

  getCustomerAcquisition: async (filters?: FilterState): Promise<TimeSeriesData[]> => {
    const response = await api.get<TimeSeriesData[]>('/reports/customer-acquisition', { params: filters });
    return response.data;
  },

  getSupplierPerformance: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/supplier-performance', { params: filters });
    return response.data;
  },

  getTaxRegister: async (filters?: FilterState): Promise<any[]> => {
    const response = await api.get<any[]>('/reports/tax-register', { params: filters });
    return response.data;
  }
};
