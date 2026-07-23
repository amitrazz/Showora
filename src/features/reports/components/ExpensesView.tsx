import { useReportMetrics, useExpenseCategories } from '../hooks';
import { useExpenses } from '@/features/expenses/hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernDonutChart } from './Charts';
import { formatCurrency } from '@/utils/formatters';
import { Wallet, PieChart } from 'lucide-react';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const ExpensesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: expensesData } = useExpenseCategories();
  const { data: expenseList } = useExpenses();

  if (!metrics) return <SkeletonChart />;

  const hasExpenses = expenseList && expenseList.length > 0;

  const totalOpsExpenses = hasExpenses
    ? expenseList.reduce((sum, e) => sum + (e.totalAmount || 0), 0)
    : metrics.expenses;

  const dailyAvg = totalOpsExpenses / 30;

  const pendingPayouts = hasExpenses
    ? expenseList.filter(e => e.paymentStatus !== 'Paid').reduce((sum, e) => sum + (e.outstandingAmount || e.totalAmount || 0), 0)
    : 125000;

  // Dynamic expense category distribution from real data
  const categoryMap = new Map<string, number>();
  if (hasExpenses) {
    expenseList.forEach(e => {
      const cat = e.category || 'Other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + (e.totalAmount || 0));
    });
  }

  const computedCatData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  const activeCatData = computedCatData.length > 0 ? computedCatData : (expensesData || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard title="Total Operational Expenses" value={formatCurrency(totalOpsExpenses)} icon={<Wallet className="h-4 w-4" />} trend={{ value: Math.abs(metrics.expenseGrowth), isPositive: metrics.expenseGrowth < 0 }} />
        <StatsCard title="Average Daily Expense" value={formatCurrency(dailyAvg)} />
        <StatsCard title="Pending Payouts" value={formatCurrency(pendingPayouts)} className="border-amber-500/20 bg-amber-500/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <PieChart className="h-4 w-4 text-primary" /> Expense Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCatData && <ModernDonutChart data={activeCatData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
