import { useReportMetrics, useExpenseCategories } from '../hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernDonutChart } from './Charts';
import { formatCurrency } from '@/utils/formatters';
import { TrendingDown, Receipt } from 'lucide-react';

export const FinanceView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: expenses } = useExpenseCategories();

  if (!metrics) return <div>Loading Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Gross Profit" value={formatCurrency(metrics.profit)} trend={{ value: Math.abs(metrics.profitGrowth), isPositive: metrics.profitGrowth >= 0 }} />
        <StatsCard title="Net Profit Margin" value={metrics.netProfitMargin.toString() + "%"} />
        <StatsCard title="Total Expenses" value={formatCurrency(metrics.expenses)} trend={{ value: Math.abs(metrics.expenseGrowth), isPositive: metrics.expenseGrowth <= 0 }} />
        <StatsCard title="Outstanding Payments" value={formatCurrency(metrics.outstandingPayments)} icon={<TrendingDown className="h-4 w-4" />} className="border-destructive/20 bg-destructive/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border/50 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Receipt className="h-4 w-4 text-primary" /> Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses && <ModernDonutChart data={expenses} />}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 lg:col-span-2 flex items-center justify-center bg-muted/10 border-dashed">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">Detailed P&L Statement</p>
            <p className="text-xs text-muted-foreground max-w-[300px]">The comprehensive Profit & Loss table will be generated here allowing drill-down into specific ledger entries.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
