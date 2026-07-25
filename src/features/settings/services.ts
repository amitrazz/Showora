import { 
  GeneralSettings, 
  OrganizationSettings, 
  BranchSettings, 
  UserSettings, 
  AuditLogEvent,
  NotificationPreferences,
  AppearanceConfig,
  Role,
  CreateRoleDto,
  UpdateRoleDto
} from './types';
import { api } from '@/lib/api';

export const settingsService = {
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    const response = await api.get<GeneralSettings>('/settings/general');
    return response.data;
  },

  updateGeneralSettings: async (data: GeneralSettings): Promise<GeneralSettings> => {
    const response = await api.patch<GeneralSettings>('/settings/general', data);
    return response.data;
  },

  getOrganizationSettings: async (): Promise<OrganizationSettings> => {
    const response = await api.get<OrganizationSettings>('/settings/organization');
    return response.data;
  },

  updateOrganizationSettings: async (data: OrganizationSettings): Promise<OrganizationSettings> => {
    const response = await api.patch<OrganizationSettings>('/settings/organization', data);
    return response.data;
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<NotificationPreferences>('/settings/notifications');
    return response.data;
  },

  getAppearanceConfig: async (): Promise<AppearanceConfig> => {
    const response = await api.get<AppearanceConfig>('/settings/appearance');
    return response.data;
  },

  getBranches: async (): Promise<BranchSettings[]> => {
    const response = await api.get<BranchSettings[]>('/settings/branches');
    return response.data;
  },

  getUsers: async (): Promise<UserSettings[]> => {
    const response = await api.get<UserSettings[]>('/settings/users');
    return response.data;
  },

  getAuditLogs: async (): Promise<AuditLogEvent[]> => {
    const response = await api.get<AuditLogEvent[]>('/settings/audit-logs');
    return response.data;
  },

  updateSettings: async (module: string, data: any): Promise<void> => {
    await api.patch(`/settings/${module}`, data);
  },

  getPermissions: async (module?: string): Promise<any> => {
    const response = await api.get(`/permissions${module ? `?module=${module}` : ''}`);
    return response.data;
  },

  getRoles: async (module?: string): Promise<Role[]> => {
    const response = await api.get<Role[]>(`/roles${module ? `?module=${module}` : ''}`);
    return response.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleDto): Promise<Role> => {
    const response = await api.post<Role>('/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    const response = await api.put<Role>(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/roles/${id}`);
    return response.data;
  }
};
