import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { format, formatDistanceToNow } from "date-fns";
import { Truck, Building, MoreHorizontal, FileText, IndianRupee, Clock, Check, Download, CreditCard, PackageOpen, Banknote, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePurchase, useRecordPurchasePayment } from "../hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


const tabs = [
  { id: "overview", label: "Overview" },
  { id: "items", label: "Items & Status" },
  { id: "receiving", label: "Receiving" },
  { id: "payments", label: "Payments" },
  { id: "documents", label: "Documents" },
  { id: "timeline", label: "Timeline" },
];

export function PurchaseWorkspacePage() {
  const { purchaseId } = useParams({ strict: false });
  const { data: purchase, isLoading } = usePurchase(purchaseId as string);
  const [activeTab, setActiveTab] = useState("overview");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const recordPaymentMutation = useRecordPurchasePayment(purchaseId as string);

  const openPaymentModal = () => {
    if (purchase) {
      setPaymentAmount(purchase.outstandingAmount.toString());
      setPaymentMethod("Bank Transfer");
      setReferenceId("");
      setIsPaymentModalOpen(true);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) return;
    recordPaymentMutation.mutate({
      amount: parseFloat(paymentAmount),
      method: paymentMethod,
      referenceId: referenceId,
    }, {
      onSuccess: () => {
        setIsPaymentModalOpen(false);
        setPaymentAmount("");
        setReferenceId("");
      }
    });
  };


  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading procurement workspace...</p>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return <div className="p-8 text-center text-muted-foreground">Purchase Order not found</div>;
  }

  const statusVariants: Record<string, string> = {
    'Draft': "bg-muted text-muted-foreground border-transparent",
    'Pending Approval': "bg-amber-500/10 text-amber-500 border-transparent",
    'Approved': "bg-blue-500/10 text-blue-500 border-transparent",
    'Ordered': "bg-blue-500/10 text-blue-500 border-transparent",
    'Partially Received': "bg-purple-500/10 text-purple-500 border-transparent",
    'Received': "bg-emerald-500/10 text-emerald-500 border-transparent",
    'Closed': "bg-slate-500/10 text-slate-500 border-transparent",
    'Cancelled': "bg-destructive/10 text-destructive border-transparent",
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        
        <div className="px-6 sm:px-10 py-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            
            <div className="flex-1 space-y-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight">{purchase.poNumber}</h1>
                    <Badge variant="outline" className={statusVariants[purchase.status] || "bg-muted"}>
                      {purchase.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="font-medium text-foreground flex items-center gap-1.5"><Building className="h-4 w-4"/> {purchase.supplierName}</span>
                    <span className="hidden sm:flex items-center gap-1.5 font-mono">• {format(new Date(purchase.orderDate), 'dd MMM yyyy')}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {(purchase.status === 'Ordered' || purchase.status === 'Partially Received') && (
                    <Button onClick={() => setActiveTab("receiving")} className="shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white">
                      <PackageOpen className="mr-2 h-4 w-4" />
                      Receive Inventory
                    </Button>
                  )}
                  {purchase.outstandingAmount > 0 && (
                    <Button onClick={openPaymentModal} variant="outline" className="shadow-sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  )}
                  <Link to="/purchases/$purchaseId/edit" params={{ purchaseId: purchase.id }}>
                    <Button variant="outline" className="shadow-sm">
                      <Pencil className="mr-2 h-4 w-4" /> Edit PO
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="border shadow-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 mt-6 border-t border-border/50">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Purchase Value</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(purchase.grandTotal)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Amount Paid</p>
              <p className="text-sm font-semibold font-mono text-emerald-600">{formatCurrency(purchase.amountPaid)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Outstanding Payable</p>
              <p className={`text-sm font-semibold font-mono ${purchase.outstandingAmount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {purchase.outstandingAmount > 0 ? formatCurrency(purchase.outstandingAmount) : "Settled"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Expected Delivery</p>
              <p className="text-sm font-semibold">{format(new Date(purchase.expectedDelivery), 'dd MMM yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-border/50 bg-muted/10 px-6 sm:px-10 flex overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="lg:col-span-2 space-y-6">
              {/* Supplier Info */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" /> Supplier Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Company Name</p>
                      <p className="text-sm font-medium">{purchase.supplierName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Supplier ID</p>
                      <p className="text-sm font-medium font-mono text-muted-foreground">{purchase.supplierId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Payment Terms</p>
                      <p className="text-sm font-medium">{purchase.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Created By</p>
                      <p className="text-sm font-medium">{purchase.createdBy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Breakdown */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" /> Purchase Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                   <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Items Subtotal</span><span className="font-mono">{formatCurrency(purchase.subtotal)}</span></div>
                    {purchase.discount > 0 && <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount Applied</span><span className="font-mono">-{formatCurrency(purchase.discount)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">GST (Input Tax)</span><span className="font-mono">{formatCurrency(purchase.gstAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Transportation Cost</span><span className="font-mono">{formatCurrency(purchase.transportation)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Transit Insurance</span><span className="font-mono">{formatCurrency(purchase.insurance)}</span></div>
                    {purchase.otherCharges > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Other Charges</span><span className="font-mono">{formatCurrency(purchase.otherCharges)}</span></div>}
                    
                    <div className="border-t border-border/50 pt-4 flex justify-between font-bold text-base mt-2">
                      <span>Total Invoice Value</span>
                      <span className="font-mono">{formatCurrency(purchase.grandTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Delivery Logistics Snippet */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" /> Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected</span>
                      <span className="text-sm font-medium">{format(new Date(purchase.expectedDelivery), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Destination</span>
                      <span className="text-sm font-medium">{purchase.warehouse}</span>
                    </div>
                    {purchase.deliveryNotes && (
                      <div className="pt-4 border-t border-border/50">
                        <span className="text-sm text-muted-foreground block mb-2">Instructions</span>
                        <p className="text-sm bg-muted/30 p-3 rounded-md">{purchase.deliveryNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "items" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/20">
                    <tr className="text-left text-muted-foreground">
                      <th className="font-medium p-4 pl-6">Vehicle Specification</th>
                      <th className="font-medium p-4">Color</th>
                      <th className="font-medium p-4 text-right">Unit Cost</th>
                      <th className="font-medium p-4 text-center">Ordered</th>
                      <th className="font-medium p-4 text-center">Received</th>
                      <th className="font-medium p-4 text-right pr-6">Total Line Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {purchase.items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-medium">{item.make} {item.model}</p>
                          <p className="text-xs text-muted-foreground">{item.variant}</p>
                        </td>
                        <td className="p-4">{item.color}</td>
                        <td className="p-4 text-right font-mono text-muted-foreground">{formatCurrency(item.unitCost)}</td>
                        <td className="p-4 text-center">{item.quantityOrdered}</td>
                        <td className="p-4 text-center">
                          <Badge variant="outline" className={item.quantityReceived === item.quantityOrdered ? "bg-emerald-500/10 text-emerald-500" : (item.quantityReceived > 0 ? "bg-purple-500/10 text-purple-500" : "")}>
                            {item.quantityReceived}
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-mono font-medium pr-6">{formatCurrency(item.totalCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "receiving" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <PackageOpen className="h-5 w-5 text-primary" /> Goods Receipt Note (GRN)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {(purchase.status === 'Ordered' || purchase.status === 'Partially Received') ? (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground mb-4">Record incoming vehicles against this purchase order. This will automatically generate VINs and inject them into the active Showroom Inventory.</p>
                  
                  <div className="border rounded-xl overflow-hidden divide-y divide-border/50">
                    {purchase.items.filter(i => i.quantityOrdered > i.quantityReceived).map((item) => (
                      <div key={item.id} className="p-4 bg-card flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <p className="font-medium text-sm">{item.make} {item.model} ({item.color})</p>
                          <p className="text-xs text-muted-foreground">Pending: {item.quantityOrdered - item.quantityReceived} units</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <input type="number" defaultValue={item.quantityOrdered - item.quantityReceived} max={item.quantityOrdered - item.quantityReceived} min={0} className="w-20 h-9 rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-center" />
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Receive</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Check className="h-12 w-12 text-emerald-500/50 mb-4" />
                  <p className="font-medium text-foreground">All items have been received.</p>
                  <p className="text-sm text-muted-foreground mt-1 text-center">Inventory ledger has been updated successfully.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium">Outbound Payment Ledger</h3>
                {purchase.outstandingAmount > 0 && <Button variant="outline" size="sm"><Banknote className="h-4 w-4 mr-2" /> Release Payment</Button>}
              </div>
              <div className="space-y-4">
                {purchase.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">{payment.method} <Badge variant="outline" className="text-xs bg-muted">{payment.status}</Badge></p>
                        <p className="text-xs text-muted-foreground">Ref: {payment.referenceId || 'N/A'} • {format(new Date(payment.date), 'dd MMM yyyy, HH:mm')}</p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-foreground">-{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
                
                {purchase.outstandingAmount > 0 && (
                  <div className="flex justify-between items-center p-4 rounded-xl border border-dashed border-destructive/50 bg-destructive/5 mt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-destructive">Pending Payable Balance</p>
                        <p className="text-xs text-destructive/80">Awaiting clearance to supplier</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-destructive">{formatCurrency(purchase.outstandingAmount)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "timeline" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <h3 className="text-lg font-medium mb-8">Procurement Lifecycle</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {purchase.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-primary/10 z-10 shrink-0">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 bg-card rounded-xl border border-border/50 p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <time className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(event.date), { addSuffix: true })}</time>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">By {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "documents" && (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             <FileText className="h-10 w-10 mb-4 opacity-50" />
             <p>PO PDF Generation & Supplier Invoice Uploads coming soon</p>
             <Button className="mt-4 shadow-sm"><Download className="mr-2 h-4 w-4"/> Preview Draft PO</Button>
           </div>
        )}
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-premium rounded-2xl bg-background animate-in fade-in zoom-in duration-300">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-500" />
              Record Supplier Payment
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add a payment transaction for Purchase Order <span className="font-mono font-medium text-foreground">{purchase.poNumber}</span>.
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-5 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={purchase.outstandingAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-8 font-mono text-base font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground flex justify-between">
                  <span>Max outstanding payable:</span>
                  <span className="font-mono font-medium">{formatCurrency(purchase.outstandingAmount)}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transaction / Reference ID</label>
                <Input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g. TXN928374981"
                  className="font-mono uppercase"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={recordPaymentMutation.isPending}
                >
                  {recordPaymentMutation.isPending ? "Recording..." : "Record Payment"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
