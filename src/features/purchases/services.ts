import { PurchaseOrder, PurchaseMetrics } from './types';
import { mockPurchases, mockPurchaseMetrics } from './data';
import { CreatePurchaseWizardForm } from './schemas';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const purchaseService = {
  getPurchases: async (): Promise<PurchaseOrder[]> => {
    await delay(800);
    return mockPurchases;
  },

  getPurchase: async (id: string): Promise<PurchaseOrder | undefined> => {
    await delay(500);
    return mockPurchases.find(p => p.id === id);
  },

  getMetrics: async (): Promise<PurchaseMetrics> => {
    await delay(600);
    return mockPurchaseMetrics;
  },

  createPurchase: async (data: CreatePurchaseWizardForm): Promise<PurchaseOrder> => {
    await delay(1200);
    
    const { subtotal, discount, gstAmount, transportation, insurance, otherCharges } = data.pricing as any; // Allow partial missing fields for mock computation
    const baseSub = data.items.reduce((sum, item) => sum + (item.quantityOrdered * item.unitCost), 0);
    const finalSub = subtotal || baseSub;
    const grandTotal = finalSub - (discount || 0) + (gstAmount || 0) + (transportation || 0) + (insurance || 0) + (otherCharges || 0);
    
    const amountPaid = data.payment.advancePayment || 0;
    const outstandingAmount = grandTotal - amountPaid;

    const newPurchase: PurchaseOrder = {
      id: `po_new_${Math.random().toString(36).substr(2, 9)}`,
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      orderDate: new Date().toISOString(),
      expectedDelivery: data.delivery.expectedDeliveryDate,
      status: 'Ordered',
      
      supplierId: data.supplier.supplierId,
      supplierName: 'Selected Supplier',
      
      items: data.items.map(i => ({
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        make: i.make,
        model: i.model,
        variant: i.variant,
        color: i.color,
        quantityOrdered: i.quantityOrdered,
        quantityReceived: 0,
        unitCost: i.unitCost,
        totalCost: i.quantityOrdered * i.unitCost
      })),
      
      subtotal: finalSub,
      discount: discount || 0,
      gstAmount: gstAmount || 0,
      transportation: transportation || 0,
      insurance: insurance || 0,
      otherCharges: otherCharges || 0,
      grandTotal,
      
      paymentTerms: data.payment.terms,
      paymentStatus: amountPaid >= grandTotal ? 'Paid' : (amountPaid > 0 ? 'Partially Paid' : 'Unpaid'),
      amountPaid,
      outstandingAmount,
      payments: amountPaid > 0 ? [{
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount: amountPaid,
        method: data.payment.method,
        status: 'Completed',
        referenceId: data.payment.referenceId || ''
      }] : [],
      
      warehouse: data.delivery.warehouse,
      deliveryNotes: data.delivery.notes,
      
      timeline: [
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Created',
          title: 'Purchase Order Created',
          description: 'PO drafted and finalized.',
          user: 'Current User'
        },
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Ordered',
          title: 'Order Placed',
          description: 'Sent to supplier.',
          user: 'Current User'
        }
      ],
      createdBy: 'Current User'
    };

    mockPurchases.unshift(newPurchase);
    return newPurchase;
  }
};
