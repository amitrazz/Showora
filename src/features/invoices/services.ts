import { InvoiceRecord, InvoiceMetrics } from './types';
import { CreateInvoiceWizardForm } from './schemas';
import { api } from '@/lib/api';

export const invoiceService = {
  getInvoices: async (): Promise<InvoiceRecord[]> => {
    const response = await api.get<{ data: InvoiceRecord[] }>('/invoices');
    return response.data.data;
  },

  getInvoice: async (id: string): Promise<InvoiceRecord | undefined> => {
    const response = await api.get<InvoiceRecord>(`/invoices/${id}`);
    return response.data;
  },

  getMetrics: async (): Promise<InvoiceMetrics> => {
    const response = await api.get<InvoiceMetrics>('/invoices/metrics');
    return response.data;
  },

  createInvoice: async (data: CreateInvoiceWizardForm): Promise<InvoiceRecord> => {
    const payload = {
      saleId: data.sale.saleId,
      invoiceDate: data.metadata.invoiceDate,
      dueDate: data.metadata.dueDate,
      salesExecutive: data.metadata.salesExecutive,
      branch: data.metadata.branch,
      basePrice: data.pricing.basePrice,
      accessoriesPrice: data.pricing.accessoriesPrice,
      registrationTax: data.pricing.registrationTax,
      insurance: data.pricing.insurance,
      otherCharges: data.pricing.otherCharges,
      discount: data.pricing.discount,
      gstRate: data.pricing.gstRate,
      paymentMethod: data.payment.method,
      amountPaid: data.payment.amountPaid,
      referenceId: data.payment.referenceId || 'N/A'
    };

    const response = await api.post<InvoiceRecord>('/invoices', payload);
    return response.data;
  },

  updateInvoice: async (id: string, data: CreateInvoiceWizardForm): Promise<InvoiceRecord> => {
    const payload = {
      saleId: data.sale.saleId,
      invoiceDate: data.metadata.invoiceDate,
      dueDate: data.metadata.dueDate,
      salesExecutive: data.metadata.salesExecutive,
      branch: data.metadata.branch,
      basePrice: data.pricing.basePrice,
      accessoriesPrice: data.pricing.accessoriesPrice,
      registrationTax: data.pricing.registrationTax,
      insurance: data.pricing.insurance,
      otherCharges: data.pricing.otherCharges,
      discount: data.pricing.discount,
      gstRate: data.pricing.gstRate,
      paymentMethod: data.payment.method,
      amountPaid: data.payment.amountPaid,
      referenceId: data.payment.referenceId || 'N/A'
    };

    const response = await api.patch<InvoiceRecord>(`/invoices/${id}`, payload);
    return response.data;
  },

  recordPayment: async (id: string, data: { amount: number; method: string; referenceId: string }): Promise<any> => {
    const response = await api.post(`/invoices/${id}/payments`, data);
    return response.data;
  }
};
