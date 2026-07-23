import { useReportMetrics, useExpenseCategories } from '../hooks';
import { useSales } from '@/features/sales/hooks';
import { useExpenses } from '@/features/expenses/hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernDonutChart } from './Charts';
import { formatCurrency } from '@/utils/formatters';
import { TrendingDown, Receipt } from 'lucide-react';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const FinanceView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: expensesData } = useExpenseCategories();
  const { data: salesList } = useSales();
  const { data: expenseList } = useExpenses();

  if (!metrics) return <SkeletonChart />;

  const hasSales = salesList && salesList.length > 0;
  const hasExpenses = expenseList && expenseList.length > 0;

  const totalRev = hasSales ? salesList.reduce((sum, s) => sum + (s.grandTotal || 0), 0) : metrics.revenue;
  const totalExp = hasExpenses ? expenseList.reduce((sum, e) => sum + (e.totalAmount || 0), 0) : metrics.expenses;
  const grossProfit = hasSales ? salesList.reduce((sum, s) => sum + (s.profitMargin || (s.grandTotal - s.basePrice) || 0), 0) : metrics.profit;
  const netProfitVal = totalRev - totalExp;
  const netMargin = totalRev > 0 ? Math.round((netProfitVal / totalRev) * 100) : metrics.netProfitMargin;

  const outstandingPayablesables = hasSales ? salesList.reduce((sum, s) => sum + (s.outstandingBalance || 0), 0) : metrics.outstandingPayments;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Gross Profit" value={formatCurrency(grossProfit)} trend={{ value: Math.abs(metrics.profitGrowth), isPositive: metrics.profitGrowth >= 0 }} />
        <StatsCard title="Net Profit Margin" value={`${netMargin}%`} />
        <StatsCard title="Total Expenses" value={formatCurrency(totalExp)} trend={{ value: Math.abs(metrics.expenseGrowth), isPositive: metrics.expenseGrowth <= 0 }} />
        <StatsCard title="Outstanding Payments" value={formatCurrency(outstandingPayablesables)} icon={<TrendingDown className="h-4 w-4" />} className="border-destructive/20 bg-destructive/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border/50 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Receipt className="h-4 w-4 text-primary" /> Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expensesData && <ModernDonutChart data={expensesData} />}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 lg:col-span-2 flex items-center justify-center bg-muted/10 border-dashed p-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">Detailed P&L Statement (Live Ledger)</p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2 text-left text-xs font-mono">
              <div className="p-2 rounded bg-background border">
                <span className="text-muted-foreground block">Revenue:</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(totalRev)}</span>
              </div>
              <div className="p-2 rounded bg-background border">
                <span className="text-muted-foreground block">Expenses:</span>
                <span className="font-semibold text-destructive">{formatCurrency(totalExp)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">Comprehensive Profit & Loss breakdown synced with sales records & expense vouchers.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
