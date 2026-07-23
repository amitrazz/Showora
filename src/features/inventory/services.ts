import { InventoryVehicle, InventoryMetrics, InventoryListOptions, InventoryListResponse } from './types';
import { CreateInventoryWizardForm } from './schemas';
import { api } from '@/lib/api';

export const inventoryService = {
  getInventory: async (options: InventoryListOptions = {}): Promise<InventoryListResponse | InventoryVehicle[]> => {
    const response = await api.get<any>('/inventory', {
      params: {
        ...(options.search ? { search: options.search } : {}),
        limit: options.limit ?? 10,
        ...(options.cursor ? { cursor: options.cursor } : {}),
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return {
      data: [],
      hasMore: false,
      limit: options.limit ?? 10,
      totalCount: 0,
    };
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
