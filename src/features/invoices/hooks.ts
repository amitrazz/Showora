import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from './services';
import { CreateInvoiceWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: invoiceService.getInvoices,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoiceService.getInvoice(id),
    enabled: !!id,
  });
};

export const useInvoiceMetrics = () => {
  return useQuery({
    queryKey: ['invoice-metrics'],
    queryFn: invoiceService.getMetrics,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateInvoiceWizardForm) => invoiceService.createInvoice(data),
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-metrics'] });

      toast.success('Invoice Generated', {
        description: `Invoice ${newInvoice.invoiceNumber} created successfully.`,
      });
      navigate({ to: `/invoices/${newInvoice.id}` });
    },
    onError: (error) => {
      toast.error('Failed to generate Invoice', {
        description: error.message,
      });
    },
  });
};

export const useRecordInvoicePayment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; method: string; referenceId: string }) =>
      invoiceService.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      queryClient.invalidateQueries({ queryKey: ['invoice-metrics'] });

      toast.success('Payment Recorded', {
        description: 'Invoice payment has been registered successfully.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to record Payment', {
        description: error.message || 'Error occurred while saving payment.',
      });
    },
  });
};

