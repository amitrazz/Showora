import { useExpenses, useExpenseMetrics } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { ExpenseRecord } from "../types";
import { format } from "date-fns";
import {
  Plus, Download, CheckSquare, MoreHorizontal,
  Wallet, TrendingUp, Clock, AlertCircle, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";

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
        {row.original.expenseId}
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Expense Details",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="text-sm font-medium truncate" title={row.original.title}>{row.original.title}</span>
        <span className="text-xs text-muted-foreground">{row.original.vendor}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-normal">{row.original.category}</Badge>
        {row.original.isRecurring && <div title="Recurring Expense"><Clock className="h-3 w-3 text-blue-500" /></div>}
      </div>
    ),
  },
  {
    accessorKey: "expenseDate",
    header: "Date",
    cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.expenseDate), 'dd MMM yyyy')}</span>,
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => <span className="text-sm font-medium font-mono">{formatCurrency(row.original.totalAmount)}</span>,
  },
  {
    accessorKey: "status",
    header: "Approval",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        'Draft': "bg-muted text-muted-foreground",
        'Submitted': "bg-amber-500/10 text-amber-500",
        'Approved': "bg-emerald-500/10 text-emerald-500",
        'Rejected': "bg-destructive/10 text-destructive",
        'Paid': "bg-blue-500/10 text-blue-500",
        'Cancelled': "bg-slate-500/10 text-slate-500",
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
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

export function ExpensePage() {
  const { data: expenses, isLoading } = useExpenses();
  const { data: metrics } = useExpenseMetrics();

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
      <PageHeader
        title="Expense Management"
        description="Track operational expenses, reimburse employees, and monitor budgets."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              Bulk Approve
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
    </div>
  );
}
