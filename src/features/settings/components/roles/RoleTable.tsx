import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Role } from "../../types";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export const RoleTable = ({ 
  roles, 
  onDelete 
}: { 
  roles: Role[]; 
  onDelete: (id: string) => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles..."
            className="w-full bg-background border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Role Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-center">Permissions</th>
                <th className="px-6 py-3 font-medium text-center">Users</th>
                <th className="px-6 py-3 font-medium">Last Updated</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-primary hover:underline cursor-pointer">
                      <Link to="/settings/roles/$roleId" params={{ roleId: role.id }}>{role.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                      {role.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                        {role.permissions?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {role.userCount || 0}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(role.updatedAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" type="button">
                          <Link to="/settings/roles/$roleId" params={{ roleId: role.id }} className="flex h-full w-full items-center justify-center">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the role ${role.name}?`)) {
                              onDelete(role.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
