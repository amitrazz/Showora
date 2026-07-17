import { 
  GeneralSettings, 
  OrganizationSettings, 
  BranchSettings, 
  UserSettings, 
  AuditLogEvent,
  NotificationPreferences,
  AppearanceConfig
} from './types';
import { api } from '@/lib/api';

export const settingsService = {
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    const response = await api.get<GeneralSettings>('/settings/general');
    return response.data;
  },

  getOrganizationSettings: async (): Promise<OrganizationSettings> => {
    const response = await api.get<OrganizationSettings>('/settings/organization');
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
  }
};
