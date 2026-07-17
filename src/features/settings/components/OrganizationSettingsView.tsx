import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useOrganizationSettings } from "../hooks";
import { organizationSettingsSchema, OrganizationSettingsFormValues } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const OrganizationSettingsView = ({ onDirty }: { onDirty: () => void }) => {
  const { data, isLoading } = useOrganizationSettings();

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">Organization Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">These details are used on all official documents, invoices, and communications.</p>
      </div>
      
      <Form {...form}>
        <form className="space-y-6 max-w-2xl">
          
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input {...field} className="uppercase font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input {...field} className="uppercase font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="h-px bg-border my-6" />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registered Address</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none h-24" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </form>
      </Form>
    </div>
  );
};
