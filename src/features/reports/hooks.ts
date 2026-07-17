import { useQuery } from '@tanstack/react-query';
import { reportService } from './services';
import { FilterState } from './types';

export const useReportMetrics = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'metrics', filters],
    queryFn: () => reportService.getKPIMetrics(filters),
  });
};

export const useRevenueTrend = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'revenue-trend', filters],
    queryFn: () => reportService.getRevenueTrend(filters),
  });
};

export const useSalesByModel = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'sales-by-model', filters],
    queryFn: () => reportService.getSalesByModel(filters),
  });
};

export const useInventoryDistribution = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'inventory-dist', filters],
    queryFn: () => reportService.getInventoryDistribution(filters),
  });
};

export const useExpenseCategories = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'expense-dist', filters],
    queryFn: () => reportService.getExpenseCategories(filters),
  });
};

export const useSalesExecutives = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'sales-execs', filters],
    queryFn: () => reportService.getSalesExecutives(filters),
  });
};

export const useInventoryHealth = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'inventory-health', filters],
    queryFn: () => reportService.getInventoryHealth(filters),
  });
};

export const useInsights = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'insights', filters],
    queryFn: () => reportService.getInsights(filters),
  });
};

export const useCustomerAcquisition = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'customer-acq', filters],
    queryFn: () => reportService.getCustomerAcquisition(filters),
  });
};

export const useSupplierPerformance = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'supplier-perf', filters],
    queryFn: () => reportService.getSupplierPerformance(filters),
  });
};

export const useTaxRegister = (filters?: FilterState) => {
  return useQuery({
    queryKey: ['reports', 'tax-register', filters],
    queryFn: () => reportService.getTaxRegister(filters),
  });
};
