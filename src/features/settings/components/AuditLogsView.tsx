import { useAuditLogs } from "../hooks";
import { format } from "date-fns";
import { Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AuditLogsView = () => {
  const { data: logs, isLoading } = useAuditLogs();

  if (isLoading) return <div>Loading Audit Logs...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Audit Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">Immutable record of all system configurations and events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search logs..." className="w-64 h-9" />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>
      
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Timestamp</th>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Module</th>
              <th className="px-6 py-3 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs?.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{log.user}</td>
                <td className="px-6 py-4">{log.action}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-muted text-xs font-mono">{log.module}</span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
