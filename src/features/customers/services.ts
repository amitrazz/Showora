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

  createCustomer: async (data: CreateCustomerWizardForm): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  updateCustomer: async (id: string, data: CreateCustomerWizardForm): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  }
};
