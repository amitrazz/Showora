import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from './services';
import { CreateSaleWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

import { SalesListOptions } from './types';

export const useSales = (options: SalesListOptions = {}) => {
  return useQuery({
    queryKey: ['sales', options],
    queryFn: () => salesService.getSales(options),
  });
};

export const useSale = (id: string) => {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => salesService.getSale(id),
    enabled: !!id,
  });
};

export const useSalesMetrics = () => {
  return useQuery({
    queryKey: ['sales-metrics'],
    queryFn: salesService.getMetrics,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateSaleWizardForm) => salesService.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });

      toast.success('Sale created successfully');
      navigate({ to: '/sales' });
    },
    onError: (error) => {
      toast.error('Failed to create sale', {
        description: error.message,
      });
    },
  });
};

export const useRecordSalesPayment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; method: string; referenceId: string }) =>
      salesService.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales', id] });
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });

      toast.success('Payment Recorded', {
        description: 'Sales payment has been registered successfully.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to record Payment', {
        description: error.message || 'Error occurred while saving payment.',
      });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateSaleWizardForm }) =>
      salesService.updateSale(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Sale updated successfully');
      navigate({ to: '/sales/$saleId', params: { saleId: variables.id } });
    },
    onError: (error: any) => {
      toast.error('Failed to update sale', {
        description: error.message,
      });
    },
  });
};

export const useImportSales = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => salesService.importSales(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });

      if (data.importedCount > 0) {
        toast.success(`Imported ${data.importedCount} sales records`, {
          description: data.failedCount > 0 ? `${data.failedCount} records failed validation.` : undefined,
        });
      } else if (data.failedCount > 0) {
        toast.error('Failed to import sales records', {
          description: 'Check the error logs for details.',
        });
      }
    },
    onError: (error: any) => {
      toast.error('Import Failed', {
        description: error.message || 'Failed to upload and import sales CSV file.',
      });
    },
  });
};
