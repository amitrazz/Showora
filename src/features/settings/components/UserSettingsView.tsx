import { useUsers } from "../hooks";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";

export const UserSettingsView = () => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>Loading Users...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Users & Teams</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage staff access, roles, and branch assignments.</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </div>
      
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Branch Access</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-xs">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">{user.role}</td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{user.branch}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
