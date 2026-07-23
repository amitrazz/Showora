import { useReportMetrics, useInventoryHealth, useInventoryDistribution } from '../hooks';
import { useInventory } from '@/features/inventory/hooks';
import { InventoryVehicle } from '@/features/inventory/types';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernDonutChart } from './Charts';
import { formatCurrency } from '@/utils/formatters';
import { Package, AlertCircle } from 'lucide-react';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const InventoryView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: healthData } = useInventoryHealth();
  const { data: distData } = useInventoryDistribution();
  const { data: inventoryRes } = useInventory();

  if (!metrics) return <SkeletonChart />;

  const inventoryList: InventoryVehicle[] = Array.isArray(inventoryRes)
    ? inventoryRes
    : (inventoryRes?.data ?? []);
  const hasInventory = inventoryList.length > 0;

  const totalValue = hasInventory 
    ? inventoryList.reduce((sum: number, v: InventoryVehicle) => sum + (v.purchaseCost || 0), 0)
    : metrics.inventoryValue;

  const unitsAvailable = hasInventory
    ? inventoryList.filter((v: InventoryVehicle) => v.status === 'Available').length
    : 65;

  const unitsReserved = hasInventory
    ? inventoryList.filter((v: InventoryVehicle) => v.status === 'Reserved').length
    : 20;

  const deadStock = hasInventory
    ? inventoryList.filter((v: InventoryVehicle) => (v.daysInInventory || 0) > 90).length
    : 3;

  // Compute live model health matrix
  const modelMap = new Map<string, { model: string; available: number; reserved: number }>();
  if (hasInventory) {
    inventoryList.forEach((v: InventoryVehicle) => {
      const modelName = `${v.make} ${v.model}`;
      const existing = modelMap.get(modelName) || { model: modelName, available: 0, reserved: 0 };
      if (v.status === 'Available') existing.available += 1;
      if (v.status === 'Reserved') existing.reserved += 1;
      modelMap.set(modelName, existing);
    });
  }

  const computedHealthData = Array.from(modelMap.values());
  const activeHealthData = computedHealthData.length > 0 ? computedHealthData : (healthData || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Inventory Value" value={formatCurrency(totalValue)} />
        <StatsCard title="Units Available" value={unitsAvailable.toString()} />
        <StatsCard title="Units Reserved" value={unitsReserved.toString()} />
        <StatsCard title="Dead Stock (>90d)" value={deadStock.toString()} icon={<AlertCircle className="h-4 w-4" />} className="border-destructive/20 bg-destructive/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <Package className="h-4 w-4 text-primary" /> Inventory Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {distData && <ModernDonutChart data={distData} />}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <AlertCircle className="h-4 w-4 text-primary" /> Model Health Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {activeHealthData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-muted/10">
                  <span className="font-medium text-sm">{item.model}</span>
                  <div className="flex gap-4 text-sm text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="font-mono font-medium text-emerald-600">{item.available}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reserved</p>
                      <p className="font-mono font-medium text-amber-500">{item.reserved}</p>
                    </div>
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
