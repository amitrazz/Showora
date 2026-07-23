import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from './services';
import { CreateInventoryWizardForm } from './schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

import { InventoryListOptions } from './types';

export const useInventory = (options: InventoryListOptions = {}) => {
  return useQuery({
    queryKey: ['inventory', options],
    queryFn: () => inventoryService.getInventory(options),
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
    onError: (error: any) => {
      toast.error('Failed to receive inventory', {
        description: error.message,
      });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateInventoryWizardForm }) =>
      inventoryService.updateInventory(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['inventory-metrics'] });
      toast.success('Inventory updated successfully');
      navigate({ to: '/inventory/$inventoryId', params: { inventoryId: variables.id } });
    },
    onError: (error: any) => {
      toast.error('Failed to update inventory', {
        description: error.message,
      });
    },
  });
};

export const useImportInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => inventoryService.importInventory(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-metrics'] });
      if (result.success) {
        toast.success('Inventory imported successfully', {
          description: `Successfully imported ${result.importedCount} vehicle(s).`,
        });
      } else {
        if (result.importedCount > 0) {
          toast.warning('Import completed with errors', {
            description: `Imported ${result.importedCount} vehicle(s), but ${result.failedCount} row(s) failed.`,
          });
        } else {
          toast.error('Import failed', {
            description: `${result.failedCount} row(s) failed to import.`,
          });
        }
      }
    },
    onError: (error: any) => {
      toast.error('Failed to import inventory', {
        description: error.response?.data?.message || error.message || 'An error occurred during import.',
      });
    },
  });
};
