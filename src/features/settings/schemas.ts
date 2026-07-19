import { z } from 'zod';

export const generalSettingsSchema = z.object({
  showroomName: z.string().min(2, "Showroom name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessDescription: z.string(),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
  language: z.string().min(1, "Language is required"),
  financialYear: z.string().min(1, "Financial year is required"),
  dateFormat: z.string().min(1, "Date format is required"),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export const organizationSettingsSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  gstNumber: z.string().min(15, "Valid GST number is required"),
  panNumber: z.string().min(10, "Valid PAN number is required"),
  address: z.string().min(5, "Address is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  website: z.string().url("Valid URL is required").or(z.literal('')),
});

export type OrganizationSettingsFormValues = z.infer<typeof organizationSettingsSchema>;

export const notificationSettingsSchema = z.object({
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  invoiceReminders: z.boolean(),
  lowStockAlerts: z.boolean(),
  dailyReports: z.boolean(),
});

export type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;

export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  primaryColor: z.string(),
  compactMode: z.boolean(),
});

export type AppearanceSettingsFormValues = z.infer<typeof appearanceSettingsSchema>;
