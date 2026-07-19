import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { format, formatDistanceToNow } from "date-fns";
import { Truck, Building, MoreHorizontal, FileText, IndianRupee, Shield, Clock, Check, Download, CreditCard, Banknote, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSale, useRecordSalesPayment } from "../hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


const tabs = [
  { id: "overview", label: "Overview" },
  { id: "payments", label: "Payments" },
  { id: "finance", label: "Finance" },
  { id: "delivery", label: "Delivery" },
  { id: "invoice", label: "Invoice & Docs" },
  { id: "timeline", label: "Timeline" },
];

export function SalesWorkspacePage() {
  const { saleId } = useParams({ strict: false });
  const { data: sale, isLoading } = useSale(saleId as string);
  const [activeTab, setActiveTab] = useState("overview");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const recordPaymentMutation = useRecordSalesPayment(saleId as string);

  const openPaymentModal = () => {
    if (sale) {
      setPaymentAmount(sale.outstandingBalance.toString());
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
          <p className="text-sm text-muted-foreground animate-pulse">Loading sales workspace...</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return <div className="p-8 text-center text-muted-foreground">Sale not found</div>;
  }

  const statusVariants: Record<string, string> = {
    'Draft': "bg-muted text-muted-foreground border-transparent",
    'Quotation': "bg-muted text-muted-foreground border-transparent",
    'Reserved': "bg-blue-500/10 text-blue-500 border-transparent",
    'Payment Pending': "bg-amber-500/10 text-amber-500 border-transparent",
    'Finance Processing': "bg-orange-500/10 text-orange-500 border-transparent",
    'Ready For Delivery': "bg-emerald-500/10 text-emerald-500 border-transparent",
    'Delivered': "bg-purple-500/10 text-purple-500 border-transparent",
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
                    <h1 className="text-2xl font-semibold tracking-tight">{sale.invoiceNumber}</h1>
                    <Badge variant="outline" className={statusVariants[sale.status] || "bg-muted"}>
                      {sale.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="font-medium text-foreground flex items-center gap-1.5"><User className="h-4 w-4" /> {sale.customerName}</span>
                    <span className="hidden sm:flex items-center gap-1.5"><Truck className="h-4 w-4" /> {sale.vehicleMake} {sale.vehicleModel}</span>
                    <span className="hidden sm:flex items-center gap-1.5 font-mono">• {format(new Date(sale.saleDate), 'dd MMM yyyy')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {sale.outstandingBalance > 0 && (
                    <Button onClick={openPaymentModal} variant="outline" className="shadow-sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  )}
                  <Button className="shadow-sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
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
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Grand Total</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(sale.grandTotal)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Amount Paid</p>
              <p className="text-sm font-semibold font-mono text-emerald-600">{formatCurrency(sale.totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Outstanding Balance</p>
              <p className={`text-sm font-semibold font-mono ${sale.outstandingBalance > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {sale.outstandingBalance > 0 ? formatCurrency(sale.outstandingBalance) : "Settled"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Sales Executive</p>
              <p className="text-sm font-semibold truncate">{sale.salesExecutive}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-border/50 bg-muted/10 px-6 sm:px-10 flex overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
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
              {/* Linked Entities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-soft border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                  <Link to="/customers/$customerId" params={{ customerId: sale.customerId }}>
                    <CardHeader className="pb-4 border-b border-border/50">
                      <CardTitle className="text-base font-medium flex items-center justify-between">
                        <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Customer Profile</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{sale.customerName}</p>
                        <p className="text-sm text-muted-foreground">{sale.customerPhone}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="shadow-soft border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                  <Link to="/inventory/$inventoryId" params={{ inventoryId: sale.inventoryId }}>
                    <CardHeader className="pb-4 border-b border-border/50">
                      <CardTitle className="text-base font-medium flex items-center justify-between">
                        <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Vehicle Profile</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{sale.vehicleMake} {sale.vehicleModel}</p>
                        <p className="text-sm text-muted-foreground font-mono">{sale.vin}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              {/* Deal Breakdown */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" /> Deal Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Ex-Showroom Price</span><span className="font-mono">{formatCurrency(sale.basePrice)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Accessories</span><span className="font-mono">{formatCurrency(sale.accessoriesPrice)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">RTO / Registration</span><span className="font-mono">{formatCurrency(sale.registrationTax)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Road Tax</span><span className="font-mono">{formatCurrency(sale.roadTax)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span className="font-mono">{formatCurrency(sale.insurance)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">GST (Output)</span><span className="font-mono">{formatCurrency(sale.gstAmount)}</span></div>
                    {sale.discount > 0 && <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount</span><span className="font-mono">-{formatCurrency(sale.discount)}</span></div>}
                    {sale.exchangeBonus > 0 && <div className="flex justify-between text-amber-600"><span className="text-amber-600/80">Exchange Bonus</span><span className="font-mono">-{formatCurrency(sale.exchangeBonus)}</span></div>}
                    <div className="border-t border-border/50 pt-4 flex justify-between font-bold text-base mt-2">
                      <span>Grand Total (On-Road)</span>
                      <span className="font-mono">{formatCurrency(sale.grandTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Exec & Margin (Restricted) */}
              <Card className="shadow-soft border-border/50 bg-primary/5 border-primary/10">
                <CardHeader className="pb-4 border-b border-primary/10">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" /> Deal Economics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Branch</span>
                      <span className="text-sm font-medium">{sale.branch}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Assigned To</span>
                      <span className="text-sm font-medium">{sale.salesExecutive}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                      <span className="text-sm text-muted-foreground">Est. Profit Margin</span>
                      <span className="text-sm font-mono font-semibold text-emerald-600">{formatCurrency(sale.profitMargin)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Status Snippet */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" /> Delivery Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected</span>
                      <span className="text-sm font-medium">{format(new Date(sale.delivery.expectedDate), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className={sale.delivery.status === 'Completed' ? 'text-emerald-500 bg-emerald-500/10' : ''}>{sale.delivery.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium">Payment Ledger</h3>
                {sale.outstandingBalance > 0 && <Button variant="outline" size="sm"><Banknote className="h-4 w-4 mr-2" /> New Payment</Button>}
              </div>
              <div className="space-y-4">
                {sale.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">{payment.method} <Badge variant="outline" className="text-xs bg-muted">{payment.status}</Badge></p>
                        <p className="text-xs text-muted-foreground">Ref: {payment.referenceId || 'N/A'} • {format(new Date(payment.date), 'dd MMM yyyy, HH:mm')}</p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-emerald-600">+{formatCurrency(payment.amount)}</span>
                  </div>
                ))}

                {sale.outstandingBalance > 0 && (
                  <div className="flex justify-between items-center p-4 rounded-xl border border-dashed border-destructive/50 bg-destructive/5 mt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-destructive">Pending Balance</p>
                        <p className="text-xs text-destructive/80">Awaiting clearance</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-destructive">{formatCurrency(sale.outstandingBalance)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "finance" && (
          <div className="animate-in fade-in duration-500">
            {sale.finance.required ? (
              <Card className="shadow-soft border-border/50 max-w-2xl mx-auto">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Vehicle Loan Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Finance Partner</p>
                        <p className="text-base font-semibold">{sale.finance.partner}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Application Status</p>
                        <Badge variant="outline" className={
                          sale.finance.status === 'Approved' || sale.finance.status === 'Disbursed'
                            ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }>{sale.finance.status}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Loan Amount</p>
                        <p className="text-base font-mono font-medium">{formatCurrency(sale.finance.loanAmount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Down Payment</p>
                        <p className="text-base font-mono font-medium">{formatCurrency((sale.grandTotal) - (sale.finance.loanAmount || 0))}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
                <Shield className="h-10 w-10 mb-4 opacity-50" />
                <p>No finance application was processed for this sale.</p>
                <p className="text-sm mt-1 text-center max-w-md">The customer opted to pay the entire amount upfront via Cash, Bank Transfer, or UPI.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <h3 className="text-lg font-medium mb-8">Sales Progression</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {sale.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
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

        {activeTab === "delivery" && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
            <Truck className="h-10 w-10 mb-4 opacity-50" />
            <p>Delivery Checklist module coming soon</p>
          </div>
        )}

        {activeTab === "invoice" && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
            <FileText className="h-10 w-10 mb-4 opacity-50" />
            <p>Invoice PDF generation coming soon</p>
            <Button className="mt-4 shadow-sm"><Download className="mr-2 h-4 w-4" /> Preview Draft Invoice</Button>
          </div>
        )}
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-premium rounded-2xl bg-background animate-in fade-in zoom-in duration-300">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-500" />
              Record Payment Collection
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add a payment transaction for Sale Reference <span className="font-mono font-medium text-foreground">{sale.invoiceNumber || sale.id}</span>.
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
                    max={sale.outstandingBalance}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-8 font-mono text-base font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground flex justify-between">
                  <span>Max outstanding balance:</span>
                  <span className="font-mono font-medium">{formatCurrency(sale.outstandingBalance)}</span>
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
// Temporary mock component export to resolve imports quickly
const ChevronRight = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
