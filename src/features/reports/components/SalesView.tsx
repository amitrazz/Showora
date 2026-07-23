import { useReportMetrics, useSalesByModel, useSalesExecutives } from '../hooks';
import { useSales } from '@/features/sales/hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesBarChart } from './Charts';
import { formatCurrency } from '@/utils/formatters';
import { Users, Zap } from 'lucide-react';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const SalesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: salesData } = useSalesByModel();
  const { data: apiExecs } = useSalesExecutives();
  const { data: salesList } = useSales();

  if (!metrics) return <SkeletonChart />;

  // Compute dynamic leaderboard from real sales data
  const computedExecsMap = new Map<string, { name: string; units: number; revenue: number; target: number }>();

  if (salesList && salesList.length > 0) {
    salesList.forEach((sale) => {
      const execName = sale.salesExecutive || 'Current User';
      const existing = computedExecsMap.get(execName) || { name: execName, units: 0, revenue: 0, target: 2500000 };
      existing.units += 1;
      existing.revenue += (sale.grandTotal || 0);
      computedExecsMap.set(execName, existing);
    });
  }

  const computedExecs = Array.from(computedExecsMap.values());
  computedExecs.sort((a, b) => b.revenue - a.revenue);

  const execs = computedExecs.length > 0 ? computedExecs : (apiExecs || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value={formatCurrency(metrics.revenue)} trend={{ value: Math.abs(metrics.revenueGrowth), isPositive: metrics.revenueGrowth >= 0 }} />
        <StatsCard title="Average Deal Value" value={formatCurrency(metrics.averageDealValue)} />
        <StatsCard title="Units Sold" value={metrics.unitsSold.toString()} trend={{ value: Math.abs(metrics.unitsSoldGrowth), isPositive: metrics.unitsSoldGrowth >= 0 }} />
        <StatsCard title="Repeat Customers" value={metrics.repeatCustomers.toString()} trend={{ value: 5.2, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Zap className="h-4 w-4 text-primary" /> Units Sold by Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesData && <SalesBarChart data={salesData} />}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Users className="h-4 w-4 text-primary" /> Executive Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {execs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No sales executive data available.</p>
              ) : (
                execs.map((exec, i) => {
                  const targetVal = exec.target || 2500000;
                  const percent = Math.min(Math.round((exec.revenue / targetVal) * 100), 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{exec.name}</p>
                            <p className="text-xs text-muted-foreground">{exec.units} unit{exec.units === 1 ? '' : 's'} sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-medium">{formatCurrency(exec.revenue)}</p>
                          <p className="text-xs text-muted-foreground">{percent}% of target</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
