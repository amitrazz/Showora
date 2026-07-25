import { Plus, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useRoles, useDeleteRole } from "../hooks";
import { RoleTable } from "../components/roles/RoleTable";

export const RoleListPage = () => {
  const navigate = useNavigate();
  const { data: roles, isLoading, isError, error } = useRoles();
  const deleteRole = useDeleteRole();

  const handleDelete = (id: string) => {
    deleteRole.mutate(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Role Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user roles and assign precise permissions.
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/settings/roles/new" })}>
          <Plus className="mr-2 h-4 w-4" /> Create Role
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="border rounded-xl bg-destructive/10 p-6 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="h-10 w-10 text-destructive mb-2" />
          <p className="font-medium text-destructive">Failed to load roles</p>
          <p className="text-sm text-destructive/80 mt-1">{(error as Error)?.message}</p>
        </div>
      ) : (
        <RoleTable roles={roles || []} onDelete={handleDelete} />
      )}
    </div>
  );
};
