import { Customer, CustomerMetrics } from "./types";
import { CreateCustomerWizardForm } from "./schemas";
import { api } from "@/lib/api";

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get<{ data: Customer[] }>('/customers');
    return response.data.data;
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
  
  updateCustomer: async (id: string, data: any): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  }
};
