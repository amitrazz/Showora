import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from './services';
import { CreateExpenseWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => expenseService.getExpense(id),
    enabled: !!id,
  });
};

export const useExpenseMetrics = () => {
  return useQuery({
    queryKey: ['expense-metrics'],
    queryFn: expenseService.getMetrics,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateExpenseWizardForm) => expenseService.createExpense(data),
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-metrics'] });

      toast.success('Expense Submitted', {
        description: `Expense ${newExpense.expenseId} submitted for approval.`,
      });
      navigate({ to: `/expenses/${newExpense.id}` });
    },
    onError: (error) => {
      toast.error('Failed to submit Expense', {
        description: error.message,
      });
    },
  });
};

export const useRecordExpensePayment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; method: string; referenceId: string }) =>
      expenseService.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', id] });
      queryClient.invalidateQueries({ queryKey: ['expense-metrics'] });

      toast.success('Payment Recorded', {
        description: 'The payment has been successfully recorded.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to record Payment', {
        description: error.response?.data?.message || error.message || 'An error occurred.',
      });
    },
  });
};

