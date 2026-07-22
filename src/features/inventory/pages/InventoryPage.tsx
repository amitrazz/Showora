import { useInventory, useInventoryMetrics, useImportInventory } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatPaise } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryVehicle } from "../types";
import { Package, Plus, Download, Upload, Truck, Clock, AlertTriangle, ShieldCheck, IndianRupee, Eye, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";
import { useRef, useState } from "react";
import { inventoryService } from "../services";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";


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
    cell: ({ row }) => <span className="text-sm font-medium">{formatPaise(row.original.purchaseCost)}</span>,
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ row }) => <span className="text-sm">{formatPaise(row.original.sellingPrice)}</span>,
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
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Link to="/inventory/$inventoryId" params={{ inventoryId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View vehicle">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/inventory/$inventoryId/edit" params={{ inventoryId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit vehicle">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function InventoryPage() {
  const { data: inventory, isLoading } = useInventory();
  const { data: metrics } = useInventoryMetrics();
  const importMutation = useImportInventory();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const toastId = toast.loading('Exporting inventory...');
      const blob = await inventoryService.exportInventory();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success('Inventory exported successfully');
    } catch (error: any) {
      toast.error('Failed to export inventory', {
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

    const toastId = toast.loading('Uploading and importing inventory...');
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
          <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
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
        title="Inventory"
        description="Manage showroom vehicle inventory and stock movement."
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
            value={formatPaise(metrics.inventoryValue)}
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
