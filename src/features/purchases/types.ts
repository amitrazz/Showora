export type PurchaseStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled' | 'Closed';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  outstandingBalance: number;
}

export interface PurchaseItem {
  id: string;
  make: string;
  model: string;
  variant: string;
  color: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseTimelineEvent {
  id: string;
  date: string;
  type: 'Created' | 'Approved' | 'Ordered' | 'Received' | 'Payment' | 'Cancelled' | 'Closed';
  title: string;
  description: string;
  user: string;
}

export interface PurchasePaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  referenceId: string;
  status: 'Completed' | 'Pending';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: string;
  expectedDelivery: string;
  status: PurchaseStatus;
  
  supplierId: string;
  supplierName: string;
  
  items: PurchaseItem[];
  
  // Pricing
  subtotal: number;
  discount: number;
  gstAmount: number;
  transportation: number;
  insurance: number;
  otherCharges: number;
  grandTotal: number;
  
  // Payments
  paymentTerms: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  outstandingAmount: number;
  payments: PurchasePaymentRecord[];
  
  // Delivery
  warehouse: string;
  deliveryNotes?: string;
  
  timeline: PurchaseTimelineEvent[];
  createdBy: string;
}

export interface PurchaseMetrics {
  totalOrders: number;
  pendingDeliveries: number;
  receivedThisMonth: number;
  outstandingPayments: number;
  totalPurchaseValue: number;
  inventoryAdded: number;
  averageProcurementCost: number;
  activeSuppliers: number;
}
