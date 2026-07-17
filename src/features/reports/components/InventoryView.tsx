import { useReportMetrics, useInventoryHealth, useInventoryDistribution } from '../hooks';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernDonutChart } from './Charts';
import { Package, AlertCircle } from 'lucide-react';

export const InventoryView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: healthData } = useInventoryHealth();
  const { data: distData } = useInventoryDistribution();

  if (!metrics) return <div>Loading Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Inventory Value" value={"₹" + (metrics.inventoryValue / 100000).toFixed(2) + "L"} />
        <StatsCard title="Units Available" value="65" />
        <StatsCard title="Units Reserved" value="20" />
        <StatsCard title="Dead Stock" value="3" icon={<AlertCircle className="h-4 w-4" />} className="border-destructive/20 bg-destructive/5" />
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
              {healthData?.map((item, i) => (
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
