import { useInvoices, useInvoiceMetrics } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceRecord } from "../types";
import { format } from "date-fns";
import {
  Plus, Download, Printer,
  Receipt, Wallet, CalendarX, FileSpreadsheet, Eye, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";

const invoiceColumns: ColumnDef<InvoiceRecord>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
    cell: ({ row }) => (
      <Link
        to="/invoices/$invoiceId"
        params={{ invoiceId: row.original.id }}
        className="text-sm font-mono font-medium hover:text-primary transition-colors hover:underline"
      >
        {row.original.invoiceNumber}
      </Link>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.customerName}</span>,
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.invoiceDate), 'dd MMM yyyy')}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        'Paid': "bg-emerald-500/10 text-emerald-500",
        'Unpaid': "bg-destructive/10 text-destructive",
        'Partial': "bg-blue-500/10 text-blue-500",
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
    accessorKey: "grandTotal",
    header: "Invoice Total",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.grandTotal)}</span>,
  },
  {
    accessorKey: "outstandingAmount",
    header: "Balance Due",
    cell: ({ row }) => {
      const due = row.original.outstandingAmount;
      return (
        <span className={`text-sm font-medium ${due > 0 ? "text-destructive" : "text-emerald-500"}`}>
          {due > 0 ? formatCurrency(due) : "Paid"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Link to="/invoices/$invoiceId" params={{ invoiceId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Invoice">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/invoices/$invoiceId/edit" params={{ invoiceId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit Invoice">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function InvoicePage() {
  const { data: invoices, isLoading } = useInvoices();
  const { data: metrics } = useInvoiceMetrics();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading invoice ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Invoices"
        description="Manage customer billing, tax invoices, and payment collections."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <Printer className="mr-2 h-4 w-4" />
              Bulk Print
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link to="/invoices/new">
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </Link>
          </div>
        }
      />

      {metrics && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Invoices (Mtd)"
            value={metrics.invoicesThisMonth.toString()}
            icon={<FileSpreadsheet className="h-4 w-4" />}
          />
          <StatsCard
            title="Outstanding Collection"
            value={formatCurrency(metrics.outstandingAmount)}
            icon={<Wallet className="h-4 w-4" />}
            className="border-amber-500/20 bg-amber-500/5"
          />
          <StatsCard
            title="Overdue Invoices"
            value={metrics.overdueInvoices.toString()}
            icon={<CalendarX className="h-4 w-4" />}
            className="border-destructive/20 bg-destructive/5"
          />
          <StatsCard
            title="GST Collected (Mtd)"
            value={formatCurrency(metrics.gstCollected)}
            icon={<Receipt className="h-4 w-4" />}
            className="border-blue-500/20 bg-blue-500/5"
          />
        </div>
      )}

      {invoices && invoices.length > 0 ? (
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          searchKey="invoiceNumber"
        />
      ) : (
        <EmptyState
          title="No Invoices"
          description="Generate your first invoice from a completed sale."
          icon={<Receipt />}
          actionLabel="Generate Invoice"
          onAction={() => window.location.href = '/invoices/new'}
        />
      )}
    </div>
  );
}
