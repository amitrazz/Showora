import { useCustomers, useCustomerMetrics, useImportCustomers } from "../hooks";
import { useSales } from "../../sales/hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "../types";
import { Users, UserPlus, IndianRupee, HandCoins, Plus, Download, Upload, Eye, Pencil, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";
import { useState, useRef } from "react";
import { customerService } from "../services";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const customerColumns: ColumnDef<Customer>[] = [
  {
    id: "name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">{customer.firstName[0]}{customer.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link
              to="/customers/$customerId"
              params={{ customerId: customer.id }}
              className="font-medium hover:text-primary transition-colors hover:underline"
            >
              {customer.firstName} {customer.lastName}
            </Link>
            <span className="text-xs text-muted-foreground">{customer.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm">{row.original.phone}</span>,
  },
  {
    accessorKey: "address.city",
    header: "City",
    cell: ({ row }) => <span className="text-sm">{row.original.address.city}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        active: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
        inactive: "bg-muted text-muted-foreground hover:bg-muted/80",
        lead: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
      };
      return (
        <Badge variant="outline" className={`border-transparent ${variants[status] || ""}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "outstandingAmount",
    header: "Outstanding",
    cell: ({ row }) => {
      const amount = row.original.outstandingAmount;
      return (
        <span className={`text-sm font-medium ${amount > 0 ? "text-destructive" : ""}`}>
          {amount > 0 ? formatCurrency(amount) : "₹0"}
        </span>
      );
    },
  },
  {
    accessorKey: "totalPurchases",
    header: "Purchases",
    cell: ({ row }) => <span className="text-sm">{row.original.totalPurchases}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Link to="/customers/$customerId" params={{ customerId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View customer">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/customers/$customerId/edit" params={{ customerId: row.original.id }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit customer">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function CustomersPage() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [previousCursors, setPreviousCursors] = useState<(string | undefined)[]>([]);
  const { data: customerPage, isLoading } = useCustomers({ cursor, limit: 10 });
  const { data: metrics } = useCustomerMetrics();
  const { data: salesList } = useSales();

  const importMutation = useImportCustomers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const toastId = toast.loading('Exporting customers...');
      const blob = await customerService.exportCustomers();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success('Customers exported successfully');
    } catch (error: any) {
      toast.error('Failed to export customers', {
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

    const toastId = toast.loading('Uploading and importing customers...');
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

  const rawCustomers = customerPage?.data ?? [];
  const customers = rawCustomers.map((customer) => {
    const customerSales = salesList?.filter(sale => sale.customerId === customer.id) || [];
    const totalPurchasesCount = customerSales.length || customer.totalPurchases || 0;
    const computedLtv = customerSales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0) || customer.lifetimeValue || 0;
    const computedOutstanding = customerSales.reduce((sum, sale) => sum + (sale.outstandingBalance || 0), 0) || customer.outstandingAmount || 0;
    return {
      ...customer,
      totalPurchases: totalPurchasesCount,
      lifetimeValue: computedLtv,
      outstandingAmount: computedOutstanding,
    };
  });
  const totalOutstandingSales = salesList?.reduce((sum, sale) => sum + (sale.outstandingBalance || 0), 0) ?? metrics?.outstandingAmount ?? 0;
  const totalLtvRevenue = salesList?.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0) ?? metrics?.totalRevenue ?? 0;
  const currentPageIndex = previousCursors.length;

  const goToNextPage = () => {
    if (!customerPage?.nextCursor) return;
    setPreviousCursors((history) => [...history, cursor]);
    setCursor(customerPage.nextCursor);
  };

  const goToPreviousPage = () => {
    const previousCursor = previousCursors[previousCursors.length - 1];
    setPreviousCursors((history) => history.slice(0, -1));
    setCursor(previousCursor);
  };

  if (isLoading && !customerPage) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading customers...</p>
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
        title="Customers"
        description="Manage customers, purchase history, finance, and showroom relationships."
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
            <Link to="/customers/new">
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </div>
        }
      />

      {metrics && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Customers"
            value={metrics.totalCustomers.toString()}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="New This Month"
            value={metrics.newThisMonth.toString()}
            icon={<UserPlus className="h-4 w-4" />}
          />
          <StatsCard
            title="Outstanding Amount"
            value={formatCurrency(totalOutstandingSales)}
            icon={<HandCoins className="h-4 w-4" />}
            className="border-destructive/20 bg-destructive/5"
          />
          <StatsCard
            title="Total LTV Revenue"
            value={formatCurrency(totalLtvRevenue)}
            icon={<IndianRupee className="h-4 w-4" />}
            className="bg-gradient-to-br from-card to-card/50"
          />
        </div>
      )}

      {customers.length > 0 ? (
        <DataTable
          columns={customerColumns}
          data={customers}
          searchKey="firstName"
          serverPagination={{
            pageIndex: currentPageIndex,
            pageSize: customerPage?.limit ?? 10,
            totalCount: customerPage?.totalCount ?? 0,
            canPreviousPage: previousCursors.length > 0,
            canNextPage: customerPage?.hasMore ?? false,
            onPreviousPage: goToPreviousPage,
            onNextPage: goToNextPage,
          }}
        />
      ) : (
        <EmptyState
          title="No Customers Yet"
          description="Get started by creating your first customer profile."
          icon={<Users />}
          actionLabel="Add Customer"
          onAction={() => window.location.href = '/customers/new'}
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
