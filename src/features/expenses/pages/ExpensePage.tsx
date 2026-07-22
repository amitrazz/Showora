import { useExpenses, useExpenseMetrics, useImportExpenses } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { ExpenseRecord } from "../types";
import { format } from "date-fns";
import {
  Plus, Download, Upload,
  Wallet, TrendingUp, AlertCircle, AlertTriangle, FileText, Eye, Pencil, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";
import { useState, useRef } from "react";
import { expenseService } from "../services";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const expenseColumns: ColumnDef<ExpenseRecord>[] = [
  {
    accessorKey: "expenseId",
    header: "Expense ID",
    cell: ({ row }) => (
      <Link
        to="/expenses/$expenseId"
        params={{ expenseId: row.original.id }}
        className="text-sm font-mono font-medium hover:text-primary transition-colors hover:underline"
      >
        #{row.original.id.substring(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Expense Details",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{expense.title}</span>
          <span className="text-xs text-muted-foreground">{expense.category} • {expense.vendor}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "expenseDate",
    header: "Date",
    cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.expenseDate), 'dd MMM yyyy')}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        'Paid': "bg-emerald-500/10 text-emerald-500",
        'Partial': "bg-blue-500/10 text-blue-500",
        'Unpaid': "bg-destructive/10 text-destructive",
        'Draft': "bg-muted text-muted-foreground",
        'Void': "bg-muted text-muted-foreground line-through",
      };
      return (
        <Badge variant="outline" className={`border-transparent whitespace-nowrap ${variants[status] || "bg-muted"}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const variants: Record<string, string> = {
        'Pending': "bg-amber-500/10 text-amber-500 border-transparent",
        'Partially Paid': "bg-blue-500/10 text-blue-500 border-transparent",
        'Paid': "bg-emerald-500/10 text-emerald-500 border-transparent",
        'Overdue': "bg-destructive/10 text-destructive border-transparent",
      };
      return (
        <Badge variant="outline" className={`whitespace-nowrap ${variants[status] || "bg-muted"}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Link to="/expenses/$expenseId" params={{ expenseId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Expense">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/expenses/$expenseId/edit" params={{ expenseId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit Expense">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function ExpensePage() {
  const { data: expenses, isLoading } = useExpenses();
  const { data: metrics } = useExpenseMetrics();
  const importMutation = useImportExpenses();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const toastId = toast.loading('Exporting expenses...');
      const blob = await expenseService.exportExpenses();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success('Expenses exported successfully');
    } catch (error: any) {
      toast.error('Failed to export expenses', {
        description: error.message || 'An error occurred during export.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input
    event.target.value = '';

    const toastId = toast.loading('Uploading and importing expenses...');
    importMutation.mutate(file, {
      onSuccess: (result) => {
        toast.dismiss(toastId);
        if (result.errors && result.errors.length > 0) {
          setImportErrors(result.errors);
          setIsErrorModalOpen(true);
        }
      },
      onError: () => {
        toast.dismiss(toastId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading expense ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <PageHeader
        title="Expense Management"
        description="Track operational expenses, reimburse employees, and monitor budgets."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex shadow-sm"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex shadow-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {importMutation.isPending ? 'Importing...' : 'Import'}
            </Button>
            <Link to="/expenses/new">
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Record Expense
              </Button>
            </Link>
          </div>
        }
      />

      {metrics && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Monthly Spend (MTD)"
            value={formatCurrency(metrics.monthlyExpenses)}
            icon={<Wallet className="h-4 w-4" />}
            className="border-primary/20 bg-primary/5"
          />
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Budget Utilization</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-semibold font-mono">{metrics.budgetUtilization.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">of {formatCurrency(metrics.monthlyBudget)}</div>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(metrics.budgetUtilization, 100)}%` }} />
              </div>
            </div>
          </div>
          <StatsCard
            title="Pending Approval"
            value={metrics.pendingApproval.toString()}
            icon={<AlertCircle className="h-4 w-4" />}
            className="border-amber-500/20 bg-amber-500/5"
          />
          <StatsCard
            title="Pending Payment"
            value={formatCurrency(metrics.pendingPaymentAmount)}
            icon={<FileText className="h-4 w-4" />}
            className="border-destructive/20 bg-destructive/5"
          />
        </div>
      )}

      {expenses && expenses.length > 0 ? (
        <DataTable
          columns={expenseColumns}
          data={expenses}
          searchKey="vendor"
        />
      ) : (
        <EmptyState
          title="No Expenses Recorded"
          description="Record your first operational expense or bill."
          icon={<Wallet />}
          actionLabel="Record Expense"
          onAction={() => window.location.href = '/expenses/new'}
        />
      )}

      <Dialog open={isErrorModalOpen}>
        <DialogContent className="max-w-2xl bg-card border border-border p-6 rounded-xl shadow-premium">
          <div className="flex justify-between items-center pb-4 border-b border-border/80">
            <div className="flex items-center gap-2 text-destructive font-semibold">
              <AlertTriangle className="h-5 w-5" />
              <h3>Import Verification Logs</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsErrorModalOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-2">
            <p className="text-sm text-muted-foreground mb-3">
              The following rows encountered issues and were not imported. Please review and update your CSV file:
            </p>
            {importErrors.map((err, idx) => (
              <div key={idx} className="p-3 bg-destructive/5 text-destructive border border-destructive/10 rounded-lg text-sm font-mono">
                {err}
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-border/80 mt-4">
            <Button onClick={() => setIsErrorModalOpen(false)}>Dismiss</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
