import { SalesRecord, SalesMetrics } from './types';
import { CreateSaleWizardForm } from './schemas';
import { api } from '@/lib/api';

export const salesService = {
  getSales: async (): Promise<SalesRecord[]> => {
    const response = await api.get<{ data: SalesRecord[] }>('/sales');
    return response.data.data;
  },

  getSale: async (id: string): Promise<SalesRecord | undefined> => {
    const response = await api.get<SalesRecord>(`/sales/${id}`);
    return response.data;
  },

  getMetrics: async (): Promise<SalesMetrics> => {
    const response = await api.get<SalesMetrics>('/sales/metrics');
    return response.data;
  },

  createSale: async (data: CreateSaleWizardForm): Promise<SalesRecord> => {
    const { basePrice, accessoriesPrice, registrationTax, roadTax, insurance, gstAmount, discount, exchangeBonus } = data.pricing;
    const grandTotal = basePrice + accessoriesPrice + registrationTax + roadTax + insurance + gstAmount - discount - exchangeBonus;

    const payload = {
      customerId: data.customer.customerId,
      inventoryId: data.vehicle.inventoryId,
      salesExecutive: data.delivery.executive || 'Current User',
      branch: 'Main Showroom',
      basePrice,
      accessoriesPrice,
      registrationTax,
      roadTax,
      insurance,
      gstAmount,
      discount,
      exchangeBonus,
      grandTotal,
      initialPaymentAmount: data.payment.initialPaymentAmount,
      paymentMethod: data.payment.method,
      referenceId: data.payment.referenceId,
      financeRequired: data.finance.required,
      financePartner: data.finance.partner,
      financeLoanAmount: data.finance.loanAmount,
      expectedDeliveryDate: data.delivery.expectedDate,
      deliveryExecutive: data.delivery.executive,
      deliveryNotes: data.delivery.notes
    };

    const response = await api.post<SalesRecord>('/sales', payload);
    return response.data;
  },

  recordPayment: async (id: string, data: { amount: number; method: string; referenceId: string }): Promise<any> => {
    const response = await api.post(`/sales/${id}/payments`, data);
    return response.data;
  }
};
