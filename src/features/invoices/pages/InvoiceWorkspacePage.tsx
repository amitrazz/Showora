import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { format, formatDistanceToNow } from "date-fns";
import { Receipt, FileText, Download, Printer, Share2, MoreHorizontal, IndianRupee, Clock, Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice, useRecordInvoicePayment } from "../hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


const tabs = [
  { id: "overview", label: "Overview" },
  { id: "payments", label: "Payment History" },
  { id: "pdf", label: "PDF Preview" },
  { id: "timeline", label: "Timeline" },
];

export function InvoiceWorkspacePage() {
  const { invoiceId } = useParams({ strict: false });
  const { data: invoice, isLoading } = useInvoice(invoiceId as string);
  const [activeTab, setActiveTab] = useState("overview");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const recordPaymentMutation = useRecordInvoicePayment(invoiceId as string);

  const openPaymentModal = () => {
    if (invoice) {
      setPaymentAmount(invoice.outstandingAmount.toString());
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
          <p className="text-sm text-muted-foreground animate-pulse">Loading invoice workspace...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-8 text-center text-muted-foreground">Invoice not found</div>;
  }

  const statusVariants: Record<string, string> = {
    'Draft': "bg-muted text-muted-foreground border-transparent",
    'Generated': "bg-blue-500/10 text-blue-500 border-transparent",
    'Sent': "bg-purple-500/10 text-purple-500 border-transparent",
    'Paid': "bg-emerald-500/10 text-emerald-500 border-transparent",
    'Partially Paid': "bg-amber-500/10 text-amber-500 border-transparent",
    'Overdue': "bg-destructive/10 text-destructive border-transparent",
    'Cancelled': "bg-slate-500/10 text-slate-500 border-transparent",
    'Refunded': "bg-orange-500/10 text-orange-500 border-transparent",
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
                    <h1 className="text-2xl font-semibold tracking-tight">{invoice.invoiceNumber}</h1>
                    <Badge variant="outline" className={statusVariants[invoice.status] || "bg-muted"}>
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="font-medium text-foreground flex items-center gap-1.5"><Receipt className="h-4 w-4" /> {invoice.customerName}</span>
                    <span className="hidden sm:flex items-center gap-1.5 font-mono">• {format(new Date(invoice.invoiceDate), 'dd MMM yyyy')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button onClick={() => setActiveTab("pdf")} variant="outline" className="shadow-sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Preview PDF
                  </Button>
                  {invoice.outstandingAmount > 0 && (
                    <Button onClick={openPaymentModal} className="shadow-sm bg-primary text-primary-foreground">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  )}
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
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Invoice Amount</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(invoice.grandTotal)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Amount Paid</p>
              <p className="text-sm font-semibold font-mono text-emerald-600">{formatCurrency(invoice.amountPaid)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Balance Due</p>
              <p className={`text-sm font-semibold font-mono ${invoice.outstandingAmount > 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                {invoice.outstandingAmount > 0 ? formatCurrency(invoice.outstandingAmount) : "Settled"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Due Date</p>
              <p className="text-sm font-semibold">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</p>
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
              {/* Core Pricing Breakdown */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" /> Invoice Financials
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Ex-Showroom Price</span><span className="font-mono">{formatCurrency(invoice.basePrice)}</span></div>
                    {invoice.accessoriesPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Accessories</span><span className="font-mono">{formatCurrency(invoice.accessoriesPrice)}</span></div>}
                    {invoice.discount > 0 && <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount</span><span className="font-mono">-{formatCurrency(invoice.discount)}</span></div>}

                    <div className="border-t border-border/50 pt-2 flex justify-between font-medium">
                      <span className="text-muted-foreground">Taxable Value</span>
                      <span className="font-mono">{formatCurrency(invoice.taxableAmount)}</span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground pl-2"><span className="">CGST ({invoice.cgstRate}%)</span><span className="font-mono">{formatCurrency(invoice.cgstAmount)}</span></div>
                    <div className="flex justify-between text-xs text-muted-foreground pl-2"><span className="">SGST ({invoice.sgstRate}%)</span><span className="font-mono">{formatCurrency(invoice.sgstAmount)}</span></div>

                    <div className="border-t border-border/50 pt-2 mt-2">
                      <div className="flex justify-between"><span className="text-muted-foreground">Registration & RTO</span><span className="font-mono">{formatCurrency(invoice.registrationTax)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Insurance Premium</span><span className="font-mono">{formatCurrency(invoice.insurance)}</span></div>
                      {invoice.otherCharges > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Other Charges</span><span className="font-mono">{formatCurrency(invoice.otherCharges)}</span></div>}
                    </div>

                    <div className="border-t border-border/50 pt-4 flex justify-between font-bold text-base mt-2">
                      <span>Total Invoice Value</span>
                      <span className="font-mono">{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Linked References */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> References
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Customer</span>
                      <p className="text-sm font-medium">{invoice.customerName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Vehicle Details</span>
                      <p className="text-sm font-medium">{invoice.vehicleMake} {invoice.vehicleModel}</p>
                      <p className="text-xs text-muted-foreground">{invoice.vehicleVariant} - {invoice.vehicleColor}</p>
                      <div className="mt-2 text-xs font-mono text-muted-foreground space-y-1">
                        <p>VIN: {invoice.vin}</p>
                        <p>Engine: {invoice.engineNumber}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Sale Reference ID</span>
                      <p className="text-sm font-medium font-mono text-primary flex items-center gap-2 hover:underline cursor-pointer">{invoice.saleId}</p>
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
                <h3 className="text-lg font-medium">Payment History</h3>
                {invoice.outstandingAmount > 0 && (
                  <Button onClick={openPaymentModal} variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" /> Record Collection
                  </Button>
                )}
              </div>

              {invoice.payments.length > 0 ? (
                <div className="space-y-4">
                  {invoice.payments.map((payment) => (
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

                  {invoice.outstandingAmount > 0 && (
                    <div className="flex justify-between items-center p-4 rounded-xl border border-dashed border-destructive/50 bg-destructive/5 mt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-destructive">Pending Collection</p>
                          <p className="text-xs text-destructive/80">Due by {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-destructive">{formatCurrency(invoice.outstandingAmount)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-xl border-dashed">
                  <p className="text-muted-foreground">No payments recorded yet.</p>
                  <p className="text-sm font-medium mt-2 text-destructive">Total Outstanding: {formatCurrency(invoice.grandTotal)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "pdf" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" /> Print</Button>
              <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
              <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" /> Email</Button>
            </div>

            <div className="flex justify-center p-4 sm:p-10 bg-muted/30 rounded-xl overflow-x-auto">
              {/* Mock A4 Paper Document - Matching Komaki Riya Enterprises Invoice */}
              <div className="bg-white w-[800px] min-h-[1131px] text-black font-sans shadow-2xl shrink-0 p-8">

                <div className="text-center font-bold text-sm mb-2 uppercase tracking-wide">
                  Tax Invoice
                </div>

                <div className="border border-black border-b-0 flex">
                  <div className="w-[200px] bg-[#f26522] text-white flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-bold tracking-tighter">KOMAKI<sup className="text-sm">®</sup></h1>
                    <p className="text-[8px] mt-1 text-center font-medium tracking-wider">ELECTRIC VEHICLE DIVISION</p>
                  </div>
                  <div className="flex-1 p-3">
                    <h2 className="text-xl font-semibold mb-2">Riya Enterprises</h2>
                    <p className="text-xs mb-2">Kurtha Kinjar Road Nirjanbigha Kurtha</p>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <p><span className="font-semibold">Phone:</span> 8804934029</p>
                      <p><span className="font-semibold">Email:</span> dkharmoney08@gmail.com</p>
                      <p><span className="font-semibold">GSTIN:</span> 10ILGPK9201Q1ZT</p>
                      <p><span className="font-semibold">State:</span> 10-Bihar</p>
                    </div>
                  </div>
                </div>

                <div className="border border-black border-b-0 flex text-xs">
                  <div className="flex-1 border-r border-black">
                    <div className="bg-gray-100 p-1 border-b border-black font-semibold">Bill To:</div>
                    <div className="p-2 space-y-1">
                      <p className="font-semibold">{invoice.customerName}</p>
                      <div className="grid grid-cols-[70px_1fr] gap-1">
                        <p>Address :</p>
                        <p className="uppercase">{invoice.customerAddress}</p>

                        <p>Pin Code :</p>
                        <p>804426</p>

                        <p>Contact :</p>
                        <p>{invoice.customerPhone.replace('+91 ', '')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[350px]">
                    <div className="bg-gray-100 p-1 border-b border-black font-semibold">Invoice Details:</div>
                    <div className="p-2">
                      <div className="grid grid-cols-[100px_1fr] gap-1">
                        <p>Invoice ID :</p>
                        <p>{invoice.invoiceNumber}</p>

                        <p>Date :</p>
                        <p>{format(new Date(invoice.invoiceDate), 'EEEE, MMMM d, yyyy')}</p>

                        <p>Time :</p>
                        <p>07:28:53 PM</p>

                        <p>Place of Supply :</p>
                        <p>10-Bihar</p>
                      </div>
                    </div>
                  </div>
                </div>

                <table className="w-full border-collapse border border-black text-xs text-center mb-0">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-black">
                      <th className="border-r border-black p-1 font-semibold w-8">#</th>
                      <th className="border-r border-black p-1 font-semibold text-left pl-2">Item Name</th>
                      <th className="border-r border-black p-1 font-semibold w-24">HSN/ SAC</th>
                      <th className="border-r border-black p-1 font-semibold w-16">Quantity</th>
                      <th className="border-r border-black p-1 font-semibold w-24">Price/ Unit (₹)</th>
                      <th className="border-r border-black p-1 font-semibold w-24">GST(₹)</th>
                      <th className="p-1 font-semibold w-24">Amount(₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black align-top h-16">
                      <td className="border-r border-black p-1">1</td>
                      <td className="border-r border-black p-1 text-left pl-2">WS MOBILITY {invoice.vehicleMake} {invoice.vehicleModel}</td>
                      <td className="border-r border-black p-1">85116020</td>
                      <td className="border-r border-black p-1">1</td>
                      <td className="border-r border-black p-1">₹{invoice.taxableAmount.toFixed(2)}</td>
                      <td className="border-r border-black p-1">₹{invoice.totalGst.toFixed(2)}</td>
                      <td className="p-1">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</td>
                    </tr>
                    <tr className="font-semibold bg-gray-50">
                      <td colSpan={4} className="border-r border-black p-1 text-right pr-2">Total</td>
                      <td className="border-r border-black p-1">₹{invoice.taxableAmount.toFixed(2)}</td>
                      <td className="border-r border-black p-1">₹{invoice.totalGst.toFixed(2)}</td>
                      <td className="p-1">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Tax Summary Complex Table */}
                <div className="border border-t-0 border-black flex flex-col text-[11px]">
                  <div className="flex border-b border-black">
                    <div className="flex-[3] p-1 bg-gray-100 font-semibold border-r border-black">Tax Summary:</div>
                    <div className="flex-[2] flex">
                      <div className="flex-1 p-1 bg-gray-50 border-r border-black">Sub Total :</div>
                      <div className="w-24 p-1 font-semibold text-right">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-[3] border-r border-black flex flex-col">
                      {/* Headers */}
                      <div className="flex border-b border-black text-center bg-gray-50">
                        <div className="w-20 border-r border-black p-1 flex items-center justify-center">HSN/ SAC</div>
                        <div className="w-24 border-r border-black p-1 flex items-center justify-center">Taxable Amount<br />(₹)</div>
                        <div className="flex-1 border-r border-black">
                          <div className="border-b border-black p-0.5">CGST</div>
                          <div className="flex">
                            <div className="flex-1 border-r border-black p-0.5">Rate (%)</div>
                            <div className="flex-1 p-0.5">Amt (₹)</div>
                          </div>
                        </div>
                        <div className="flex-1 border-r border-black">
                          <div className="border-b border-black p-0.5">SGST</div>
                          <div className="flex">
                            <div className="flex-1 border-r border-black p-0.5">Rate (%)</div>
                            <div className="flex-1 p-0.5">Amt (₹)</div>
                          </div>
                        </div>
                        <div className="w-20 p-1 flex items-center justify-center">Total Tax(₹)</div>
                      </div>

                      {/* Values */}
                      <div className="flex border-b border-black text-center">
                        <div className="w-20 border-r border-black p-1">85116020</div>
                        <div className="w-24 border-r border-black p-1">₹{invoice.taxableAmount.toFixed(2)}</div>

                        <div className="flex-1 border-r border-black flex">
                          <div className="flex-1 border-r border-black p-1">{invoice.cgstRate.toFixed(2)}%</div>
                          <div className="flex-1 p-1">₹{invoice.cgstAmount.toFixed(2)}</div>
                        </div>

                        <div className="flex-1 border-r border-black flex">
                          <div className="flex-1 border-r border-black p-1">{invoice.sgstRate.toFixed(2)}%</div>
                          <div className="flex-1 p-1">₹{invoice.sgstAmount.toFixed(2)}</div>
                        </div>

                        <div className="w-20 p-1">₹{invoice.totalGst.toFixed(2)}</div>
                      </div>

                      {/* Total */}
                      <div className="flex font-semibold">
                        <div className="w-20 border-r border-black p-1 text-left">TOTAL</div>
                        <div className="w-24 border-r border-black p-1 text-center">₹{invoice.taxableAmount.toFixed(2)}</div>

                        <div className="flex-1 border-r border-black flex">
                          <div className="flex-1 border-r border-black p-1"></div>
                          <div className="flex-1 p-1 text-center">₹{invoice.cgstAmount.toFixed(2)}</div>
                        </div>

                        <div className="flex-1 border-r border-black flex">
                          <div className="flex-1 border-r border-black p-1"></div>
                          <div className="flex-1 p-1 text-center">₹{invoice.sgstAmount.toFixed(2)}</div>
                        </div>

                        <div className="w-20 p-1 text-center">₹{invoice.totalGst.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex-[2] flex flex-col">
                      <div className="flex border-b border-black">
                        <div className="flex-1 p-1 font-semibold border-r border-black">Total :</div>
                        <div className="w-24 p-1 text-right font-semibold">₹{invoice.grandTotal.toFixed(2)}</div>
                      </div>
                      <div className="border-b border-black p-1">
                        <span className="font-semibold">Invoice Amount In Words :</span><br />
                        Fifty one thousand Rupees only (mock)
                      </div>
                      <div className="flex border-b border-black">
                        <div className="flex-1 p-1 font-semibold border-r border-black">Received</div>
                        <div className="w-24 p-1 text-right">₹{invoice.amountPaid.toFixed(2)}</div>
                      </div>
                      <div className="flex">
                        <div className="flex-1 p-1 font-semibold border-r border-black">Balance</div>
                        <div className="w-24 p-1 text-right">₹{invoice.outstandingAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Boxes */}
                <div className="border border-t-0 border-black flex text-[11px] min-h-[140px]">
                  <div className="flex-1 border-r border-black">
                    <div className="bg-gray-100 p-1 font-semibold border-b border-black">Description:</div>
                    <div className="p-2 space-y-1">
                      <p><span className="font-semibold">Motor No :</span> {invoice.motorNumber || 'N/A'}</p>
                      <p><span className="font-semibold">Charge No:</span> {invoice.chargeNumber || 'N/A'}</p>
                      <p><span className="font-semibold">Controller No :</span> {invoice.controllerNumber || 'N/A'}</p>
                      <p><span className="font-semibold">Chassis No :</span> {invoice.vin}</p>
                      <p><span className="font-semibold">Battery Serial No:</span> {invoice.batterySerialNumber || 'N/A'}</p>
                      <br />
                      <p className="font-semibold">NOTES:</p>
                      <p>Battery motor controller warranty =3year charger</p>
                      <p>warranty =1year</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 p-1 font-semibold border-b border-black">Terms & Conditions:</div>
                    <div className="p-2 font-semibold space-y-0.5">
                      <p>Outer Damage Policy :</p>
                      <p>1.All Disputes are subject to Jurisdiction of<br />Arwal</p>
                      <p>2.battery,motor,controller,charger warranty is not<br />covered on water damage</p>
                      <p>3.battery,motor,controller,charger courier charge<br />pay by customer</p>
                      <p>4.goods once sold shall not be taken back</p>
                    </div>
                  </div>
                </div>

                <div className="border border-t-0 border-black flex text-[11px] min-h-[120px]">
                  <div className="flex-1 border-r border-black">
                    <div className="bg-gray-100 p-1 font-semibold border-b border-black">Bank Details:</div>
                    <div className="p-2 grid grid-cols-[120px_1fr] gap-y-2">
                      <p>Name:</p>
                      <p className="uppercase">UNION BANK OF INDIA MOTIPUR</p>

                      <p>Account No.:</p>
                      <p>456801010001247</p>

                      <p>IFSC code:</p>
                      <p>UBIN0545686</p>

                      <p>Account Holder's Name:</p>
                      <p>Riya Enterprises</p>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 p-1 font-semibold border-b border-black">For Riya Enterprises:</div>
                    {/* Empty space for signature */}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <h3 className="text-lg font-medium mb-8">Invoice Lifecycle</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {invoice.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
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

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-premium rounded-2xl bg-background animate-in fade-in zoom-in duration-300">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-500" />
              Record Collection
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add a payment transaction for Invoice <span className="font-mono font-medium text-foreground">{invoice.invoiceNumber}</span>.
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
                    max={invoice.outstandingAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-8 font-mono text-base font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground flex justify-between">
                  <span>Max outstanding balance:</span>
                  <span className="font-mono font-medium">{formatCurrency(invoice.outstandingAmount)}</span>
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
                  {recordPaymentMutation.isPending ? "Recording..." : "Record Collection"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
