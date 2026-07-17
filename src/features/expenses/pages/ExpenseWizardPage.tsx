import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpenseWizardSchema, CreateExpenseWizardForm } from "../schemas";
import { useCreateExpense } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save, IndianRupee, Banknote, Building2, UploadCloud, FileText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency } from "@/utils/formatters";

const steps = [
  { id: "info", title: "Information" },
  { id: "amount", title: "Amount" },
  { id: "payment", title: "Payment" },
  { id: "attachments", title: "Attachments" },
  { id: "review", title: "Review" },
];

export function ExpenseWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const createMutation = useCreateExpense();

  const form = useForm<CreateExpenseWizardForm>({
    resolver: zodResolver(createExpenseWizardSchema) as any,
    defaultValues: {
      info: { title: "", category: "Utilities", vendor: "", description: "", branch: "Downtown Main Showroom", expenseDate: new Date().toISOString().split('T')[0], isRecurring: false },
      amount: { subtotal: 0, gstAmount: 0, discount: 0 },
      payment: { dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], method: "Bank Transfer", paidAmount: 0, referenceId: "" },
    },
    mode: "onChange",
  });

  const { register, trigger, watch, handleSubmit, formState: { errors } } = form;
  
  // Live Pricing
  const a = watch("amount");
  const totalAmount = (a.subtotal || 0) + (a.gstAmount || 0) - (a.discount || 0);
  
  const paidAmount = watch("payment.paidAmount") || 0;
  const outstanding = Math.max(0, totalAmount - paidAmount);
  
  const handleNext = async () => {
    const stepIds = ["info", "amount", "payment", "attachments", "review"] as const;
    const currentStepId = stepIds[currentStep];
    const isStepValid = currentStepId === "review" || currentStepId === "attachments" ? true : await trigger(currentStepId as any);
    
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
        title="Record Expense" 
        description="Draft a new operational expense, bill, or reimbursement."
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/expenses" })}>
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
                        <h3 className="text-lg font-medium flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Expense Information</h3>
                        <p className="text-sm text-muted-foreground">General details about this expense or vendor bill.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2 col-span-1 sm:col-span-2">
                          <label className="text-sm font-medium">Expense Title *</label>
                          <Input {...register("info.title")} placeholder="e.g. October Internet Bill" className="bg-muted/50" />
                          {errors.info?.title && <p className="text-xs text-destructive">{errors.info.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category *</label>
                          <select {...register("info.category")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="Utilities">Utilities</option>
                            <option value="Staff Salary">Staff Salary</option>
                            <option value="Rent">Rent</option>
                            <option value="Marketing">Marketing & Advertising</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Vendor / Payee *</label>
                          <Input {...register("info.vendor")} placeholder="e.g. BESCOM" className="bg-muted/50" />
                          {errors.info?.vendor && <p className="text-xs text-destructive">{errors.info.vendor.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Expense Date *</label>
                          <Input type="date" {...register("info.expenseDate")} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Branch Location</label>
                          <Input {...register("info.branch")} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2 col-span-1 sm:col-span-2 border-t pt-4">
                           <div className="flex items-center gap-2">
                             <input type="checkbox" id="isRecurring" {...register("info.isRecurring")} className="rounded border-input text-primary focus:ring-primary" />
                             <label htmlFor="isRecurring" className="text-sm font-medium">This is a recurring expense</label>
                           </div>
                           {watch("info.isRecurring") && (
                              <div className="mt-4 pl-6 border-l-2 border-primary">
                                 <label className="text-sm font-medium mb-2 block">Frequency</label>
                                 <select {...register("info.recurringFrequency")} className="flex h-10 w-[200px] rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                   <option value="Monthly">Monthly</option>
                                   <option value="Quarterly">Quarterly</option>
                                   <option value="Yearly">Yearly</option>
                                 </select>
                              </div>
                           )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary" /> Expense Amount</h3>
                        <p className="text-sm text-muted-foreground">Enter the financial breakdown.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 pt-4 max-w-md">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subtotal (₹) *</label>
                          <Input type="number" {...register("amount.subtotal", { valueAsNumber: true })} className="bg-muted/50 font-mono text-lg" />
                          {errors.amount?.subtotal && <p className="text-xs text-destructive">{errors.amount.subtotal.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">GST Amount (₹)</label>
                          <Input type="number" {...register("amount.gstAmount", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Discount (₹)</label>
                          <Input type="number" {...register("amount.discount", { valueAsNumber: true })} className="bg-muted/50 font-mono text-destructive" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" /> Payment Details</h3>
                        <p className="text-sm text-muted-foreground">Record any upfront payments made for this expense.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 pt-4 max-w-md">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Due Date *</label>
                          <Input type="date" {...register("payment.dueDate")} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount Already Paid (₹)</label>
                          <Input type="number" {...register("payment.paidAmount", { valueAsNumber: true })} className="bg-muted/50 font-mono text-lg" />
                        </div>
                        {paidAmount > 0 && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Payment Mode</label>
                              <select {...register("payment.method")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                                <option value="UPI">UPI</option>
                                <option value="Corporate Card">Corporate Credit Card</option>
                                <option value="Cash">Cash</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Transaction Reference</label>
                              <Input {...register("payment.referenceId")} placeholder="e.g. UTR / Cheque No." className="bg-muted/50 font-mono" />
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary" /> Attachments</h3>
                        <p className="text-sm text-muted-foreground">Upload bills, receipts, or invoices.</p>
                      </div>
                      <div className="pt-4">
                         <div className="border-2 border-dashed border-border/60 rounded-xl p-12 flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer group">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                               <UploadCloud className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="text-sm font-medium mb-1">Click to upload or drag and drop</h4>
                            <p className="text-xs text-muted-foreground text-center max-w-[250px]">
                               SVG, PNG, JPG or PDF (max. 10MB)
                            </p>
                         </div>
                         <p className="text-xs text-muted-foreground mt-4 italic text-center">
                           (Uploads are mocked in this environment)
                         </p>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1 flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-medium">Review & Submit</h3>
                      </div>
                      <p className="text-sm text-muted-foreground -mt-4">Ensure all details are correct before sending for approval.</p>
                      
                      <div className="bg-muted/20 p-6 rounded-xl border border-border/50 space-y-6">
                         <div>
                           <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Information</h4>
                           <div className="space-y-3">
                             <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Title:</span><span className="text-sm font-medium">{watch("info.title")}</span></div>
                             <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Vendor:</span><span className="text-sm font-medium">{watch("info.vendor")}</span></div>
                             <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Category:</span><span className="text-sm font-medium">{watch("info.category")}</span></div>
                           </div>
                         </div>

                         <div>
                           <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Financials</h4>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Subtotal:</span><span className="text-sm font-medium font-mono">{formatCurrency(a.subtotal || 0)}</span></div>
                             <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">GST:</span><span className="text-sm font-medium font-mono">{formatCurrency(a.gstAmount || 0)}</span></div>
                             <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Grand Total:</span><span className="text-sm font-bold font-mono">{formatCurrency(totalAmount)}</span></div>
                           </div>
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
                    {createMutation.isPending ? "Submitting..." : "Submit Expense"}
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
              <h3 className="font-semibold flex items-center gap-2 mb-6"><FileText className="h-4 w-4 text-primary" /> Expense Draft</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatCurrency(a.subtotal || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="font-mono">{formatCurrency(a.gstAmount || 0)}</span></div>
                {a.discount > 0 && <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount</span><span className="font-mono">-{formatCurrency(a.discount || 0)}</span></div>}
                
                <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-base mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatCurrency(totalAmount)}</span>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex justify-between text-emerald-600 font-medium"><span>Paid</span><span className="font-mono">{formatCurrency(paidAmount)}</span></div>
                  <div className="flex justify-between text-destructive font-medium mt-1"><span>Balance Due</span><span className="font-mono">{formatCurrency(outstanding)}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
