import { useBranches } from "../hooks";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, MoreHorizontal } from "lucide-react";

export const BranchSettingsView = () => {
  const { data: branches, isLoading } = useBranches();

  if (isLoading) return <div>Loading Branches...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Branches</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage multiple showroom locations and their managers.</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Branch
        </Button>
      </div>
      
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Branch Name</th>
              <th className="px-6 py-3 font-medium">Manager</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {branches?.map((branch) => (
              <tr key={branch.id} className="hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{branch.name}</p>
                      <p className="text-xs text-muted-foreground max-w-[150px] truncate">{branch.address}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{branch.manager}</td>
                <td className="px-6 py-4">
                  <p className="text-xs">{branch.email}</p>
                  <p className="text-xs text-muted-foreground">{branch.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    branch.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {branch.status}
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
