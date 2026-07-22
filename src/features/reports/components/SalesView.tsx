import { useReportMetrics, useSalesByModel, useSalesExecutives } from '../hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesBarChart } from './Charts';
import { formatPaise as formatCurrency } from '@/utils/formatters';
import { Users, Zap } from 'lucide-react';

export const SalesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: salesData } = useSalesByModel();
  const { data: execs } = useSalesExecutives();

  if (!metrics) return <div>Loading Data...</div>;

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
              {execs?.map((exec, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{exec.name}</p>
                        <p className="text-xs text-muted-foreground">{exec.units} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-medium">{formatCurrency(exec.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{((exec.revenue / exec.target) * 100).toFixed(0)}% of target</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-primary" style={{ width: `${Math.min((exec.revenue / exec.target) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
