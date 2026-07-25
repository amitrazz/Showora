import { useNavigate } from "@tanstack/react-router";
import { RoleForm } from "../components/roles/RoleForm";
import { useCreateRole } from "../hooks";

export const CreateRolePage = () => {
  const navigate = useNavigate();
  const createRole = useCreateRole();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create Custom Role</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define a new role before assigning granular permissions.
        </p>
      </div>

      <div className="border rounded-xl bg-card p-6 shadow-sm">
        <RoleForm
          onSubmit={(data) => {
            createRole.mutate(data, {
              onSuccess: (newRole) => {
                navigate({ to: `/settings/roles/$roleId`, params: { roleId: newRole.id } });
              }
            });
          }}
          isSubmitting={createRole.isPending}
          onCancel={() => navigate({ to: "/settings/roles" })}
        />
      </div>
    </div>
  );
};
