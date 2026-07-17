import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from './services';
import { CreateSaleWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: salesService.getSales,
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
    onSuccess: (newSale) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });
      
      // In a real app, this would also invalidate inventory and customer queries 
      // since allocating a vehicle affects stock status.
      queryClient.invalidateQueries({ queryKey: ['inventory'] });

      toast.success('Sale created successfully', {
        description: `Invoice ${newSale.invoiceNumber} generated.`,
      });
      navigate({ to: `/sales/${newSale.id}` });
    },
    onError: (error) => {
      toast.error('Failed to create sale', {
        description: error.message,
      });
    },
  });
};
