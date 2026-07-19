export type CustomerStatus = 'active' | 'inactive' | 'lead';
export type LoanStatus = 'approved' | 'pending' | 'rejected' | 'disbursed' | null;

export interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface FinanceDetails {
  required: boolean;
  company?: string;
  loanAmount?: number;
  emi?: number;
  tenureMonths?: number;
  downPayment?: number;
  status?: LoanStatus;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  bikeModel: string;
  variant: string;
  price: number;
  purchaseDate: string;
  paymentMode: 'cash' | 'finance' | 'card' | 'upi' | 'bank_transfer';
  warranty: string;
  status: 'completed' | 'pending_delivery' | 'processing';
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  mode: string;
  referenceId: string;
  status: 'success' | 'pending' | 'failed';
}

export interface Document {
  id: string;
  type: 'pan' | 'aadhar' | 'driving_license' | 'insurance' | 'invoice' | 'finance';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned: boolean;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'invoice' | 'payment' | 'delivery' | 'document' | 'note';
  title: string;
  description: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  
  address: Address;
  
  // Identity
  panNumber?: string;
  aadharNumber?: string;
  drivingLicense?: string;
  gstNumber?: string;
  
  finance: FinanceDetails;
  
  // Meta
  status: CustomerStatus;
  customerSince: string;
  salesExecutive: string;
  leadSource?: string;
  tags: string[];
  
  // Computed/Nested Data (Often populated dynamically via API in real app)
  purchases: Purchase[];
  payments: Payment[];
  documents: Document[];
  notes: Note[];
  timeline: TimelineEvent[];
  
  // Summary Stats
  totalPurchases: number;
  lifetimeValue: number;
  outstandingAmount: number;
  lastPurchaseDate?: string;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  outstandingAmount: number;
  totalRevenue: number;
  repeatCustomers: number;
}

export interface CustomerListResponse {
  data: Customer[];
  totalCount: number;
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export interface CustomerListOptions {
  search?: string;
  limit?: number;
  cursor?: string;
}
