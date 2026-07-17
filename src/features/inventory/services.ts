import { InventoryVehicle, InventoryMetrics } from './types';
import { CreateInventoryWizardForm } from './schemas';
import { api } from '@/lib/api';

export const inventoryService = {
  getInventory: async (): Promise<InventoryVehicle[]> => {
    const response = await api.get<{ data: InventoryVehicle[] }>('/inventory');
    return response.data.data;
  },

  getInventoryVehicle: async (id: string): Promise<InventoryVehicle | undefined> => {
    const response = await api.get<InventoryVehicle>(`/inventory/${id}`);
    return response.data;
  },

  getMetrics: async (): Promise<InventoryMetrics> => {
    const response = await api.get<InventoryMetrics>('/inventory/metrics');
    return response.data;
  },

  receiveInventory: async (data: CreateInventoryWizardForm): Promise<InventoryVehicle> => {
    const response = await api.post<InventoryVehicle>('/inventory', data);
    return response.data;
  },

  transferInventory: async (id: string, toLocation: string, notes: string): Promise<void> => {
    await api.post(`/inventory/${id}/transfer`, { toLocation, notes });
  }
};
