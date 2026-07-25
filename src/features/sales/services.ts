import { SalesRecord, SalesMetrics, SalesListOptions, SalesListResponse } from './types';
import { CreateSaleWizardForm } from './schemas';
import { api } from '@/lib/api';
import { mockSales } from './data';

export const salesService = {
  getSales: async (options: SalesListOptions = {}): Promise<SalesListResponse> => {
    try {
      const response = await api.get<any>('/sales', {
        params: {
          ...(options.search ? { search: options.search } : {}),
          limit: options.limit ?? 10,
          ...(options.cursor ? { cursor: options.cursor } : {}),
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        return response.data;
      }
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          totalCount: response.data.length,
          limit: options.limit ?? 10,
          hasMore: false,
          nextCursor: null,
        };
      }
      return response.data;
    } catch {
      let filtered = mockSales;
      if (options.search && options.search.trim()) {
        const q = options.search.trim().toLowerCase();
        filtered = mockSales.filter(
          (s) =>
            (s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(q)) ||
            (s.customerName && s.customerName.toLowerCase().includes(q)) ||
            (s.id && s.id.toLowerCase().includes(q)) ||
            (s.customerPhone && s.customerPhone.includes(q)) ||
            (s.vehicleMake && s.vehicleMake.toLowerCase().includes(q)) ||
            (s.vehicleModel && s.vehicleModel.toLowerCase().includes(q)) ||
            (s.vin && s.vin.toLowerCase().includes(q))
        );
      }
      const start = options.cursor ? parseInt(options.cursor, 10) : 0;
      const limit = options.limit ?? 10;
      const sliced = filtered.slice(start, start + limit);
      const hasMore = start + limit < filtered.length;
      return {
        data: sliced,
        totalCount: filtered.length,
        limit,
        hasMore,
        nextCursor: hasMore ? String(start + limit) : null,
      };
    }
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
      reserveVehicle: data.vehicle.reserveVehicle,
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
      referenceId: data.payment.referenceId || 'N/A',
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

  updateSale: async (id: string, data: CreateSaleWizardForm): Promise<SalesRecord> => {
    const { basePrice, accessoriesPrice, registrationTax, roadTax, insurance, gstAmount, discount, exchangeBonus } = data.pricing;
    const grandTotal = basePrice + accessoriesPrice + registrationTax + roadTax + insurance + gstAmount - discount - exchangeBonus;

    const payload = {
      customerId: data.customer.customerId,
      inventoryId: data.vehicle.inventoryId,
      reserveVehicle: data.vehicle.reserveVehicle,
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
      referenceId: data.payment.referenceId || 'N/A',
      financeRequired: data.finance.required,
      financePartner: data.finance.partner,
      financeLoanAmount: data.finance.loanAmount,
      expectedDeliveryDate: data.delivery.expectedDate,
      deliveryExecutive: data.delivery.executive,
      deliveryNotes: data.delivery.notes
    };

    const response = await api.patch<SalesRecord>(`/sales/${id}`, payload);
    return response.data;
  },

  recordPayment: async (id: string, data: { amount: number; method: string; referenceId: string }): Promise<any> => {
    const response = await api.post(`/sales/${id}/payments`, data);
    return response.data;
  },

  exportSales: async (): Promise<Blob> => {
    const response = await api.get('/sales/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  importSales: async (file: File): Promise<{
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
    }>('/sales/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
