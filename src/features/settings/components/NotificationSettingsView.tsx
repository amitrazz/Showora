import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNotificationPreferences } from "../hooks";
import { notificationSettingsSchema, NotificationSettingsFormValues } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
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
      
      <Form {...form}>
        <form className="space-y-6 max-w-2xl">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4" /> Global Channels
            </h3>
            
            <FormField
              control={form.control}
              name="emailAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">Email Alerts</FormLabel>
                      <p className="text-sm text-muted-foreground">Receive notifications directly to your inbox.</p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smsAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">SMS Alerts</FormLabel>
                      <p className="text-sm text-muted-foreground">Receive critical alerts via text message.</p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="h-px bg-border my-6" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Events
            </h3>
            
            <FormField
              control={form.control}
              name="lowStockAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <FormLabel className="text-sm font-normal">Low Stock Alerts</FormLabel>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="invoiceReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <FormLabel className="text-sm font-normal">Overdue Invoice Reminders</FormLabel>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />
            
          </div>

        </form>
      </Form>
    </div>
  );
};
