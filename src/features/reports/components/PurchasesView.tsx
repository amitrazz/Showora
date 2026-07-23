import { useReportMetrics, useSupplierPerformance } from '../hooks';
import { usePurchases, usePurchaseMetrics } from '@/features/purchases/hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesBarChart } from './Charts';
import { ShoppingBag, Truck } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const PurchasesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: supplierData } = useSupplierPerformance();
  const { data: purchaseList } = usePurchases();
  const { data: purchaseMetrics } = usePurchaseMetrics();

  if (!metrics) return <SkeletonChart />;

  const hasPurchases = purchaseList && purchaseList.length > 0;

  const totalPurchaseVal = purchaseMetrics?.totalPurchaseValue
    || (hasPurchases ? purchaseList.reduce((sum, p) => sum + (p.grandTotal || 0), 0) : 12000000);

  const pendingCount = purchaseMetrics?.pendingDeliveries !== undefined
    ? purchaseMetrics.pendingDeliveries
    : (hasPurchases ? purchaseList.filter(p => p.status === 'Ordered' || p.status === 'Partially Received').length : 14);

  const activeSupplierCount = purchaseMetrics?.activeSuppliers
    || (hasPurchases ? new Set(purchaseList.map(p => p.supplierName)).size : 8);

  // Compute live supplier performance bar chart data
  const supplierMap = new Map<string, number>();
  if (hasPurchases) {
    purchaseList.forEach(p => {
      const sName = p.supplierName || 'Other';
      supplierMap.set(sName, (supplierMap.get(sName) || 0) + (p.grandTotal || 0));
    });
  }

  const computedSupplierData = Array.from(supplierMap.entries()).map(([name, value]) => ({ name, value }));
  const activeSupplierData = computedSupplierData.length > 0 ? computedSupplierData : (supplierData || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard title="Total Purchase Value" value={formatCurrency(totalPurchaseVal)} icon={<ShoppingBag className="h-4 w-4" />} />
        <StatsCard title="Pending Deliveries" value={`${pendingCount} Unit${pendingCount === 1 ? '' : 's'}`} icon={<Truck className="h-4 w-4 text-amber-500" />} />
        <StatsCard title="Active Suppliers" value={activeSupplierCount.toString()} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Truck className="h-4 w-4 text-primary" /> Supplier Performance (Volume)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSupplierData && <SalesBarChart data={activeSupplierData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
