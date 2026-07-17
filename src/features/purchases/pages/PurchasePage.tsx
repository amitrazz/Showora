import { usePurchases, usePurchaseMetrics } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { PurchaseOrder } from "../types";
import { format } from "date-fns";
import { 
  Plus, Download, Upload, MoreHorizontal, 
  PackageOpen, Truck, ClipboardList, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";

const purchaseColumns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => (
      <Link 
        to="/purchases/$purchaseId" 
        params={{ purchaseId: row.original.id }}
        className="text-sm font-mono font-medium hover:text-primary transition-colors hover:underline"
      >
        {row.original.poNumber}
      </Link>
    ),
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.supplierName}</span>,
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.orderDate), 'dd MMM yyyy')}</span>,
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const totalOrdered = row.original.items.reduce((sum, item) => sum + item.quantityOrdered, 0);
      const totalReceived = row.original.items.reduce((sum, item) => sum + item.quantityReceived, 0);
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{totalOrdered} Units</span>
          <span className="text-xs text-muted-foreground">{totalReceived} Received</span>
        </div>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        'Draft': "bg-muted text-muted-foreground",
        'Pending Approval': "bg-amber-500/10 text-amber-500",
        'Approved': "bg-blue-500/10 text-blue-500",
        'Ordered': "bg-blue-500/10 text-blue-500",
        'Partially Received': "bg-purple-500/10 text-purple-500",
        'Received': "bg-emerald-500/10 text-emerald-500",
        'Closed': "bg-slate-500/10 text-slate-500",
        'Cancelled': "bg-destructive/10 text-destructive",
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
    header: "Purchase Value",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.grandTotal)}</span>,
  },
  {
    accessorKey: "outstandingAmount",
    header: "Outstanding",
    cell: ({ row }) => {
      const amount = row.original.outstandingAmount;
      return (
        <span className={`text-sm font-medium ${amount > 0 ? "text-destructive" : "text-emerald-500"}`}>
          {amount > 0 ? formatCurrency(amount) : "Paid"}
        </span>
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

export function PurchasePage() {
  const { data: purchases, isLoading } = usePurchases();
  const { data: metrics } = usePurchaseMetrics();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading procurement ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Purchase Orders" 
        description="Manage procurement, suppliers, deliveries, and inventory receipts."
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
            <Link to="/purchases/new">
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                New Purchase Order
              </Button>
            </Link>
          </div>
        }
      />

      {metrics && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total POs"
            value={metrics.totalOrders.toString()}
            icon={<ClipboardList className="h-4 w-4" />}
          />
          <StatsCard
            title="Pending Deliveries"
            value={metrics.pendingDeliveries.toString()}
            icon={<Truck className="h-4 w-4" />}
            className="border-amber-500/20 bg-amber-500/5"
          />
          <StatsCard
            title="Outstanding Payments"
            value={formatCurrency(metrics.outstandingPayments)}
            icon={<Wallet className="h-4 w-4" />}
            className="border-destructive/20 bg-destructive/5"
          />
          <StatsCard
            title="Inventory Added (Mtd)"
            value={metrics.inventoryAdded.toString()}
            icon={<PackageOpen className="h-4 w-4" />}
            className="border-emerald-500/20 bg-emerald-500/5"
          />
        </div>
      )}

      {purchases && purchases.length > 0 ? (
        <DataTable 
          columns={purchaseColumns} 
          data={purchases} 
          searchKey="poNumber" 
        />
      ) : (
        <EmptyState 
          title="No Purchase Orders"
          description="Create your first Purchase Order to restock inventory."
          icon={<ClipboardList />}
          actionLabel="New PO"
          onAction={() => window.location.href = '/purchases/new'}
        />
      )}
    </div>
  );
}
