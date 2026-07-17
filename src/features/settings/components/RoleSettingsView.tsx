import { CheckSquare, Square, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RoleSettingsView = () => {
  const modules = ['Customers', 'Inventory', 'Sales', 'Purchases', 'Invoices', 'Expenses', 'Reports', 'Settings'];
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure granular access controls across the organization.</p>
        </div>
        <Button size="sm">Create Custom Role</Button>
      </div>
      
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="bg-muted p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Role:</h3>
            <select className="bg-background border rounded-md px-3 py-1 text-sm font-medium">
              <option>Sales Executive</option>
              <option>Branch Manager</option>
              <option>Accountant</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> Auto-saves on change
          </p>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Module</th>
              <th className="px-6 py-3 font-medium text-center">View</th>
              <th className="px-6 py-3 font-medium text-center">Create</th>
              <th className="px-6 py-3 font-medium text-center">Edit</th>
              <th className="px-6 py-3 font-medium text-center">Delete</th>
              <th className="px-6 py-3 font-medium text-center">Approve</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {modules.map((mod, i) => (
              <tr key={i} className="hover:bg-muted/10">
                <td className="px-6 py-4 font-medium">{mod}</td>
                <td className="px-6 py-4 text-center">
                  <CheckSquare className="h-5 w-5 text-primary mx-auto cursor-pointer" />
                </td>
                <td className="px-6 py-4 text-center">
                   {['Reports', 'Settings'].includes(mod) ? <span className="text-muted-foreground">-</span> : <CheckSquare className="h-5 w-5 text-primary mx-auto cursor-pointer" />}
                </td>
                <td className="px-6 py-4 text-center">
                   {['Reports', 'Settings'].includes(mod) ? <span className="text-muted-foreground">-</span> : <Square className="h-5 w-5 text-muted-foreground mx-auto cursor-pointer" />}
                </td>
                <td className="px-6 py-4 text-center">
                   {['Reports', 'Settings'].includes(mod) ? <span className="text-muted-foreground">-</span> : <Square className="h-5 w-5 text-muted-foreground mx-auto cursor-pointer" />}
                </td>
                <td className="px-6 py-4 text-center">
                   {['Sales', 'Purchases', 'Expenses'].includes(mod) ? <Square className="h-5 w-5 text-muted-foreground mx-auto cursor-pointer" /> : <span className="text-muted-foreground">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
