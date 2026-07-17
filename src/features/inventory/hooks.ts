import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from './services';
import { CreateInventoryWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryService.getInventory,
  });
};

export const useInventoryVehicle = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => inventoryService.getInventoryVehicle(id),
    enabled: !!id,
  });
};

export const useInventoryMetrics = () => {
  return useQuery({
    queryKey: ['inventory-metrics'],
    queryFn: inventoryService.getMetrics,
  });
};

export const useReceiveInventory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateInventoryWizardForm) => inventoryService.receiveInventory(data),
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-metrics'] });
      toast.success('Inventory received successfully', {
        description: `${newVehicle.make} ${newVehicle.model} added to stock.`,
      });
      navigate({ to: '/inventory' });
    },
    onError: (error) => {
      toast.error('Failed to receive inventory', {
        description: error.message,
      });
    },
  });
};
