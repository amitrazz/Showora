import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceWizardSchema, CreateInvoiceWizardForm } from "../schemas";
import { useCreateInvoice } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save, IndianRupee, Banknote, Search, Calendar, User, FileText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency } from "@/utils/formatters";

const steps = [
  { id: "sale", title: "Link Sale" },
  { id: "metadata", title: "Details" },
  { id: "pricing", title: "Tax & Pricing" },
  { id: "payment", title: "Payment" },
  { id: "review", title: "Review" },
];

export function InvoiceWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const createMutation = useCreateInvoice();

  const form = useForm<CreateInvoiceWizardForm>({
    resolver: zodResolver(createInvoiceWizardSchema) as any,
    defaultValues: {
      sale: { saleId: "" },
      metadata: { invoiceDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], salesExecutive: "Rajesh Kumar", branch: "Downtown Main Showroom" },
      pricing: { basePrice: 215000, accessoriesPrice: 0, registrationTax: 21500, insurance: 8500, otherCharges: 0, discount: 0, gstRate: 28 },
      payment: { amountPaid: 0, method: "Bank Transfer" },
    },
    mode: "onChange",
  });

  const { register, trigger, watch, handleSubmit, formState: { errors } } = form;
  
  // Live Pricing
  const p = watch("pricing");
  const taxableAmount = (p.basePrice || 0) + (p.accessoriesPrice || 0) - (p.discount || 0);
  const gstRate = p.gstRate || 28;
  const cgstAmount = taxableAmount * (gstRate / 2 / 100);
  const sgstAmount = taxableAmount * (gstRate / 2 / 100);
  const totalGst = cgstAmount + sgstAmount;
  const grandTotal = Math.round(taxableAmount + totalGst + (p.registrationTax || 0) + (p.insurance || 0) + (p.otherCharges || 0));
  
  const amountPaid = watch("payment.amountPaid") || 0;
  const outstanding = Math.max(0, grandTotal - amountPaid);
  
  const handleNext = async () => {
    const stepIds = ["sale", "metadata", "pricing", "payment", "review"] as const;
    const currentStepId = stepIds[currentStep];
    const isStepValid = currentStepId === "review" ? true : await trigger(currentStepId as any);
    
    if (isStepValid) {
      setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title="Generate Invoice" 
        description="Draft a final tax invoice for a completed vehicle sale."
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/invoices" })}>
            Cancel
          </Button>
        }
      />

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border rounded-full hidden sm:block" />
        <div className="relative flex justify-between gap-2 overflow-x-auto custom-scrollbar pb-4 sm:pb-0">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2 z-10 min-w-[80px]">
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted ? "bg-primary border-primary text-primary-foreground" :
                    isCurrent ? "border-primary text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Wizard Area */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden shadow-soft border-border/50">
            <CardContent className="p-0">
              <div className="p-6 sm:p-10 min-h-[450px] relative">
                <AnimatePresence mode="wait">
                  
                  {currentStep === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Search className="h-5 w-5 text-primary" /> Select Sale Reference</h3>
                        <p className="text-sm text-muted-foreground">Link this invoice to an existing approved sale.</p>
                      </div>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Sale ID / Reservation Number *</label>
                          <Input {...register("sale.saleId")} placeholder="e.g. SALE-2026-1045" className="h-10 bg-muted/50" />
                          {errors.sale?.saleId && <p className="text-xs text-destructive">{errors.sale.saleId.message}</p>}
                        </div>
                        <div className="p-4 rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground flex items-start gap-3">
                          <FileText className="h-5 w-5 mt-0.5 text-primary" />
                          <p>In a production environment, entering the Sale ID would automatically auto-fill the entire pricing, customer, and vehicle inventory schema for you.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Invoice Details</h3>
                        <p className="text-sm text-muted-foreground">Set the administrative metadata for this bill.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Invoice Date *</label>
                          <Input type="date" {...register("metadata.invoiceDate")} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Due Date *</label>
                          <Input type="date" {...register("metadata.dueDate")} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Sales Executive</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...register("metadata.salesExecutive")} className="pl-9 bg-muted/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Branch Location</label>
                          <Input {...register("metadata.branch")} className="bg-muted/50" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary" /> Tax & Pricing Calculation</h3>
                        <p className="text-sm text-muted-foreground">Verify the OTR (On-Road) price breakdown.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ex-Showroom Base Price (₹)</label>
                          <Input type="number" {...register("pricing.basePrice", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Accessories Total (₹)</label>
                          <Input type="number" {...register("pricing.accessoriesPrice", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2 border-l-2 pl-4 border-emerald-500/50 py-1">
                          <label className="text-sm font-medium">GST Rate (%)</label>
                          <select {...register("pricing.gstRate", { valueAsNumber: true })} className="flex h-10 w-full rounded-md border border-input bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 focus-visible:outline-none">
                            <option value={28}>28% (Standard 2-Wheeler)</option>
                            <option value={18}>18% (EV/Sub-segment)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-destructive">Discount (₹)</label>
                          <Input type="number" {...register("pricing.discount", { valueAsNumber: true })} className="bg-destructive/5 font-mono text-destructive" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 border-t pt-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-4">Non-Taxable Logistics & RTO</h4>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Registration & Road Tax (₹)</label>
                          <Input type="number" {...register("pricing.registrationTax", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Insurance Premium (₹)</label>
                          <Input type="number" {...register("pricing.insurance", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" /> Payment Receipt</h3>
                        <p className="text-sm text-muted-foreground">Record amounts settled against this invoice.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 pt-4 max-w-md">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount Received (₹)</label>
                          <Input type="number" {...register("payment.amountPaid", { valueAsNumber: true })} className="bg-muted/50 font-mono text-lg" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Mode</label>
                          <select {...register("payment.method")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                            <option value="UPI">UPI</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="Finance">Dealer Finance Partner</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Transaction Reference</label>
                          <Input {...register("payment.referenceId")} placeholder="e.g. UTR / Cheque No." className="bg-muted/50 font-mono" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1 flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-medium">Review & Generate</h3>
                      </div>
                      <p className="text-sm text-muted-foreground -mt-4">Ensure all taxation splits and identifiers are correct. Generated invoices cannot be easily altered.</p>
                      
                      <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Invoice Summary</h4>
                         <div className="space-y-3 mb-6">
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Sale Ref:</span><span className="text-sm font-medium font-mono">{watch("sale.saleId")}</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Executive:</span><span className="text-sm font-medium">{watch("metadata.salesExecutive")}</span></div>
                         </div>
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Financials</h4>
                         <div className="space-y-2">
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Taxable Value:</span><span className="text-sm font-medium font-mono">{formatCurrency(taxableAmount)}</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">GST ({gstRate}%):</span><span className="text-sm font-medium font-mono">{formatCurrency(totalGst)}</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Grand Total:</span><span className="text-sm font-bold font-mono">{formatCurrency(grandTotal)}</span></div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t p-6 bg-muted/20">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="shadow-sm">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext} className="shadow-sm">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit((d) => onSubmit(d))} disabled={createMutation.isPending} className="shadow-sm">
                    {createMutation.isPending ? "Generating..." : "Generate Invoice"}
                    {!createMutation.isPending && <Save className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Calculation Sidebar */}
        <div className="hidden lg:block">
          <Card className="sticky top-20 border-border/50 shadow-soft bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-6"><FileText className="h-4 w-4 text-primary" /> Invoice Draft</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span className="font-mono">{formatCurrency(p.basePrice || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Accessories</span><span className="font-mono">{formatCurrency(p.accessoriesPrice || 0)}</span></div>
                <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount</span><span className="font-mono">-{formatCurrency(p.discount || 0)}</span></div>
                
                <div className="border-t border-border/50 pt-2 flex justify-between font-medium">
                  <span className="text-muted-foreground">Taxable Value</span>
                  <span className="font-mono">{formatCurrency(taxableAmount)}</span>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground pl-2"><span className="">CGST ({gstRate/2}%)</span><span className="font-mono">{formatCurrency(cgstAmount)}</span></div>
                <div className="flex justify-between text-xs text-muted-foreground pl-2"><span className="">SGST ({gstRate/2}%)</span><span className="font-mono">{formatCurrency(sgstAmount)}</span></div>
                
                <div className="border-t border-border/50 pt-2 mt-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Registration</span><span className="font-mono">{formatCurrency(p.registrationTax || 0)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span className="font-mono">{formatCurrency(p.insurance || 0)}</span></div>
                </div>

                <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-base mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatCurrency(grandTotal)}</span>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex justify-between text-emerald-600 font-medium"><span>Received</span><span className="font-mono">{formatCurrency(amountPaid)}</span></div>
                  <div className="flex justify-between text-destructive font-medium mt-1"><span>Due</span><span className="font-mono">{formatCurrency(outstanding)}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
