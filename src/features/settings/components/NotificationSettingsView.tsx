import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNotificationPreferences } from "../hooks";
import { notificationSettingsSchema, NotificationSettingsFormValues } from "../schemas";
import { Bell, Mail, Smartphone, AlertTriangle, FileText } from "lucide-react";

export const NotificationSettingsView = ({ onDirty }: { onDirty: () => void }) => {
  const { data, isLoading } = useNotificationPreferences();

  const form = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: data || {
      emailAlerts: true,
      smsAlerts: false,
      invoiceReminders: true,
      lowStockAlerts: true,
      dailyReports: true,
    }
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  useEffect(() => {
    if (form.formState.isDirty) {
      onDirty();
    }
  }, [form.formState.isDirty, onDirty]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure how you want to be notified about showroom events.</p>
      </div>
      
      <form className="space-y-6 max-w-2xl">
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4" /> Global Channels
          </h3>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <label className="text-base font-medium">Email Alerts</label>
                <p className="text-sm text-muted-foreground">Receive notifications directly to your inbox.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...form.register('emailAlerts')} className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <label className="text-base font-medium">SMS Alerts</label>
                <p className="text-sm text-muted-foreground">Receive critical alerts via text message.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...form.register('smsAlerts')} className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="h-px bg-border my-6" />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Events
          </h3>
          
          <div className="flex flex-row items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <label className="text-sm font-normal">Low Stock Alerts</label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...form.register('lowStockAlerts')} className="sr-only peer" />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex flex-row items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-blue-500" />
              <label className="text-sm font-normal">Overdue Invoice Reminders</label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...form.register('invoiceReminders')} className="sr-only peer" />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
        </div>

      </form>
    </div>
  );
};
