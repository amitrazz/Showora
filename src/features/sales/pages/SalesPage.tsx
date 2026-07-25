import { useSales, useSalesMetrics, useImportSales } from "../hooks";
import { salesService } from "../services";
import { SkeletonTable, SkeletonStatsCard } from "@/components/ui/skeleton/SkeletonTemplates";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { SalesRecord } from "../types";
import {
  Plus, Download, Upload,
  IndianRupee, TrendingUp, HandCoins, Truck, Eye, Pencil, AlertTriangle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";
import { useRef, useState } from "react";
import { toast } from "sonner";

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
  const [cursor, setCursor] = useState<string | undefined>();
  const [previousCursors, setPreviousCursors] = useState<(string | undefined)[]>([]);
  const { data: salesResult, isLoading } = useSales({ cursor, limit: 10 });
  const { data: metrics } = useSalesMetrics();
  const importMutation = useImportSales();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const salesPage = Array.isArray(salesResult) ? null : salesResult;
  const sales = Array.isArray(salesResult)
    ? salesResult
    : (salesResult?.data ?? []);

  const currentPageIndex = previousCursors.length;

  const goToNextPage = () => {
    if (!salesPage?.nextCursor) return;
    setPreviousCursors((history) => [...history, cursor ?? ""]);
    setCursor(salesPage.nextCursor);
  };

  const goToPreviousPage = () => {
    const previousCursor = previousCursors[previousCursors.length - 1];
    setPreviousCursors((history) => history.slice(0, -1));
    setCursor(previousCursor || undefined);
  };

  const exportClientCSV = (salesData: SalesRecord[]) => {
    const headers = [
      'Sale ID',
      'Invoice Number',
      'Sale Date',
      'Status',
      'Customer Name',
      'Customer Phone',
      'Vehicle Make',
      'Vehicle Model',
      'Vehicle Variant',
      'VIN',
      'Sales Executive',
      'Branch',
      'Base Price',
      'Accessories Price',
      'Registration Tax',
      'Road Tax',
      'Insurance',
      'GST Amount',
      'Discount',
      'Exchange Bonus',
      'Grand Total',
      'Total Paid',
      'Outstanding Balance',
      'Finance Required',
      'Finance Partner',
      'Finance Loan Amount'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = salesData.map((s) => [
      escapeCSV(s.id),
      escapeCSV(s.invoiceNumber || ''),
      escapeCSV(s.saleDate ? new Date(s.saleDate).toISOString().split('T')[0] : ''),
      escapeCSV(s.status),
      escapeCSV(s.customerName || ''),
      escapeCSV(s.customerPhone || ''),
      escapeCSV(s.vehicleMake || ''),
      escapeCSV(s.vehicleModel || ''),
      escapeCSV(s.vehicleVariant || ''),
      escapeCSV(s.vin || ''),
      escapeCSV(s.salesExecutive || ''),
      escapeCSV(s.branch || ''),
      s.basePrice || 0,
      s.accessoriesPrice || 0,
      s.registrationTax || 0,
      s.roadTax || 0,
      s.insurance || 0,
      s.gstAmount || 0,
      s.discount || 0,
      s.exchangeBonus || 0,
      s.grandTotal || 0,
      s.totalPaid || 0,
      s.outstandingBalance || 0,
      escapeCSV(s.finance?.required ? 'Yes' : 'No'),
      escapeCSV(s.finance?.partner || ''),
      s.finance?.loanAmount || 0,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const toastId = toast.loading('Exporting sales records...');
      try {
        const blob = await salesService.exportSales();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `sales_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch {
        if (sales && sales.length > 0) {
          exportClientCSV(sales);
        } else {
          throw new Error('No sales records available to export.');
        }
      }
      toast.dismiss(toastId);
      toast.success('Sales records exported successfully');
    } catch (error: any) {
      toast.error('Failed to export sales records', {
        description: error.message || 'An error occurred during export.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    const toastId = toast.loading('Uploading and importing sales...');
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

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input type="file" ref={fileInputRef} accept=".csv" className="hidden" onChange={handleFileChange} />
      <PageHeader
        title="Sales"
        description="Manage vehicle sales, payments, delivery, and finance."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm" onClick={handleImportClick} disabled={importMutation.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              {importMutation.isPending ? 'Importing...' : 'Import'}
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

      {metrics ? (
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
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <SkeletonStatsCard />
          <SkeletonStatsCard />
          <SkeletonStatsCard />
          <SkeletonStatsCard />
        </div>
      )}

      {isLoading && !salesResult ? (
        <SkeletonTable />
      ) : sales.length > 0 ? (
        <DataTable
          columns={salesColumns}
          data={sales}
          searchKey="invoiceNumber"
          serverPagination={
            salesPage
              ? {
                  pageIndex: currentPageIndex,
                  pageSize: salesPage.limit ?? 10,
                  totalCount: salesPage.totalCount ?? 0,
                  canPreviousPage: previousCursors.length > 0,
                  canNextPage: salesPage.hasMore ?? false,
                  onPreviousPage: goToPreviousPage,
                  onNextPage: goToNextPage,
                }
              : undefined
          }
        />
      ) : (
        <EmptyState
          title="No Sales Yet"
          description="Create your first sale to start tracking revenue."
          icon={<IndianRupee />}
          actionLabel="New Sale"
          onAction={() => navigate({ to: '/sales/new' })}
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
