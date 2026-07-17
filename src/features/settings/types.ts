export interface GeneralSettings {
  showroomName: string;
  businessType: string;
  businessDescription: string;
  timezone: string;
  currency: string;
  language: string;
  financialYear: string;
  dateFormat: string;
}

export interface OrganizationSettings {
  businessName: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  email: string;
  phone: string;
  website: string;
}

export interface BranchSettings {
  id: string;
  name: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface UserSettings {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: 'active' | 'invited' | 'inactive';
  lastActive: string;
}

export interface AuditLogEvent {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  invoiceReminders: boolean;
  lowStockAlerts: boolean;
  dailyReports: boolean;
}

export interface AppearanceConfig {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  compactMode: boolean;
}
