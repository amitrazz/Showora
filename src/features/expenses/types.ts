export type ExpenseStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid' | 'Cancelled';
export type ExpensePaymentStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
export type ExpenseCategory = 'Utilities' | 'Staff Salary' | 'Rent' | 'Marketing' | 'Office Supplies' | 'Vehicle Maintenance' | 'Fuel' | 'Insurance' | 'Registration' | 'Taxes' | 'Stationery' | 'Cleaning' | 'Miscellaneous';

export interface ExpenseTimelineEvent {
  id: string;
  date: string;
  type: 'Created' | 'Submitted' | 'Approved' | 'Rejected' | 'Payment Recorded' | 'Receipt Uploaded';
  title: string;
  description: string;
  user: string;
}

export interface ExpensePaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  referenceId: string;
  status: 'Completed' | 'Pending';
}

export interface ExpenseRecord {
  id: string;
  expenseId: string;
  title: string;
  category: ExpenseCategory;
  vendor: string;
  description: string;
  branch: string;

  status: ExpenseStatus;
  paymentStatus: ExpensePaymentStatus;

  expenseDate: string;
  dueDate: string;
  createdBy: string;
  approvedBy?: string;

  // Amounts
  subtotal: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;

  // Payment
  paidAmount: number;
  outstandingAmount: number;

  payments: ExpensePaymentRecord[];
  timeline: ExpenseTimelineEvent[];
  supportingDocuments?: SupportingDocument[];

  // Attachments
  hasReceipts: boolean;
  isRecurring: boolean;
  recurringFrequency?: 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface ExpenseMetrics {
  totalExpenses: number;
  todaysExpenses: number;
  monthlyExpenses: number;
  pendingApproval: number;
  pendingPaymentAmount: number;
  activeRecurring: number;
  monthlyBudget: number;
  budgetUtilization: number;
  averageDailyExpense: number;
}

export interface SupportingDocument {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}