import { useReportMetrics, useSupplierPerformance } from '../hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesBarChart } from './Charts';
import { ShoppingBag, Truck } from 'lucide-react';

export const PurchasesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: supplierData } = useSupplierPerformance();

  if (!metrics) return <div>Loading Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard title="Total Purchase Value" value="₹1.2Cr" icon={<ShoppingBag className="h-4 w-4" />} />
        <StatsCard title="Pending Deliveries" value="14 Units" icon={<Truck className="h-4 w-4 text-amber-500" />} />
        <StatsCard title="Active Suppliers" value="8" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Truck className="h-4 w-4 text-primary" /> Supplier Performance (Volume)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplierData && <SalesBarChart data={supplierData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
