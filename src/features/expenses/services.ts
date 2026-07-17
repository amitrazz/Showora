import { ExpenseRecord, ExpenseMetrics, ExpenseCategory } from './types';
import { mockExpenses, mockExpenseMetrics } from './data';
import { CreateExpenseWizardForm } from './schemas';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  getExpenses: async (): Promise<ExpenseRecord[]> => {
    await delay(800);
    return mockExpenses;
  },

  getExpense: async (id: string): Promise<ExpenseRecord | undefined> => {
    await delay(500);
    return mockExpenses.find(i => i.id === id);
  },

  getMetrics: async (): Promise<ExpenseMetrics> => {
    await delay(600);
    return mockExpenseMetrics;
  },

  createExpense: async (data: CreateExpenseWizardForm): Promise<ExpenseRecord> => {
    await delay(1200);
    
    const { subtotal, gstAmount, discount } = data.amount;
    const totalAmount = subtotal + gstAmount - discount;
    
    const paidAmount = data.payment.paidAmount || 0;
    const outstandingAmount = totalAmount - paidAmount;

    let status: ExpenseRecord['status'] = 'Submitted';
    let paymentStatus: ExpenseRecord['paymentStatus'] = 'Pending';
    
    if (paidAmount > 0) {
      paymentStatus = paidAmount >= totalAmount ? 'Paid' : 'Partially Paid';
    }

    const newExpense: ExpenseRecord = {
      id: `exp_new_${Math.random().toString(36).substr(2, 9)}`,
      expenseId: `EXP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      title: data.info.title,
      category: data.info.category as ExpenseCategory,
      vendor: data.info.vendor,
      description: data.info.description || '',
      branch: data.info.branch,
      
      status,
      paymentStatus,
      
      expenseDate: data.info.expenseDate,
      dueDate: data.payment.dueDate,
      createdBy: 'Current User',
      
      subtotal,
      gstAmount,
      discount,
      totalAmount,
      
      paidAmount,
      outstandingAmount,
      
      payments: paidAmount > 0 ? [{
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount: paidAmount,
        method: data.payment.method,
        status: 'Completed',
        referenceId: data.payment.referenceId || ''
      }] : [],
      
      timeline: [
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Created',
          title: 'Expense Drafted',
          description: 'Expense record was created.',
          user: 'Current User'
        },
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Submitted',
          title: 'Sent for Approval',
          description: 'Expense submitted to finance manager.',
          user: 'Current User'
        }
      ],
      
      hasReceipts: true,
      isRecurring: data.info.isRecurring,
      recurringFrequency: data.info.recurringFrequency as any
    };

    mockExpenses.unshift(newExpense);
    return newExpense;
  }
};
