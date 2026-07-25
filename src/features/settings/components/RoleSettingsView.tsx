import { useState, useEffect } from "react";
import { CheckSquare, Square, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermissions, useRoles, useUpdateRole } from "../hooks";
import { useNavigate } from "@tanstack/react-router";

export const RoleSettingsView = () => {
  const navigate = useNavigate();
  const { data: permissionsData, isLoading: permsLoading } = usePermissions('showora');
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const updateRole = useUpdateRole();
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  useEffect(() => {
    if (rolesData && rolesData.length > 0 && !selectedRoleId) {
      setSelectedRoleId(rolesData[0].id);
    }
  }, [rolesData, selectedRoleId]);

  useEffect(() => {
    if (selectedRoleId && rolesData) {
      const role = rolesData.find(r => r.id === selectedRoleId);
      if (role) {
        setSelectedPerms(new Set(role.permissions));
      }
    }
  }, [selectedRoleId, rolesData]);

  if (permsLoading || rolesLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const showoraPermissions = permissionsData?.data?.SHOWORA || permissionsData?.SHOWORA || {};
  const modules = Object.keys(showoraPermissions);

  const allActions = new Set<string>();
  modules.forEach((mod) => {
    Object.keys(showoraPermissions[mod]).forEach((action) => {
      allActions.add(action);
    });
  });

  const orderedActions = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT', 'TRANSFER', 'RECEIVE'];
  const actionColumns = Array.from(allActions).sort((a, b) => {
    const indexA = orderedActions.indexOf(a);
    const indexB = orderedActions.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const togglePerm = (permStr: string) => {
    if (!selectedRoleId) return;
    
    const newSet = new Set(selectedPerms);
    if (newSet.has(permStr)) {
      newSet.delete(permStr);
    } else {
      newSet.add(permStr);
    }
    setSelectedPerms(newSet);
    
    // Auto-save
    updateRole.mutate({
      id: selectedRoleId,
      data: {
        permissions: Array.from(newSet)
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure granular access controls across the organization.</p>
        </div>
        <Button size="sm" onClick={() => navigate({ to: "/settings/roles" })}>
          Manage Advanced Roles
        </Button>
      </div>
      
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="bg-muted p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Role:</h3>
            <select 
              className="bg-background border rounded-md px-3 py-1 text-sm font-medium"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <option value="" disabled>Select a role</option>
              {rolesData?.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> Auto-saves on change
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Module</th>
                {actionColumns.map((action) => (
                  <th key={action} className="px-6 py-3 font-medium text-center capitalize">
                    {action.toLowerCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {modules.map((mod) => (
                <tr key={mod} className="hover:bg-muted/10">
                  <td className="px-6 py-4 font-medium capitalize">{mod.toLowerCase()}</td>
                  {actionColumns.map((action) => {
                    const permStr = showoraPermissions[mod][action];
                    const isAvailable = !!permStr;
                    const isSelected = selectedPerms.has(permStr);

                    return (
                      <td key={action} className="px-6 py-4 text-center">
                        {isAvailable ? (
                          isSelected ? (
                            <CheckSquare 
                              className="h-5 w-5 text-primary mx-auto cursor-pointer" 
                              onClick={() => togglePerm(permStr)}
                            />
                          ) : (
                            <Square 
                              className="h-5 w-5 text-muted-foreground mx-auto cursor-pointer"
                              onClick={() => togglePerm(permStr)}
                            />
                          )
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
