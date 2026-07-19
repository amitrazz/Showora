import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from './services';
import { CreatePurchaseWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export const usePurchases = () => {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: purchaseService.getPurchases,
  });
};

export const usePurchase = (id: string) => {
  return useQuery({
    queryKey: ['purchases', id],
    queryFn: () => purchaseService.getPurchase(id),
    enabled: !!id,
  });
};

export const usePurchaseMetrics = () => {
  return useQuery({
    queryKey: ['purchase-metrics'],
    queryFn: purchaseService.getMetrics,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePurchaseWizardForm) => purchaseService.createPurchase(data),
    onSuccess: (newPurchase) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-metrics'] });

      toast.success('Purchase Order Created', {
        description: `${newPurchase.poNumber} has been placed successfully.`,
      });
      navigate({ to: `/purchases/${newPurchase.id}` });
    },
    onError: (error) => {
      toast.error('Failed to create Purchase Order', {
        description: error.message,
      });
    },
  });
};

export const useRecordPurchasePayment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; method: string; referenceId: string }) =>
      purchaseService.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-metrics'] });

      toast.success('Payment Recorded', {
        description: 'Supplier payment has been registered successfully.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to record Payment', {
        description: error.message || 'Error occurred while saving payment.',
      });
    },
  });
};

