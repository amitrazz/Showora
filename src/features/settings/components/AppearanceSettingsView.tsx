import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAppearanceConfig } from "../hooks";
import { appearanceSettingsSchema, AppearanceSettingsFormValues } from "../schemas";
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

  const currentTheme = form.watch('theme');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize how Showora looks and feels on your device.</p>
      </div>
      
      <form className="space-y-8">
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Interface Theme</label>
          
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            
            <label className={`cursor-pointer rounded-md border-2 p-4 transition-colors ${currentTheme === 'light' ? 'border-primary bg-primary/5' : 'border-muted hover:border-accent'}`}>
              <input type="radio" value="light" {...form.register('theme')} className="sr-only" />
              <div className="flex items-center gap-2 mb-2 font-medium">
                 <Sun className="h-4 w-4" /> Light
              </div>
              <div className="h-20 w-full rounded-md bg-[#f8fafc] border shadow-sm"></div>
            </label>

            <label className={`cursor-pointer rounded-md border-2 p-4 transition-colors ${currentTheme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted hover:border-accent'}`}>
              <input type="radio" value="dark" {...form.register('theme')} className="sr-only" />
              <div className="flex items-center gap-2 mb-2 font-medium">
                 <Moon className="h-4 w-4" /> Dark
              </div>
              <div className="h-20 w-full rounded-md bg-[#020817] border shadow-sm"></div>
            </label>

            <label className={`cursor-pointer rounded-md border-2 p-4 transition-colors ${currentTheme === 'system' ? 'border-primary bg-primary/5' : 'border-muted hover:border-accent'}`}>
              <input type="radio" value="system" {...form.register('theme')} className="sr-only" />
              <div className="flex items-center gap-2 mb-2 font-medium">
                 <Laptop className="h-4 w-4" /> System
              </div>
              <div className="h-20 w-full rounded-md bg-gradient-to-r from-[#f8fafc] to-[#020817] border shadow-sm"></div>
            </label>

          </div>
        </div>

        <div className="h-px bg-border my-6 max-w-2xl" />

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 max-w-2xl shadow-sm">
          <div className="space-y-0.5">
            <label className="text-base font-medium">Compact Mode</label>
            <p className="text-sm text-muted-foreground">
              Reduces whitespace in data tables to show more rows on screen.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...form.register('compactMode')} className="sr-only peer" />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

      </form>
    </div>
  );
};
