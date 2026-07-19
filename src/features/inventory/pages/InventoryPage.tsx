import { useInventory, useInventoryMetrics } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryVehicle } from "../types";
import { Package, Plus, Download, Upload, MoreHorizontal, Truck, Clock, AlertTriangle, ShieldCheck, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";


const inventoryColumns: ColumnDef<InventoryVehicle>[] = [
  {
    id: "vehicle",
    accessorFn: (row) => `${row.make} ${row.model} ${row.variant}`,
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0 border border-border/50">
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <Link
              to="/inventory/$inventoryId"
              params={{ inventoryId: vehicle.id }}
              className="font-medium hover:text-primary transition-colors hover:underline text-sm"
            >
              {vehicle.make} {vehicle.model}
            </Link>
            <span className="text-xs text-muted-foreground">{vehicle.variant} • {vehicle.color}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "vin",
    header: "VIN",
    cell: ({ row }) => <span className="text-xs font-mono text-muted-foreground uppercase">{row.original.vin}</span>,
  },
  {
    accessorKey: "purchaseCost",
    header: "Cost",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.purchaseCost)}</span>,
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ row }) => <span className="text-sm">{formatCurrency(row.original.sellingPrice)}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        'Available': "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
        'Reserved': "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        'Allocated': "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        'Delivered': "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
        'In Transit': "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
        'Under Service': "bg-destructive/10 text-destructive hover:bg-destructive/20",
      };
      return (
        <Badge variant="outline" className={`border-transparent whitespace-nowrap ${variants[status] || "bg-muted"}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "daysInInventory",
    header: "Age",
    cell: ({ row }) => {
      const days = row.original.daysInInventory;
      return (
        <div className="flex items-center gap-1.5">
          <Clock className={`h-3 w-3 ${days > 90 ? 'text-destructive' : 'text-muted-foreground'}`} />
          <span className={`text-sm ${days > 90 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{days}d</span>
        </div>
      );
    }
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

export function InventoryPage() {
  const { data: inventory, isLoading } = useInventory();
  const { data: metrics } = useInventoryMetrics();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Inventory"
        description="Manage showroom vehicle inventory and stock movement."
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
            <Link to="/inventory/new">
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Receive Inventory
              </Button>
            </Link>
          </div>
        }
      />

      {metrics && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Vehicles"
            value={metrics.totalVehicles.toString()}
            icon={<Package className="h-4 w-4" />}
          />
          <StatsCard
            title="Available Stock"
            value={metrics.availableStock.toString()}
            icon={<ShieldCheck className="h-4 w-4" />}
            className="border-emerald-500/20 bg-emerald-500/5"
          />
          <StatsCard
            title="Low Stock Models"
            value={metrics.lowStockModels.toString()}
            icon={<AlertTriangle className="h-4 w-4" />}
            className="border-amber-500/20 bg-amber-500/5"
          />
          <StatsCard
            title="Inventory Value"
            value={formatCurrency(metrics.inventoryValue)}
            icon={<IndianRupee className="h-4 w-4" />}
            className="bg-gradient-to-br from-card to-card/50"
          />
        </div>
      )}

      {inventory && inventory.length > 0 ? (
        <DataTable
          columns={inventoryColumns}
          data={inventory}
          searchKey="vin"
        />
      ) : (
        <EmptyState
          title="No Inventory Yet"
          description="Get started by receiving your first vehicle into stock."
          icon={<Package />}
          actionLabel="Receive Inventory"
          onAction={() => window.location.href = '/inventory/new'}
        />
      )}
    </div>
  );
}
