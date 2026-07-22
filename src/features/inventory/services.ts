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

  updateInventory: async (id: string, data: CreateInventoryWizardForm): Promise<InventoryVehicle> => {
    const response = await api.patch<InventoryVehicle>(`/inventory/${id}`, data);
    return response.data;
  },

  transferInventory: async (id: string, toLocation: string, notes: string): Promise<void> => {
    await api.post(`/inventory/${id}/transfer`, { toLocation, notes });
  },

  exportInventory: async (): Promise<Blob> => {
    const response = await api.get('/inventory/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  importInventory: async (file: File): Promise<{
    success: boolean;
    importedCount: number;
    failedCount: number;
    imported: string[];
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{
      success: boolean;
      importedCount: number;
      failedCount: number;
      imported: string[];
      errors: string[];
    }>('/inventory/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
