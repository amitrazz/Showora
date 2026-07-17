import { ExpenseRecord, ExpenseMetrics, ExpenseCategory, ExpenseStatus, ExpensePaymentStatus, ExpenseTimelineEvent } from './types';
import { subDays, addDays } from 'date-fns';

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 10)}`;

const categories: ExpenseCategory[] = ['Utilities', 'Staff Salary', 'Rent', 'Marketing', 'Office Supplies', 'Vehicle Maintenance', 'Fuel', 'Insurance', 'Registration', 'Taxes', 'Stationery', 'Cleaning', 'Miscellaneous'];
const vendors = ['BESCOM', 'Tata Power', 'BSNL Broadband', 'Airtel Enterprise', 'Local Landlord Assoc.', 'Reliance Smart', 'Indian Oil', 'HP Petrol Pump', 'HDFC ERGO', 'JustDial Marketing', 'Google Ads', 'OfficeMart', 'Urban Company Cleaning'];
const branches = ['Downtown Main Showroom', 'Northside Branch', 'Airport Road Outlet'];
const users = ['Rajesh Kumar', 'Priya Singh', 'Amit Patel', 'Neha Sharma', 'Vikram Desai'];

const generateExpense = (i: number): ExpenseRecord => {
  const isRecurring = Math.random() > 0.8;
  const category = getRandom(categories);
  const vendor = getRandom(vendors);
  
  const expenseDate = subDays(new Date(), getRandomNum(0, 90));
  const dueDate = addDays(expenseDate, getRandomNum(5, 30));
  
  const subtotal = getRandomNum(500, 50000);
  const gstAmount = Math.random() > 0.3 ? subtotal * 0.18 : 0;
  const discount = Math.random() > 0.8 ? getRandomNum(100, 1000) : 0;
  
  const totalAmount = subtotal + gstAmount - discount;
  
  const r = Math.random();
  let status: ExpenseStatus = 'Approved';
  let paymentStatus: ExpensePaymentStatus = 'Paid';
  let paidAmount = totalAmount;
  
  if (r < 0.1) {
    status = 'Draft';
    paymentStatus = 'Pending';
    paidAmount = 0;
  } else if (r < 0.2) {
    status = 'Submitted';
    paymentStatus = 'Pending';
    paidAmount = 0;
  } else if (r < 0.3) {
    status = 'Approved';
    paymentStatus = 'Pending';
    paidAmount = 0;
  } else if (r < 0.4) {
    status = 'Approved';
    paymentStatus = 'Partially Paid';
    paidAmount = totalAmount * 0.5;
  } else if (r < 0.5 && new Date(dueDate) < new Date()) {
    status = 'Approved';
    paymentStatus = 'Overdue';
    paidAmount = 0;
  }

  const outstandingAmount = totalAmount - paidAmount;

  const payments = paidAmount > 0 ? [
    {
      id: generateId('pay'),
      date: addDays(expenseDate, getRandomNum(1, 5)).toISOString(),
      amount: paidAmount,
      method: getRandom(['Bank Transfer', 'Corporate Card', 'UPI', 'Cash']),
      referenceId: `TXN${getRandomNum(100000, 999999)}`,
      status: 'Completed' as const
    }
  ] : [];

  const timeline: ExpenseTimelineEvent[] = [
    {
      id: generateId('tl'),
      date: expenseDate.toISOString(),
      type: 'Created' as const,
      title: 'Expense Drafted',
      description: 'Expense record was created.',
      user: getRandom(users)
    }
  ];

  if (status !== 'Draft') {
    timeline.push({
      id: generateId('tl'),
      date: addDays(expenseDate, 1).toISOString(),
      type: 'Submitted' as const,
      title: 'Sent for Approval',
      description: 'Expense submitted to finance manager.',
      user: getRandom(users)
    });
  }

  if (status === 'Approved' && paymentStatus === 'Paid') {
    timeline.push({
      id: generateId('tl'),
      date: addDays(expenseDate, 2).toISOString(),
      type: 'Approved' as const,
      title: 'Expense Approved',
      description: 'Approved for payment.',
      user: 'Finance Manager'
    });
  }

  if (paidAmount > 0) {
    timeline.push({
      id: generateId('tl'),
      date: payments[0].date,
      type: 'Payment Recorded' as const,
      title: 'Payment Processed',
      description: `Payment of ₹${paidAmount.toFixed(2)} recorded.`,
      user: 'Finance Manager'
    });
  }

  return {
    id: `exp_${1000 + i}`,
    expenseId: `EXP-${new Date().getFullYear()}-${8000 + i}`,
    title: `${category} Bill - ${vendor}`,
    category,
    vendor,
    description: `Monthly ${category.toLowerCase()} settlement for ${vendor}`,
    branch: getRandom(branches),
    
    status,
    paymentStatus,
    
    expenseDate: expenseDate.toISOString(),
    dueDate: dueDate.toISOString(),
    createdBy: getRandom(users),
    approvedBy: status === 'Approved' ? 'Finance Manager' : undefined,
    
    subtotal,
    gstAmount,
    discount,
    totalAmount,
    
    paidAmount,
    outstandingAmount,
    
    payments,
    timeline,
    
    hasReceipts: Math.random() > 0.2,
    isRecurring,
    recurringFrequency: isRecurring ? getRandom(['Monthly', 'Quarterly', 'Yearly']) : undefined
  };
};

export const mockExpenses: ExpenseRecord[] = Array.from({ length: 250 }).map((_, i) => generateExpense(i));

export const mockExpenseMetrics: ExpenseMetrics = {
  totalExpenses: mockExpenses.length,
  todaysExpenses: mockExpenses.filter(e => new Date(e.expenseDate).toDateString() === new Date().toDateString()).length,
  monthlyExpenses: mockExpenses.filter(e => new Date(e.expenseDate).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.totalAmount, 0),
  pendingApproval: mockExpenses.filter(e => e.status === 'Submitted').length,
  pendingPaymentAmount: mockExpenses.reduce((sum, e) => sum + e.outstandingAmount, 0),
  activeRecurring: mockExpenses.filter(e => e.isRecurring).length,
  monthlyBudget: 1500000, // 15 Lakhs
  budgetUtilization: 0, // Calculated below
  averageDailyExpense: 0 // Calculated below
};

mockExpenseMetrics.budgetUtilization = (mockExpenseMetrics.monthlyExpenses / mockExpenseMetrics.monthlyBudget) * 100;
mockExpenseMetrics.averageDailyExpense = mockExpenseMetrics.monthlyExpenses / new Date().getDate();
