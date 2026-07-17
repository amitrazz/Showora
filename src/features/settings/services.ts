import { 
  GeneralSettings, 
  OrganizationSettings, 
  BranchSettings, 
  UserSettings, 
  AuditLogEvent,
  NotificationPreferences,
  AppearanceConfig
} from './types';
import { 
  mockGeneralSettings, 
  mockOrganizationSettings, 
  mockNotificationPrefs, 
  mockAppearanceConfig,
  mockBranches,
  mockUsers,
  mockAuditLogs
} from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    await delay(300);
    return mockGeneralSettings;
  },

  getOrganizationSettings: async (): Promise<OrganizationSettings> => {
    await delay(300);
    return mockOrganizationSettings;
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    await delay(300);
    return mockNotificationPrefs;
  },

  getAppearanceConfig: async (): Promise<AppearanceConfig> => {
    await delay(300);
    return mockAppearanceConfig;
  },

  getBranches: async (): Promise<BranchSettings[]> => {
    await delay(500);
    return mockBranches;
  },

  getUsers: async (): Promise<UserSettings[]> => {
    await delay(500);
    return mockUsers;
  },

  getAuditLogs: async (): Promise<AuditLogEvent[]> => {
    await delay(600);
    return mockAuditLogs;
  },

  updateSettings: async (module: string, data: any): Promise<void> => {
    await delay(800); // Simulate network save
    console.log(`Saved ${module} settings:`, data);
  }
};
