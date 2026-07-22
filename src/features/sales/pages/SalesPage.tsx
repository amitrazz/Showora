import { useSales, useSalesMetrics } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { SalesRecord } from "../types";
import {
  Plus, Download, Upload,
  IndianRupee, TrendingUp, HandCoins, Truck, Eye, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";

const salesColumns: ColumnDef<SalesRecord>[] = [
  {
    accessorKey: "id",
    header: "Sale ID / Invoice",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Link
          to="/sales/$saleId"
          params={{ saleId: row.original.id }}
          className="text-sm font-mono font-medium hover:text-primary transition-colors hover:underline"
        >
          #{row.original.id.substring(0, 8)}
        </Link>
        <span className="text-xs text-muted-foreground font-mono">{row.original.invoiceNumber || 'No Invoice'}</span>
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <div className="flex flex-col">
          <Link
            to="/customers/$customerId"
            params={{ customerId: sale.customerId }}
            className="text-sm font-medium hover:text-primary transition-colors hover:underline"
          >
            {sale.customerName}
          </Link>
          <span className="text-xs text-muted-foreground">{sale.customerPhone}</span>
        </div>
      );
    },
  },
  {
    id: "vehicle",
    accessorFn: (row) => `${row.vehicleMake} ${row.vehicleModel} ${row.vehicleVariant}`,
    header: "Vehicle",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{sale.vehicleMake} {sale.vehicleModel}</span>
          <span className="text-xs text-muted-foreground font-mono">{sale.vin}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        'Draft': "bg-muted text-muted-foreground",
        'Quotation': "bg-muted text-muted-foreground",
        'Reserved': "bg-blue-500/10 text-blue-500",
        'Payment Pending': "bg-amber-500/10 text-amber-500",
        'Finance Processing': "bg-orange-500/10 text-orange-500",
        'Ready For Delivery': "bg-emerald-500/10 text-emerald-500",
        'Delivered': "bg-purple-500/10 text-purple-500",
        'Cancelled': "bg-destructive/10 text-destructive",
        'Refunded': "bg-destructive/10 text-destructive",
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
    header: "Total",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.grandTotal)}</span>,
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding",
    cell: ({ row }) => {
      const amount = row.original.outstandingBalance;
      return (
        <span className={`text-sm font-medium ${amount > 0 ? "text-destructive" : "text-emerald-500"}`}>
          {amount > 0 ? formatCurrency(amount) : "Settled"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Link to="/sales/$saleId" params={{ saleId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View deal">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/sales/$saleId/edit" params={{ saleId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit deal">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function SalesPage() {
  const { data: sales, isLoading } = useSales();
  const { data: metrics } = useSalesMetrics();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading sales ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Sales"
        description="Manage vehicle sales, payments, delivery, and finance."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Link to="/sales/new">
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                New Sale
              </Button>
            </Link>
          </div>
        }
      />

      {metrics && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Monthly Revenue"
            value={formatCurrency(metrics.monthlyRevenue)}
            icon={<TrendingUp className="h-4 w-4" />}
            className="border-emerald-500/20 bg-emerald-500/5"
          />
          <StatsCard
            title="Units Sold"
            value={metrics.unitsSold.toString()}
            icon={<Truck className="h-4 w-4" />}
          />
          <StatsCard
            title="Pending Payments"
            value={metrics.pendingPayments.toString()}
            icon={<HandCoins className="h-4 w-4" />}
            className="border-amber-500/20 bg-amber-500/5"
          />
          <StatsCard
            title="Avg Deal Value"
            value={formatCurrency(metrics.averageDealValue)}
            icon={<IndianRupee className="h-4 w-4" />}
            className="bg-gradient-to-br from-card to-card/50"
          />
        </div>
      )}

      {sales && sales.length > 0 ? (
        <DataTable
          columns={salesColumns}
          data={sales}
          searchKey="invoiceNumber"
        />
      ) : (
        <EmptyState
          title="No Sales Yet"
          description="Create your first sale to start tracking revenue."
          icon={<IndianRupee />}
          actionLabel="New Sale"
          onAction={() => window.location.href = '/sales/new'}
        />
      )}
    </div>
  );
}
