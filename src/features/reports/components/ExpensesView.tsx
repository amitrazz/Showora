import { useReportMetrics, useExpenseCategories } from '../hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernDonutChart } from './Charts';
import { formatPaise as formatCurrency } from '@/utils/formatters';
import { Wallet, PieChart } from 'lucide-react';

export const ExpensesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: expensesData } = useExpenseCategories();

  if (!metrics) return <div>Loading Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard title="Total Operational Expenses" value={formatCurrency(metrics.expenses)} icon={<Wallet className="h-4 w-4" />} trend={{ value: Math.abs(metrics.expenseGrowth), isPositive: metrics.expenseGrowth < 0 }} />
        <StatsCard title="Average Daily Expense" value={formatCurrency(metrics.expenses / 30)} />
        <StatsCard title="Pending Payouts" value="₹1.25L" className="border-amber-500/20 bg-amber-500/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <PieChart className="h-4 w-4 text-primary" /> Expense Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expensesData && <ModernDonutChart data={expensesData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
