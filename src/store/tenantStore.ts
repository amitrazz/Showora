import { create } from 'zustand';

interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

interface TenantState {
  currentTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentTenant: {
    id: 'tnt_1',
    name: 'Premium Bikes Showroom',
  }, // Pre-selected for mock purposes
  setTenant: (tenant) => set({ currentTenant: tenant }),
}));
