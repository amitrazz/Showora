import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CreateRoleDto } from "../../types";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required").trim(),
  description: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export const RoleForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: {
  defaultValues?: Partial<RoleFormValues>;
  onSubmit: (data: CreateRoleDto) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
}) => {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Role Name <span className="text-destructive">*</span>
          </label>
          <input
            {...form.register("name")}
            className="w-full bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. Sales Executive"
            disabled={!!defaultValues?.name} // Disabling if it's an edit because backend upserts by name
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
          {!!defaultValues?.name && (
            <p className="text-xs text-muted-foreground mt-1">Role name cannot be changed once created.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            {...form.register("description")}
            className="w-full bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Describe the responsibilities of this role"
            rows={4}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Role"}
        </Button>
      </div>
    </form>
  );
};
