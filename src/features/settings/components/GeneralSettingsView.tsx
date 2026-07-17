import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useGeneralSettings } from "../hooks";
import { generalSettingsSchema, GeneralSettingsFormValues } from "../schemas";
import { Input } from "@/components/ui/input";

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

  const { errors } = form.formState;
  const SelectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">General Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure your primary showroom details and localizations.</p>
      </div>
      
      <form className="space-y-8">
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Showroom Name</label>
            <Input {...form.register("showroomName")} className="max-w-md" />
            <p className="text-xs text-muted-foreground">This is your dealership's internal display name.</p>
            {errors.showroomName && <p className="text-xs text-destructive">{errors.showroomName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Type</label>
            <select {...form.register("businessType")} className={`${SelectClass} max-w-md`}>
              <option value="">Select business type</option>
              <option value="Automotive Dealership">Automotive Dealership</option>
              <option value="Service Center">Service Center</option>
              <option value="Spares Retailer">Spares Retailer</option>
            </select>
            {errors.businessType && <p className="text-xs text-destructive">{errors.businessType.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Business Description</label>
            <textarea 
              {...form.register("businessDescription")} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-xl resize-none h-24"
            />
            {errors.businessDescription && <p className="text-xs text-destructive">{errors.businessDescription.message}</p>}
          </div>
        </div>

        <div className="h-px bg-border my-8" />
        <h3 className="text-lg font-medium mb-4">Localization</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
            <select {...form.register("timezone")} className={SelectClass}>
              <option value="">Select timezone</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
            </select>
            {errors.timezone && <p className="text-xs text-destructive">{errors.timezone.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Currency</label>
            <select {...form.register("currency")} className={SelectClass}>
              <option value="">Select currency</option>
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
            </select>
            {errors.currency && <p className="text-xs text-destructive">{errors.currency.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Financial Year Start</label>
            <select {...form.register("financialYear")} className={SelectClass}>
              <option value="">Select financial year</option>
              <option value="April - March">April - March (India)</option>
              <option value="Jan - Dec">January - December</option>
            </select>
            {errors.financialYear && <p className="text-xs text-destructive">{errors.financialYear.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Format</label>
            <select {...form.register("dateFormat")} className={SelectClass}>
              <option value="">Select date format</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (India)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
            {errors.dateFormat && <p className="text-xs text-destructive">{errors.dateFormat.message}</p>}
          </div>
        </div>

      </form>
    </div>
  );
};
