import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useRole, usePermissions, useUpdateRole } from "../hooks";
import { buildPermissionTreeFromRegistry } from "../utils/permissionUtils";
import { PermissionTree } from "../components/roles/PermissionTree";
import { PermissionSearch } from "../components/roles/PermissionSearch";
import { PermissionSummary } from "../components/roles/PermissionSummary";
import { RoleForm } from "../components/roles/RoleForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save, X, Edit, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export const RoleDetailsPage = () => {
  const { roleId } = useParams({ from: "/dashboard-layout/settings/roles/$roleId" as any });
  const navigate = useNavigate();
  
  const { data: role, isLoading: roleLoading, isError: roleIsError, error: roleError } = useRole(roleId);
  const { data: permissionsRegistry, isLoading: permsLoading } = usePermissions();
  const updateRole = useUpdateRole();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Initialize selected permissions
  useEffect(() => {
    if (role?.permissions && !isDirty) {
      setSelectedPermissions(new Set(role.permissions));
    }
  }, [role, isDirty]);

  // Handle BeforeUnload for dirty state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const tree = useMemo(() => {
    if (!permissionsRegistry?.data) return {};
    return buildPermissionTreeFromRegistry(permissionsRegistry.data);
  }, [permissionsRegistry]);

  const totalPermissions = useMemo(() => {
    let count = 0;
    Object.values(tree).forEach(mod => {
      Object.values(mod.children || {}).forEach(res => {
        count += Object.keys(res.children || {}).length;
      });
    });
    return count;
  }, [tree]);

  const handlePermissionsChange = (newSet: Set<string>) => {
    setSelectedPermissions(newSet);
    setIsDirty(true);
  };

  const savePermissions = () => {
    updateRole.mutate(
      {
        id: roleId,
        data: {
          permissions: Array.from(selectedPermissions),
        },
      },
      {
        onSuccess: () => {
          setIsDirty(false);
        },
      }
    );
  };

  if (roleLoading || permsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (roleIsError || !role) {
    return (
      <div className="border rounded-xl bg-destructive/10 p-6 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="h-10 w-10 text-destructive mb-2" />
        <p className="font-medium text-destructive">Failed to load role</p>
        <p className="text-sm text-destructive/80 mt-1">{(roleError as Error)?.message || "Role not found"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate({ to: "/settings/roles" })}>
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/settings/roles" })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Role: {role.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Created on {format(new Date(role.createdAt), "PPP")} • {role.users?.length || 0} Users Assigned
          </p>
        </div>
      </div>

      {/* Role Information Section */}
      <div className="border rounded-xl bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Role Information</h2>
          {!isEditingInfo && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Info
            </Button>
          )}
        </div>

        {isEditingInfo ? (
          <RoleForm
            defaultValues={{ name: role.name, description: role.description || "" }}
            onSubmit={(data) => {
              updateRole.mutate(
                { id: role.id, data: { description: data.description } },
                { onSuccess: () => setIsEditingInfo(false) }
              );
            }}
            isSubmitting={updateRole.isPending}
            onCancel={() => setIsEditingInfo(false)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="mt-1 font-medium">{role.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="mt-1 text-muted-foreground">{role.description || "No description provided."}</p>
            </div>
          </div>
        )}
      </div>

      {/* Permissions Management Section */}
      <div className="border rounded-xl bg-card shadow-sm flex flex-col">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Permissions Assignment</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select the modules, resources, and actions this role can perform.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isDirty && (
                <span className="text-sm font-medium text-amber-500 mr-2 animate-pulse">
                  Unsaved changes
                </span>
              )}
              {isDirty && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPermissions(new Set(role.permissions));
                    setIsDirty(false);
                  }}
                  disabled={updateRole.isPending}
                >
                  <X className="mr-2 h-4 w-4" /> Discard
                </Button>
              )}
              <Button 
                onClick={savePermissions} 
                disabled={!isDirty || updateRole.isPending}
              >
                {updateRole.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Permissions
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
            <PermissionSearch value={searchQuery} onChange={setSearchQuery} />
            <div className="flex-1" />
            <PermissionSummary total={totalPermissions} selected={selectedPermissions.size} />
          </div>
        </div>

        <div className="p-6">
          <PermissionTree
            tree={tree}
            selectedPermissions={selectedPermissions}
            onChange={handlePermissionsChange}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};
