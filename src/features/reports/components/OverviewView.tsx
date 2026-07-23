import { 
  useReportMetrics, 
  useRevenueTrend, 
  useSalesByModel, 
  useInventoryDistribution,
  useInsights 
} from '../hooks';
import { useSales } from '@/features/sales/hooks';
import { useExpenses } from '@/features/expenses/hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueAreaChart, SalesBarChart, ModernDonutChart } from './Charts';
import { formatCurrency } from '@/utils/formatters';
import { IndianRupee, TrendingUp, Package, Users, Activity } from 'lucide-react';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const OverviewView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: trendData } = useRevenueTrend();
  const { data: salesData } = useSalesByModel();
  const { data: inventoryData } = useInventoryDistribution();
  const { data: insights } = useInsights();
  const { data: salesList } = useSales();
  const { data: expenseList } = useExpenses();

  if (!metrics || !trendData) return <SkeletonChart />;

  const hasSales = salesList && salesList.length > 0;
  const hasExpenses = expenseList && expenseList.length > 0;

  const totalRev = hasSales ? salesList.reduce((sum, s) => sum + (s.grandTotal || 0), 0) : metrics.revenue;
  const totalExp = hasExpenses ? expenseList.reduce((sum, e) => sum + (e.totalAmount || 0), 0) : metrics.expenses;
  const netProfit = totalRev - totalExp;
  const unitsSold = hasSales ? salesList.length : metrics.unitsSold;

  // Dynamic Top Selling Models bar chart
  const modelMap = new Map<string, number>();
  if (hasSales) {
    salesList.forEach(s => {
      const modelName = s.vehicleModel || `${s.vehicleMake || ''} ${s.vehicleModel || 'Model'}`.trim();
      modelMap.set(modelName, (modelMap.get(modelName) || 0) + 1);
    });
  }

  const computedSalesData = Array.from(modelMap.entries()).map(([name, value]) => ({ name, value }));
  const activeSalesData = computedSalesData.length > 0 ? computedSalesData : (salesData || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRev)}
          icon={<IndianRupee className="h-4 w-4" />}
          trend={{ value: Math.abs(metrics.revenueGrowth), isPositive: metrics.revenueGrowth >= 0 }}
        />
        <StatsCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: Math.abs(metrics.profitGrowth), isPositive: metrics.profitGrowth >= 0 }}
        />
        <StatsCard
          title="Units Sold"
          value={unitsSold.toString()}
          icon={<Package className="h-4 w-4" />}
          trend={{ value: Math.abs(metrics.unitsSoldGrowth), isPositive: metrics.unitsSoldGrowth >= 0 }}
        />
        <StatsCard
          title="New Customers"
          value={metrics.customerGrowth.toString() + "%"}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: Math.abs(metrics.customerGrowth), isPositive: metrics.customerGrowth >= 0 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue vs Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={trendData} />
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {insights?.slice(0, 3).map((insight) => (
              <div key={insight.id} className="p-3 rounded-xl border border-border/50 bg-muted/30">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  {insight.metric && <span className="text-xs font-mono font-semibold text-primary">{insight.metric}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top Selling Models</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSalesData && <SalesBarChart data={activeSalesData} />}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryData && <ModernDonutChart data={inventoryData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
