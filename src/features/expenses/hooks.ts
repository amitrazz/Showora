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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-metrics'] });

      toast.success('Expense Submitted successfully');
      navigate({ to: '/expenses' });
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

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateExpenseWizardForm }) =>
      expenseService.updateExpense(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['expense-metrics'] });
      toast.success('Expense updated successfully');
      navigate({ to: '/expenses/$expenseId', params: { expenseId: variables.id } });
    },
    onError: (error: any) => {
      toast.error('Failed to update Expense', {
        description: error.message,
      });
    },
  });
};

export const useImportExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => expenseService.importExpenses(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-metrics'] });
      if (result.success) {
        toast.success('Expenses imported successfully', {
          description: `Successfully imported ${result.importedCount} expense(s).`,
        });
      } else {
        if (result.importedCount > 0) {
          toast.warning('Import completed with errors', {
            description: `Imported ${result.importedCount} expense(s), but ${result.failedCount} row(s) failed.`,
          });
        } else {
          toast.error('Import failed', {
            description: `${result.failedCount} row(s) failed to import.`,
          });
        }
      }
    },
    onError: (error: any) => {
      toast.error('Failed to import expenses', {
        description: error.response?.data?.message || error.message || 'An error occurred during import.',
      });
    },
  });
};
