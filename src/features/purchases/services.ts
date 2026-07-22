import { PurchaseOrder, PurchaseMetrics } from './types';
import { CreatePurchaseWizardForm } from './schemas';
import { api } from '@/lib/api';

export const purchaseService = {
  getPurchases: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get<{ data: PurchaseOrder[] }>('/purchases');
    return response.data.data;
  },

  getPurchase: async (id: string): Promise<PurchaseOrder | undefined> => {
    const response = await api.get<PurchaseOrder>(`/purchases/${id}`);
    return response.data;
  },

  getMetrics: async (): Promise<PurchaseMetrics> => {
    const response = await api.get<PurchaseMetrics>('/purchases/metrics');
    return response.data;
  },

  createPurchase: async (data: CreatePurchaseWizardForm): Promise<PurchaseOrder> => {
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantityOrdered * item.unitCost), 0);
    const discount = data.pricing.discount || 0;
    const gstAmount = data.pricing.gstAmount || 0;
    const transportation = data.pricing.transportation || 0;
    const insurance = data.pricing.insurance || 0;
    const otherCharges = data.pricing.otherCharges || 0;
    const grandTotal = subtotal - discount + gstAmount + transportation + insurance + otherCharges;

    const payload = {
      supplierId: data.supplier.supplierId,
      supplierName: 'Selected Supplier',
      paymentTerms: data.payment.terms,
      items: data.items,
      subtotal,
      discount,
      gstAmount,
      transportation,
      insurance,
      otherCharges,
      grandTotal,
      advancePayment: data.payment.advancePayment,
      referenceId: data.payment.referenceId || 'N/A',
      expectedDeliveryDate: data.delivery.expectedDeliveryDate,
      warehouse: data.delivery.warehouse,
      notes: data.delivery.notes
    };

    const response = await api.post<PurchaseOrder>('/purchases', payload);
    return response.data;
  },

  updatePurchase: async (id: string, data: CreatePurchaseWizardForm): Promise<PurchaseOrder> => {
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantityOrdered * item.unitCost), 0);
    const discount = data.pricing.discount || 0;
    const gstAmount = data.pricing.gstAmount || 0;
    const transportation = data.pricing.transportation || 0;
    const insurance = data.pricing.insurance || 0;
    const otherCharges = data.pricing.otherCharges || 0;
    const grandTotal = subtotal - discount + gstAmount + transportation + insurance + otherCharges;

    const payload = {
      supplierId: data.supplier.supplierId,
      supplierName: 'Selected Supplier',
      paymentTerms: data.payment.terms,
      items: data.items,
      subtotal,
      discount,
      gstAmount,
      transportation,
      insurance,
      otherCharges,
      grandTotal,
      advancePayment: data.payment.advancePayment,
      referenceId: data.payment.referenceId || 'N/A',
      expectedDeliveryDate: data.delivery.expectedDeliveryDate,
      warehouse: data.delivery.warehouse,
      notes: data.delivery.notes
    };

    const response = await api.patch<PurchaseOrder>(`/purchases/${id}`, payload);
    return response.data;
  },

  recordPayment: async (id: string, data: { amount: number; method: string; referenceId: string }): Promise<any> => {
    const response = await api.post(`/purchases/${id}/payments`, data);
    return response.data;
  }
};
