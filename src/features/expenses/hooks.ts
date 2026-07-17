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
