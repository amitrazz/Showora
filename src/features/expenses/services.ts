import { ExpenseRecord, ExpenseMetrics } from './types';
import { CreateExpenseWizardForm } from './schemas';
import { api } from '@/lib/api';

export const expenseService = {
  getExpenses: async (): Promise<ExpenseRecord[]> => {
    const response = await api.get<{ data: ExpenseRecord[] }>('/expenses');
    return response.data.data;
  },

  getExpense: async (id: string): Promise<ExpenseRecord | undefined> => {
    const response = await api.get<ExpenseRecord>(`/expenses/${id}`);
    return response.data;
  },

  getMetrics: async (): Promise<ExpenseMetrics> => {
    const response = await api.get<ExpenseMetrics>('/expenses/metrics');
    return response.data;
  },

  createExpense: async (data: CreateExpenseWizardForm): Promise<ExpenseRecord> => {
    const payload = {
      title: data.info.title,
      category: data.info.category,
      vendor: data.info.vendor,
      description: data.info.description,
      branch: data.info.branch,
      expenseDate: data.info.expenseDate,
      isRecurring: data.info.isRecurring,
      recurringFrequency: data.info.recurringFrequency,
      subtotal: data.amount.subtotal,
      gstAmount: data.amount.gstAmount,
      discount: data.amount.discount,
      dueDate: data.payment.dueDate,
      paymentMethod: data.payment.method,
      paidAmount: data.payment.paidAmount,
      referenceId: data.payment.referenceId
    };

    const response = await api.post<ExpenseRecord>('/expenses', payload);
    return response.data;
  },

  recordPayment: async (id: string, data: { amount: number; method: string; referenceId: string }): Promise<void> => {
    await api.post(`/expenses/${id}/payments`, data);
  }
};

