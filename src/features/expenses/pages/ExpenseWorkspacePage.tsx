import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useExpense, useRecordExpensePayment } from "../hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { format, formatDistanceToNow } from "date-fns";
import { 
  FileText, Download, MoreHorizontal, IndianRupee, Clock, Check, 
  CreditCard, Building2, UploadCloud, ShieldCheck, XCircle, Pencil 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "payments", label: "Payments" },
  { id: "documents", label: "Documents" },
  { id: "timeline", label: "Timeline" },
];

export function ExpenseWorkspacePage() {
  const { expenseId } = useParams({ strict: false });
  const { data: expense, isLoading } = useExpense(expenseId as string);
  const [activeTab, setActiveTab] = useState("overview");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const recordPaymentMutation = useRecordExpensePayment(expenseId as string);

  const openPaymentModal = () => {
    if (expense) {
      setPaymentAmount(expense.outstandingAmount.toString());
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

  const [documents, setDocuments] = useState<Array<{ name: string; size: string; type: string; url?: string }>>([]);

  useEffect(() => {
    if (expense) {
      if (expense.supportingDocuments && expense.supportingDocuments.length > 0) {
        setDocuments(expense.supportingDocuments.map((doc: any) => ({
          name: doc.name,
          size: doc.size || "2.4 MB",
          type: doc.fileType || "PDF",
          url: doc.fileUrl || "#",
        })));
      } else if (expense.hasReceipts) {
        const mockContent = `Showora Operational Expense Record\nExpense ID: ${expense.expenseId}\nTitle: ${expense.title}\nVendor: ${expense.vendor}\nCategory: ${expense.category}\nBranch: ${expense.branch}\nDate: ${expense.expenseDate}\nTotal Amount: ${formatCurrency(expense.totalAmount)}`;
        const blob = new Blob([mockContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        setDocuments([
          {
            name: `${expense.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_bill.txt`,
            size: `${(1.2 + (expense.totalAmount % 3.0)).toFixed(1)} MB`,
            type: "TXT",
            url: url,
          }
        ]);
      } else {
        setDocuments([]);
      }
    }
  }, [expense]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const url = URL.createObjectURL(file);
      const newDoc = {
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'unknown',
        url: url,
      };
      
      const toastId = toast.loading('Uploading document...');
      
      setTimeout(() => {
        setDocuments(prev => [...prev, newDoc]);
        toast.dismiss(toastId);
        toast.success('Document uploaded successfully!');
      }, 1000);
    }
  };

  const handleDownload = (doc: { name: string; url?: string }) => {
    if (!doc.url) return;
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${doc.name}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading expense workspace...</p>
        </div>
      </div>
    );
  }

  if (!expense) {
    return <div className="p-8 text-center text-muted-foreground">Expense not found</div>;
  }

  const approvalVariants: Record<string, string> = {
    'Draft': "bg-muted text-muted-foreground border-transparent",
    'Submitted': "bg-amber-500/10 text-amber-500 border-transparent",
    'Approved': "bg-emerald-500/10 text-emerald-500 border-transparent",
    'Rejected': "bg-destructive/10 text-destructive border-transparent",
    'Paid': "bg-blue-500/10 text-blue-500 border-transparent",
  };

  const paymentVariants: Record<string, string> = {
    'Pending': "bg-amber-500/10 text-amber-500 border-transparent",
    'Partially Paid': "bg-blue-500/10 text-blue-500 border-transparent",
    'Paid': "bg-emerald-500/10 text-emerald-500 border-transparent",
    'Overdue': "bg-destructive/10 text-destructive border-transparent",
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
                    <h1 className="text-2xl font-semibold tracking-tight">{expense.expenseId}</h1>
                    <Badge variant="outline" className={approvalVariants[expense.status] || "bg-muted"}>
                      {expense.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="font-medium text-foreground flex items-center gap-1.5"><Building2 className="h-4 w-4"/> {expense.vendor}</span>
                    <span className="hidden sm:flex items-center gap-1.5 font-mono">• {format(new Date(expense.expenseDate), 'dd MMM yyyy')}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {expense.status === 'Submitted' && (
                    <>
                      <Button variant="outline" className="shadow-sm border-destructive text-destructive hover:bg-destructive/10">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button className="shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </>
                  )}
                  {expense.status === 'Approved' && expense.outstandingAmount > 0 && (
                    <Button onClick={openPaymentModal} className="shadow-sm animate-in fade-in duration-300">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  )}
                  <Link to="/expenses/$expenseId/edit" params={{ expenseId: expense.id }}>
                    <Button variant="outline" className="shadow-sm">
                      <Pencil className="mr-2 h-4 w-4" /> Edit Expense
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
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Expense Amount</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(expense.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Amount Paid</p>
              <p className="text-sm font-semibold font-mono text-emerald-600">{formatCurrency(expense.paidAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Balance Due</p>
              <p className={`text-sm font-semibold font-mono ${expense.outstandingAmount > 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                {expense.outstandingAmount > 0 ? formatCurrency(expense.outstandingAmount) : "Settled"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Due Date</p>
              <p className="text-sm font-semibold">{format(new Date(expense.dueDate), 'dd MMM yyyy')}</p>
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
              {/* Core Details */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Title</span>
                      <p className="text-sm font-medium">{expense.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Description</span>
                      <p className="text-sm">{expense.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Category</span>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Payment Status</span>
                        <Badge variant="outline" className={paymentVariants[expense.paymentStatus]}>{expense.paymentStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Breakdown */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" /> Financials
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatCurrency(expense.subtotal)}</span></div>
                    {expense.gstAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="font-mono">{formatCurrency(expense.gstAmount)}</span></div>}
                    {expense.discount > 0 && <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount</span><span className="font-mono">-{formatCurrency(expense.discount)}</span></div>}
                    
                    <div className="border-t border-border/50 pt-4 flex justify-between font-bold text-base mt-2">
                      <span>Total Amount</span>
                      <span className="font-mono">{formatCurrency(expense.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Meta Data */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Branch</span>
                      <p className="text-sm font-medium">{expense.branch}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Created By</span>
                      <p className="text-sm font-medium">{expense.createdBy}</p>
                    </div>
                    {expense.approvedBy && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Approved By</span>
                        <p className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                           <Check className="h-4 w-4" /> {expense.approvedBy}
                        </p>
                      </div>
                    )}
                    {expense.isRecurring && (
                      <div className="pt-4 border-t border-border/50">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-transparent">
                           Recurring: {expense.recurringFrequency}
                        </Badge>
                      </div>
                    )}
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
                <h3 className="text-lg font-medium">Payment History</h3>
                {expense.outstandingAmount > 0 && (
                  <Button onClick={openPaymentModal} variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" /> Record Payment
                  </Button>
                )}
              </div>
              
              {expense.payments.length > 0 ? (
                <div className="space-y-4">
                  {expense.payments.map((payment) => (
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
                      <span className="font-mono font-medium text-emerald-600">{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                  
                  {expense.outstandingAmount > 0 && (
                    <div className="flex justify-between items-center p-4 rounded-xl border border-dashed border-destructive/50 bg-destructive/5 mt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-destructive">Pending Payment</p>
                          <p className="text-xs text-destructive/80">Due by {format(new Date(expense.dueDate), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-destructive">{formatCurrency(expense.outstandingAmount)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-xl border-dashed">
                  <p className="text-muted-foreground">No payments recorded yet.</p>
                  <p className="text-sm font-medium mt-2 text-destructive">Total Outstanding: {formatCurrency(expense.totalAmount)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "documents" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium">Supporting Documents</h3>
                <input
                  type="file"
                  id="receipt-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                >
                  <UploadCloud className="h-4 w-4 mr-2" /> Upload Receipt
                </Button>
              </div>
              
              {documents.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="border border-border/50 rounded-xl p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors group cursor-pointer">
                         <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{doc.size} • {doc.type}</p>
                         </div>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDownload(doc);
                           }}
                         >
                            <Download className="h-4 w-4 text-muted-foreground" />
                         </Button>
                      </div>

                    ))}
                 </div>
              ) : (
                <div className="text-center py-12 border rounded-xl border-dashed">
                  <p className="text-muted-foreground">No documents attached.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}


        {activeTab === "timeline" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <h3 className="text-lg font-medium mb-8">Expense Lifecycle</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {expense.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
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
      </div>

      {isPaymentModalOpen && (
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="sm:max-w-[425px] border border-border/80 shadow-2xl bg-card animate-in zoom-in-95 duration-200">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" /> Record Expense Payment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter the details of the payment made to the vendor.
                </p>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium leading-none text-muted-foreground">
                    Payment Amount (INR) *
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={expense?.outstandingAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="bg-muted/50 font-mono text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum outstanding amount: <span className="font-semibold">{formatCurrency(expense?.outstandingAmount || 0)}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="method" className="text-sm font-medium leading-none text-muted-foreground">
                    Payment Method *
                  </label>
                  <select
                    id="method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="referenceId" className="text-sm font-medium leading-none text-muted-foreground">
                    Reference ID / Transaction ID *
                  </label>
                  <Input
                    id="referenceId"
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="e.g. TXN12345678"
                    className="bg-muted/50"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPaymentModalOpen(false)}
                    disabled={recordPaymentMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={recordPaymentMutation.isPending}>
                    {recordPaymentMutation.isPending ? "Recording..." : "Record Payment"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

