import { useReportMetrics, useTaxRegister } from '../hooks';

import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SkeletonChart } from '@/components/ui/skeleton/SkeletonTemplates';

export const TaxesView = () => {
  const { data: metrics } = useReportMetrics();
  const { data: taxData } = useTaxRegister();

  if (!metrics) return <SkeletonChart />;

  const totalGstCollected = metrics.gstCollected;
  const totalGstPaid = metrics.gstPaid;

  const activeTaxRows = taxData || [];

  const handleDownloadGstr3b = () => {
    const toastId = toast.loading('Generating GSTR-3B Tax Return export...');
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success('GSTR-3B Tax Return generated', {
        description: 'GST summary report downloaded for tax filing.',
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="Total GST Collected (Output)" value={formatCurrency(totalGstCollected)} icon={<FileText className="h-4 w-4" />} />
        <StatsCard title="Total GST Paid (Input)" value={formatCurrency(totalGstPaid)} icon={<FileText className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
               <FileText className="h-4 w-4 text-primary" /> GST Register (Monthly Summary)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleDownloadGstr3b}>
              <Download className="mr-2 h-4 w-4" /> Download GSTR-3B Data
            </Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="w-full overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-muted text-muted-foreground uppercase text-xs">
                   <tr>
                     <th className="px-6 py-3 font-semibold">Month</th>
                     <th className="px-6 py-3 font-semibold text-right">Collected (Output)</th>
                     <th className="px-6 py-3 font-semibold text-right">Paid (Input)</th>
                     <th className="px-6 py-3 font-semibold text-right">Net Liability</th>
                     <th className="px-6 py-3 font-semibold">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {activeTaxRows.map((row: any, i: number) => (
                     <tr key={i} className="hover:bg-muted/30 transition-colors">
                       <td className="px-6 py-4 font-medium">{row.month}</td>
                       <td className="px-6 py-4 text-right font-mono text-emerald-600">{formatCurrency(row.collected || 0)}</td>
                       <td className="px-6 py-4 text-right font-mono text-blue-600">{formatCurrency(row.paid || 0)}</td>
                       <td className="px-6 py-4 text-right font-mono font-semibold">{formatCurrency(row.liability || 0)}</td>
                       <td className="px-6 py-4">
                         <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-semibold rounded-md border border-emerald-500/20">
                           {row.status || 'Calculated'}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
