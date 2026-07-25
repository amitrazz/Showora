import { Customer, CustomerListOptions, CustomerListResponse, CustomerMetrics } from "./types";
import { CreateCustomerWizardForm } from "./schemas";
import { api } from "@/lib/api";

export const customerService = {
  getCustomers: async ({ search, limit = 10, cursor }: CustomerListOptions = {}): Promise<CustomerListResponse> => {
    const response = await api.get<CustomerListResponse>('/customers', {
      params: {
        ...(search ? { search } : {}),
        limit,
        ...(cursor ? { cursor } : {}),
      },
    });
    return response.data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  getMetrics: async (): Promise<CustomerMetrics> => {
    const response = await api.get<CustomerMetrics>('/customers/metrics');
    return response.data;
  },


  getSummary: async (options?: any): Promise<{ totalCustomers: number, totalOutstandingAmount: number, totalLifetimeValue: number }> => {
    const response = await api.get('/customers/summary', { params: options });
    return response.data;
  },

  getCustomerSummary: async (id: string): Promise<{ customerId: string, totalSalesAmount: number, totalOutstandingBalance: number, totalPaidAmount: number }> => {
    const response = await api.get(`/customers/${id}/summary`);
    return response.data;
  },

  createCustomer: async (data: CreateCustomerWizardForm): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  updateCustomer: async (id: string, data: CreateCustomerWizardForm): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  exportCustomers: async (): Promise<Blob> => {
    const response = await api.get('/customers/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  importCustomers: async (file: File): Promise<{
    success: boolean;
    importedCount: number;
    failedCount: number;
    imported: string[];
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{
      success: boolean;
      importedCount: number;
      failedCount: number;
      imported: string[];
      errors: string[];
    }>('/customers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
