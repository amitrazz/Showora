import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { useDashboardMetrics } from "../hooks";
import { formatCurrency } from "@/utils/formatters";
import { IndianRupee, Users, Bike, Receipt, ArrowUpRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { data, isLoading } = useDashboardMetrics();

  if (isLoading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <PageHeader 
        title="Overview" 
        description="Here's what's happening in your showroom today." 
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">Download Report</Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          icon={<IndianRupee className="h-4 w-4" />}
          trend={{ value: data.revenueTrend, isPositive: data.revenueTrend > 0 }}
          description="vs last month"
          className="bg-gradient-to-br from-card to-card/50"
        />
        <StatsCard
          title="Bikes Sold"
          value={data.bikesSold.toString()}
          icon={<Bike className="h-4 w-4" />}
          trend={{ value: data.bikesSoldTrend, isPositive: data.bikesSoldTrend > 0 }}
          description="vs last month"
        />
        <StatsCard
          title="Active Customers"
          value={data.activeCustomers.toString()}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: data.activeCustomersTrend, isPositive: data.activeCustomersTrend > 0 }}
          description="vs last month"
        />
        <StatsCard
          title="Pending Invoices"
          value={data.pendingInvoices.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="Action required"
          className="border-destructive/20 bg-destructive/5"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-5 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue performance for the current year</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
              View details <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 100000}L`}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value as number)}
                  contentStyle={{borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', boxShadow: 'var(--shadow-lg)'}}
                  itemStyle={{color: 'var(--foreground)'}}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {data.recentSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center group cursor-pointer">
                  <Avatar className="h-10 w-10 border border-border/50 transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-primary/5 text-primary">{sale.customerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 overflow-hidden flex-1">
                    <p className="text-sm font-medium leading-none truncate group-hover:text-primary transition-colors">{sale.customerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{sale.bikeModel}</p>
                  </div>
                  <div className="ml-auto text-right shrink-0">
                    <p className="text-sm font-semibold">{formatCurrency(sale.amount)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
