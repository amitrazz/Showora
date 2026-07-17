export type InvoiceStatus = 'Draft' | 'Generated' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled' | 'Refunded';

export interface InvoiceTimelineEvent {
  id: string;
  date: string;
  type: 'Generated' | 'Sent' | 'Payment Recorded' | 'Reminder Sent' | 'Printed' | 'Cancelled';
  title: string;
  description: string;
  user: string;
}

export interface InvoicePaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  referenceId: string;
  status: 'Completed' | 'Pending';
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  
  // Relations
  saleId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  
  inventoryId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleVariant: string;
  vehicleColor: string;
  vin: string;
  engineNumber: string;
  motorNumber?: string;
  chargeNumber?: string;
  controllerNumber?: string;
  batterySerialNumber?: string;
  
  // People
  salesExecutive: string;
  branch: string;
  
  // Pricing Breakdown
  basePrice: number;
  accessoriesPrice: number;
  registrationTax: number;
  insurance: number;
  otherCharges: number;
  
  discount: number;
  
  // Tax details
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalGst: number;
  
  grandTotal: number;
  
  // Accounting
  amountPaid: number;
  outstandingAmount: number;
  payments: InvoicePaymentRecord[];
  
  timeline: InvoiceTimelineEvent[];
}

export interface InvoiceMetrics {
  totalInvoices: number;
  invoicesThisMonth: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
  gstCollected: number;
  todaysBilling: number;
}
