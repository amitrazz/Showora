import { 
  KPIMetrics, 
  TimeSeriesData, 
  DistributionData, 
  SalesByExecutive, 
  InventoryHealthData,
  InsightCard,
  FilterState,
  InventoryKPI
} from './types';
import { api } from '@/lib/api';

export const reportService = {
  getKPIMetrics: async (filters?: FilterState): Promise<KPIMetrics> => {
    const response = await api.get<KPIMetrics>('/reports/kpi', { params: filters });
    return response.data;
  },

  getSalesLeaderboard: async (filters?: FilterState): Promise<{ leaderboard: any[] }> => {
    const response = await api.get('/reports/sales/leaderboard', { params: filters });
    return response.data;
  },

  getInventoryKpi: async (filters?: FilterState): Promise<any> => {
    const response = await api.get('/reports/inventory/kpi', { params: filters });
    return response.data;
  },

  getRevenueTrend: async (filters?: FilterState): Promise<TimeSeriesData[]> => {
    const response = await api.get<TimeSeriesData[]>('/reports/revenue-series', { params: filters });
    return response.data;
  },

  getSalesByModel: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/distribution/brand', { params: filters });
    return response.data;
  },

  getInventoryDistribution: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/distribution/category', { params: filters });
    return response.data;
  },

  getExpenseCategories: async (filters?: FilterState): Promise<DistributionData[]> => {
    const response = await api.get<DistributionData[]>('/reports/distribution/branch', { params: filters });
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

  getInventoryKPI: async (filters?: FilterState): Promise<InventoryKPI> => {
    const response = await api.get<InventoryKPI>('/reports/inventory/kpi', { params: filters });
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
  },

  exportReport: async (reportName: string, filters?: FilterState): Promise<Blob> => {
    const response = await api.get(`/reports/${reportName}/export`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
};
