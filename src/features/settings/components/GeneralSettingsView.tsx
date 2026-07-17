import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useGeneralSettings } from "../hooks";
import { generalSettingsSchema, GeneralSettingsFormValues } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const GeneralSettingsView = ({ onDirty }: { onDirty: () => void }) => {
  const { data, isLoading } = useGeneralSettings();

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: data || {
      showroomName: "",
      businessType: "",
      businessDescription: "",
      timezone: "",
      currency: "",
      language: "",
      financialYear: "",
      dateFormat: "",
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

  if (isLoading) return <div className="space-y-4"><div className="h-10 bg-muted animate-pulse rounded-md w-1/3"></div><div className="h-32 bg-muted animate-pulse rounded-md w-full"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">General Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure your primary showroom details and localizations.</p>
      </div>
      
      <Form {...form}>
        <form className="space-y-8">
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="showroomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Showroom Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormDescription>This is your dealership's internal display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="max-w-md">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Automotive Dealership">Automotive Dealership</SelectItem>
                      <SelectItem value="Service Center">Service Center</SelectItem>
                      <SelectItem value="Spares Retailer">Spares Retailer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="max-w-xl resize-none h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="h-px bg-border my-8" />
          <h3 className="text-lg font-medium mb-4">Localization</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INR (₹)">INR (₹)</SelectItem>
                      <SelectItem value="USD ($)">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financialYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Year Start</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select financial year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="April - March">April - March (India)</SelectItem>
                      <SelectItem value="Jan - Dec">January - December</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (India)</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </form>
      </Form>
    </div>
  );
};
