import { useReportMetrics, useCustomerAcquisition } from '../hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueAreaChart } from './Charts';
import { Users, UserPlus, Heart } from 'lucide-react';

export const CustomersView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: customerData } = useCustomerAcquisition();

  if (!metrics) return <div>Loading Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard title="Total Customers" value="842" icon={<Users className="h-4 w-4" />} />
        <StatsCard title="New Acquisitions" value={metrics.customerGrowth.toString() + "%"} icon={<UserPlus className="h-4 w-4" />} trend={{ value: Math.abs(metrics.customerGrowth), isPositive: metrics.customerGrowth > 0 }} />
        <StatsCard title="Repeat Customers" value={metrics.repeatCustomers.toString() + "%"} icon={<Heart className="h-4 w-4 text-pink-500" />} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <UserPlus className="h-4 w-4 text-primary" /> Customer Acquisition Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customerData && <RevenueAreaChart data={customerData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
