import { 
  GeneralSettings, 
  OrganizationSettings, 
  BranchSettings, 
  UserSettings, 
  AuditLogEvent,
  NotificationPreferences,
  AppearanceConfig
} from './types';

export const mockGeneralSettings: GeneralSettings = {
  showroomName: 'Showora Flagship (Bengaluru)',
  businessType: 'Automotive Dealership',
  businessDescription: 'Premium two-wheeler showroom managing sales, service, and spares.',
  timezone: 'Asia/Kolkata',
  currency: 'INR (₹)',
  language: 'English (India)',
  financialYear: 'April - March',
  dateFormat: 'DD/MM/YYYY',
};

export const mockOrganizationSettings: OrganizationSettings = {
  businessName: 'Showora Motors Pvt Ltd',
  gstNumber: '29ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  address: 'No 45, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038',
  email: 'admin@showoramotors.com',
  phone: '+91 98765 43210',
  website: 'https://showoramotors.com',
};

export const mockNotificationPrefs: NotificationPreferences = {
  emailAlerts: true,
  smsAlerts: false,
  invoiceReminders: true,
  lowStockAlerts: true,
  dailyReports: true,
};

export const mockAppearanceConfig: AppearanceConfig = {
  theme: 'system',
  primaryColor: '#3b82f6',
  compactMode: false,
};

export const mockBranches: BranchSettings[] = [
  { id: 'b1', name: 'Indiranagar Flagship', manager: 'Rajesh Kumar', phone: '9876543211', email: 'indiranagar@showora.com', address: '100ft Road, Indiranagar', status: 'active', createdAt: '2023-01-15' },
  { id: 'b2', name: 'Koramangala Sales', manager: 'Priya Singh', phone: '9876543212', email: 'koramangala@showora.com', address: '80ft Road, Koramangala', status: 'active', createdAt: '2023-06-22' },
  { id: 'b3', name: 'Whitefield Service Hub', manager: 'Amit Patel', phone: '9876543213', email: 'whitefield@showora.com', address: 'ITPL Main Road, Whitefield', status: 'active', createdAt: '2024-02-10' },
];

export const mockUsers: UserSettings[] = [
  { id: 'u1', name: 'Vikram Desai', email: 'vikram@showora.com', role: 'Owner', branch: 'All Branches', status: 'active', lastActive: '2 mins ago' },
  { id: 'u2', name: 'Rajesh Kumar', email: 'rajesh@showora.com', role: 'Branch Manager', branch: 'Indiranagar Flagship', status: 'active', lastActive: '1 hr ago' },
  { id: 'u3', name: 'Priya Singh', email: 'priya@showora.com', role: 'Branch Manager', branch: 'Koramangala Sales', status: 'active', lastActive: '3 hrs ago' },
  { id: 'u4', name: 'Neha Sharma', email: 'neha@showora.com', role: 'Sales Executive', branch: 'Indiranagar Flagship', status: 'invited', lastActive: 'Never' },
  { id: 'u5', name: 'Anil Gupta', email: 'anil@showora.com', role: 'Accountant', branch: 'All Branches', status: 'active', lastActive: '1 day ago' },
];

export const mockAuditLogs: AuditLogEvent[] = [
  { id: 'al1', user: 'Vikram Desai', action: 'Updated Tax Rate (GST 18%)', module: 'Settings', timestamp: '2026-07-17T10:30:00Z', ipAddress: '192.168.1.45' },
  { id: 'al2', user: 'Rajesh Kumar', action: 'Approved Quotation #QT-2026-089', module: 'Sales', timestamp: '2026-07-17T09:15:00Z', ipAddress: '192.168.1.112' },
  { id: 'al3', user: 'Anil Gupta', action: 'Exported Monthly P&L Report', module: 'Reports', timestamp: '2026-07-16T18:45:00Z', ipAddress: '192.168.1.78' },
  { id: 'al4', user: 'System', action: 'Automated Database Backup Completed', module: 'System', timestamp: '2026-07-16T02:00:00Z', ipAddress: '127.0.0.1' },
  { id: 'al5', user: 'Priya Singh', action: 'Added New Inventory (12 Units R15)', module: 'Inventory', timestamp: '2026-07-15T14:20:00Z', ipAddress: '192.168.1.99' },
];
