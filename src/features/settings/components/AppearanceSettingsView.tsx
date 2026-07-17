import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAppearanceConfig } from "../hooks";
import { appearanceSettingsSchema, AppearanceSettingsFormValues } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Laptop } from "lucide-react";

export const AppearanceSettingsView = ({ onDirty }: { onDirty: () => void }) => {
  const { data, isLoading } = useAppearanceConfig();

  const form = useForm<AppearanceSettingsFormValues>({
    resolver: zodResolver(appearanceSettingsSchema),
    defaultValues: data || {
      theme: 'system',
      primaryColor: '#3b82f6',
      compactMode: false,
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
        <h2 className="text-xl font-medium tracking-tight">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize how Showora looks and feels on your device.</p>
      </div>
      
      <Form {...form}>
        <form className="space-y-8">
          
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Interface Theme</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-4 max-w-2xl"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent">
                          <div className="flex items-center gap-2 mb-2 font-medium">
                             <Sun className="h-4 w-4" /> Light
                          </div>
                          <div className="h-20 w-full rounded-md bg-[#f8fafc] border shadow-sm"></div>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent">
                          <div className="flex items-center gap-2 mb-2 font-medium">
                             <Moon className="h-4 w-4" /> Dark
                          </div>
                          <div className="h-20 w-full rounded-md bg-[#020817] border shadow-sm"></div>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="system" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent">
                          <div className="flex items-center gap-2 mb-2 font-medium">
                             <Laptop className="h-4 w-4" /> System
                          </div>
                          <div className="h-20 w-full rounded-md bg-gradient-to-r from-[#f8fafc] to-[#020817] border shadow-sm"></div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="h-px bg-border my-6 max-w-2xl" />

          <FormField
            control={form.control}
            name="compactMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 max-w-2xl shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Compact Mode</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Reduces whitespace in data tables to show more rows on screen.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

        </form>
      </Form>
    </div>
  );
};
