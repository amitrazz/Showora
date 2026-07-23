import { usePurchases, usePurchaseMetrics } from "../hooks";
import { SkeletonTable, SkeletonStatsCard } from "@/components/ui/skeleton/SkeletonTemplates";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { PurchaseOrder } from "../types";
import { format } from "date-fns";
import {
  Plus, Download, Upload,
  PackageOpen, Truck, ClipboardList, Wallet, Eye, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";
import { useRef } from "react";
import { toast } from "sonner";

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
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Link to="/purchases/$purchaseId" params={{ purchaseId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View PO">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/purchases/$purchaseId/edit" params={{ purchaseId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit PO">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function PurchasePage() {
  const { data: purchases, isLoading } = usePurchases();
  const { data: metrics } = usePurchaseMetrics();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    toast.success("Purchase Order records exported to CSV");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Importing Purchase Orders from ${file.name}`);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input type="file" ref={fileInputRef} accept=".csv" className="hidden" onChange={handleFileChange} />
      <PageHeader
        title="Purchase Orders"
        description="Manage procurement, suppliers, deliveries, and inventory receipts."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm" onClick={handleImportClick}>
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

      {metrics ? (
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
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <SkeletonStatsCard />
          <SkeletonStatsCard />
          <SkeletonStatsCard />
          <SkeletonStatsCard />
        </div>
      )}

      {isLoading ? (
        <SkeletonTable />
      ) : purchases && purchases.length > 0 ? (
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
          onAction={() => navigate({ to: '/purchases/new' })}
        />
      )}
    </div>
  );
}
