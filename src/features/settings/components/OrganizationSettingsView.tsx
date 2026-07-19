import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useOrganizationSettings, useUpdateOrganizationSettings } from "../hooks";
import { organizationSettingsSchema, OrganizationSettingsFormValues } from "../schemas";
import { Input } from "@/components/ui/input";

export const OrganizationSettingsView = ({ onDirty, onSaved }: { onDirty: () => void; onSaved: () => void }) => {
  const { data, isLoading } = useOrganizationSettings();
  const { mutate: updateOrganizationSettings } = useUpdateOrganizationSettings();

  const form = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: data || {
      businessName: "",
      gstNumber: "",
      panNumber: "",
      address: "",
      email: "",
      phone: "",
      website: "",
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

  const onSubmit = form.handleSubmit((values) => {
    updateOrganizationSettings(values, {
      onSuccess: (settings) => {
        form.reset(settings);
        onSaved();
      },
    });
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">Organization Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">These details are used on all official documents, invoices, and communications.</p>
      </div>
      
      <form id="organization-settings-form" onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Legal Business Name</label>
          <Input {...form.register("businessName")} />
          {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">GSTIN</label>
            <Input {...form.register("gstNumber")} className="uppercase font-mono" />
            {errors.gstNumber && <p className="text-xs text-destructive">{errors.gstNumber.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">PAN Number</label>
            <Input {...form.register("panNumber")} className="uppercase font-mono" />
            {errors.panNumber && <p className="text-xs text-destructive">{errors.panNumber.message}</p>}
          </div>
        </div>

        <div className="h-px bg-border my-6" />

        <div className="space-y-2">
          <label className="text-sm font-medium">Support Email</label>
          <Input {...form.register("email")} type="email" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Phone</label>
          <Input {...form.register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Website (Optional)</label>
          <Input {...form.register("website")} />
          {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Registered Address</label>
          <textarea 
            {...form.register("address")} 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-24"
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>

      </form>
    </div>
  );
};
