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
      referenceId: data.payment.referenceId
    };

    const response = await api.post<InvoiceRecord>('/invoices', payload);
    return response.data;
  }
};
