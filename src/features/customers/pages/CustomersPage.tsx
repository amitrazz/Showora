import { useCustomers, useCustomerMetrics } from "../hooks";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { formatCurrency } from "@/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "../types";
import { Users, UserPlus, IndianRupee, HandCoins, Plus, Download, Upload, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";

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
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();
  const { data: metrics } = useCustomerMetrics();

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
        title="Customers" 
        description="Manage customers, purchase history, finance, and showroom relationships."
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
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Outstanding Amount"
            value={formatCurrency(metrics.outstandingAmount)}
            icon={<HandCoins className="h-4 w-4" />}
            className="border-destructive/20 bg-destructive/5"
          />
          <StatsCard
            title="Total LTV Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            icon={<IndianRupee className="h-4 w-4" />}
            className="bg-gradient-to-br from-card to-card/50"
          />
        </div>
      )}

      {customers && customers.length > 0 ? (
        <DataTable 
          columns={customerColumns} 
          data={customers} 
          searchKey="firstName" 
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
    </div>
  );
}
