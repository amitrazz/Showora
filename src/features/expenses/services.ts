import { ExpenseRecord, ExpenseMetrics, ExpenseListOptions, ExpenseListResponse } from './types';
import { CreateExpenseWizardForm } from './schemas';
import { api } from '@/lib/api';

export const expenseService = {
  getExpenses: async (options: ExpenseListOptions = {}): Promise<ExpenseListResponse> => {
    const response = await api.get<any>('/expenses', {
      params: {
        ...(options.search ? { search: options.search } : {}),
        limit: options.limit ?? 10,
        ...(options.cursor ? { cursor: options.cursor } : {}),
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        totalCount: response.data.length,
        limit: options.limit ?? 10,
        hasMore: false,
        nextCursor: null,
      };
    }
    return response.data;
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
      referenceId: data.payment.referenceId || 'N/A'
    };

    const response = await api.post<ExpenseRecord>('/expenses', payload);
    return response.data;
  },

  updateExpense: async (id: string, data: CreateExpenseWizardForm): Promise<ExpenseRecord> => {
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
      referenceId: data.payment.referenceId || 'N/A'
    };

    const response = await api.patch<ExpenseRecord>(`/expenses/${id}`, payload);
    return response.data;
  },

  recordPayment: async (id: string, data: { amount: number; method: string; referenceId: string }): Promise<void> => {
    await api.post(`/expenses/${id}/payments`, data);
  },

  exportExpenses: async (): Promise<Blob> => {
    const response = await api.get('/expenses/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  importExpenses: async (file: File): Promise<{
    success: boolean;
    importedCount: number;
    failedCount: number;
    imported: string[];
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{
      success: boolean;
      importedCount: number;
      failedCount: number;
      imported: string[];
      errors: string[];
    }>('/expenses/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

