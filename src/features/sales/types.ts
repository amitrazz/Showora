export type SalesStatus = 'Draft' | 'Quotation' | 'Reserved' | 'Payment Pending' | 'Finance Processing' | 'Ready For Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';
export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Finance';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  referenceId?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  notes?: string;
}

export interface FinanceDetails {
  required: boolean;
  partner?: string;
  loanAmount?: number;
  downPayment?: number;
  interestRate?: number;
  tenureMonths?: number;
  emi?: number;
  status?: 'Pending Approval' | 'Approved' | 'Disbursed' | 'Rejected';
  applicationId?: string;
}

export interface DeliveryDetails {
  expectedDate: string;
  actualDate?: string;
  executive: string;
  status: 'Pending' | 'Scheduled' | 'Completed';
  checklistCompleted: boolean;
  notes?: string;
}

export interface SaleTimelineEvent {
  id: string;
  date: string;
  type: 'Created' | 'Quotation' | 'Vehicle Reserved' | 'Payment' | 'Finance' | 'Invoiced' | 'Delivery' | 'Cancelled';
  title: string;
  description: string;
  user: string;
}

export interface SalesRecord {
  id: string;
  invoiceNumber: string;
  saleDate: string;
  status: SalesStatus;
  
  // Relations (Normally these would be DB references, but we duplicate some summary info for fast UI)
  customerId: string;
  customerName: string;
  customerPhone: string;
  
  inventoryId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleVariant: string;
  vehicleColor: string;
  vin: string;
  
  // People
  salesExecutive: string;
  branch: string;
  
  // Pricing Breakdown
  basePrice: number;
  accessoriesPrice: number;
  registrationTax: number;
  roadTax: number;
  insurance: number;
  gstAmount: number;
  discount: number;
  exchangeBonus: number;
  grandTotal: number;
  
  // Accounting
  totalPaid: number;
  outstandingBalance: number;
  profitMargin: number; // Simulated
  
  // Sub-modules
  payments: PaymentRecord[];
  finance: FinanceDetails;
  delivery: DeliveryDetails;
  timeline: SaleTimelineEvent[];
}

export interface SalesMetrics {
  todaysSales: number;
  todaysRevenue: number;
  monthlyRevenue: number;
  unitsSold: number;
  pendingDeliveries: number;
  pendingPayments: number;
  financePending: number;
  averageDealValue: number;
  totalProfit: number;
}
