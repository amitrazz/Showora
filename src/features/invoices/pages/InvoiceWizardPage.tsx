import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceWizardSchema, CreateInvoiceWizardForm } from "../schemas";
import { useCreateInvoice, useInvoice, useUpdateInvoice } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save, IndianRupee, Banknote, Search, Calendar, User, FileText } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { formatCurrency } from "@/utils/formatters";
import { useSales } from "../../sales/hooks";

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
  const { invoiceId } = useParams({ strict: false });
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId as string);
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  const { data: salesList } = useSales();
  const sales = salesList || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEditMode = !!invoiceId;

  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialSaleId = queryParams?.get('saleId') || "";

  const form = useForm<CreateInvoiceWizardForm>({
    resolver: zodResolver(createInvoiceWizardSchema) as any,
    defaultValues: {
      sale: { saleId: initialSaleId },
      metadata: { invoiceDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], salesExecutive: "Rajesh Kumar", branch: "Downtown Main Showroom" },
      pricing: { basePrice: 0, accessoriesPrice: 0, registrationTax: 0, insurance: 0, otherCharges: 0, discount: 0, gstRate: 28 },
      payment: { amountPaid: 0, method: "Bank Transfer" },
    },
    mode: "onChange",
  });

  const { register, trigger, watch, handleSubmit, setValue, formState: { errors }, reset } = form;

  const selectedSaleId = watch("sale.saleId");
  const selectedSale = sales.find(s => s.invoiceNumber === selectedSaleId || s.id === selectedSaleId);

  const filteredSales = sales.filter(s => 
    s && 
    ((s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!invoice) return;
    reset({
      sale: {
        saleId: invoice.saleId ?? "",
      },
      metadata: {
        invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        salesExecutive: invoice.salesExecutive ?? "Rajesh Kumar",
        branch: invoice.branch ?? "Downtown Main Showroom",
      },
      pricing: {
        basePrice: (invoice.basePrice ?? 0) / 100,
        accessoriesPrice: (invoice.accessoriesPrice ?? 0) / 100,
        registrationTax: (invoice.registrationTax ?? 0) / 100,
        insurance: (invoice.insurance ?? 0) / 100,
        otherCharges: (invoice.otherCharges ?? 0) / 100,
        discount: (invoice.discount ?? 0) / 100,
        gstRate: ((invoice.cgstRate || 0) + (invoice.sgstRate || 0)) as any || 28,
      },
      payment: {
        amountPaid: (invoice.amountPaid ?? 0) / 100,
        method: (invoice.payments?.[0]?.method as any) ?? "Bank Transfer",
        referenceId: invoice.payments?.[0]?.referenceId ?? "",
      },
    });
  }, [invoice, reset]);

  useEffect(() => {
    if (initialSaleId && !isEditMode) {
      setValue("sale.saleId", initialSaleId, { shouldValidate: true });
    }
  }, [initialSaleId, isEditMode, setValue]);

  useEffect(() => {
    if (selectedSale && !isEditMode) {
      setValue("metadata.salesExecutive", selectedSale.salesExecutive || "", { shouldValidate: true });
      setValue("metadata.branch", selectedSale.branch || "", { shouldValidate: true });
      setValue("pricing.basePrice", (selectedSale.basePrice || 0) / 100, { shouldValidate: true });
      setValue("pricing.accessoriesPrice", (selectedSale.accessoriesPrice || 0) / 100, { shouldValidate: true });
      setValue("pricing.registrationTax", (selectedSale.registrationTax || 0) / 100, { shouldValidate: true });
      setValue("pricing.insurance", (selectedSale.insurance || 0) / 100, { shouldValidate: true });
      setValue("pricing.discount", (selectedSale.discount || 0) / 100, { shouldValidate: true });
      setValue("payment.amountPaid", (selectedSale.totalPaid || 0) / 100, { shouldValidate: true });
      
      const basePriceRupees = (selectedSale.basePrice || 0) / 100;
      const discountRupees = (selectedSale.discount || 0) / 100;
      const gstAmountRupees = (selectedSale.gstAmount || 0) / 100;
      const calculatedGstRate = basePriceRupees > 0 ? Math.round((gstAmountRupees / (basePriceRupees - discountRupees)) * 100) : 28;
      setValue("pricing.gstRate", calculatedGstRate === 18 ? 18 : 28, { shouldValidate: true });
    }
  }, [selectedSale, setValue, isEditMode]);
  
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
    if (isEditMode) {
      updateMutation.mutate({ id: invoiceId as string, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isInvoiceLoading && !invoice) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title={isEditMode ? "Edit Invoice Details" : "Create Invoice"} 
        description={isEditMode ? "Update details of the generated vehicle invoice." : "Generate a new tax invoice linked to an active sales record."}
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
                        <div className="space-y-2 relative" ref={dropdownRef}>
                          <label className="text-sm font-medium">Sale ID / Reservation Number *</label>
                          {selectedSaleId && selectedSale ? (
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border/80 bg-primary/5 animate-in fade-in duration-200">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                  {selectedSale.invoiceNumber}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Customer: {selectedSale.customerName} | Vehicle: {selectedSale.vehicleMake} {selectedSale.vehicleModel}
                                </p>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setValue("sale.saleId", "", { shouldValidate: true });
                                  setSearchTerm("");
                                }}
                              >
                                Change
                              </Button>
                            </div>
                          ) : (
                            <div className="relative">
                              <Input 
                                type="text"
                                placeholder="Type Sale ID or Customer name to search..."
                                value={searchTerm}
                                onChange={(e) => {
                                  setSearchTerm(e.target.value);
                                  setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="bg-muted/50 pr-10"
                              />
                              <AnimatePresence>
                                {isDropdownOpen && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 w-full mt-1 bg-background/95 backdrop-blur-md border border-border/60 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-border/50 animate-in fade-in slide-in-from-top-1 overflow-hidden"
                                  >
                                    {filteredSales && filteredSales.length > 0 ? (
                                      <div className="py-1">
                                        {filteredSales.map((s: any) => (
                                          <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                              setValue("sale.saleId", s.invoiceNumber || s.id || "", { shouldValidate: true });
                                              setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-primary/5 active:bg-primary/10 transition-colors flex items-center justify-between group outline-none"
                                          >
                                            <div className="flex flex-col gap-0.5">
                                              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {s.invoiceNumber || `Sale #${s.id.slice(0, 8)}`}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                Customer: {s.customerName || "N/A"}
                                                {s.vehicleMake ? ` • ${s.vehicleMake} ${s.vehicleModel}` : ""}
                                              </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                          </button>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                                        No sales found
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                          <input type="hidden" {...register("sale.saleId")} />
                          {errors.sale?.saleId && <p className="text-xs text-destructive">{errors.sale.saleId.message}</p>}
                        </div>
                        <div className="p-4 rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground flex items-start gap-3">
                          <FileText className="h-5 w-5 mt-0.5 text-primary" />
                          <p>Selecting a Sale ID will automatically populate the entire pricing, customer, and vehicle inventory schema for you. You can still manually override any field in the next steps.</p>
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
                          <Input type="number" {...register("pricing.basePrice")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Accessories Total (₹)</label>
                          <Input type="number" {...register("pricing.accessoriesPrice")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2 border-l-2 pl-4 border-emerald-500/50 py-1">
                          <label className="text-sm font-medium">GST Rate (%)</label>
                          <select {...register("pricing.gstRate")} className="flex h-10 w-full rounded-md border border-input bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 focus-visible:outline-none">
                            <option value={28}>28% (Standard 2-Wheeler)</option>
                            <option value={18}>18% (EV/Sub-segment)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-destructive">Discount (₹)</label>
                          <Input type="number" {...register("pricing.discount")} className="bg-destructive/5 font-mono text-destructive" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 border-t pt-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-4">Non-Taxable Logistics & RTO</h4>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Registration & Road Tax (₹)</label>
                          <Input type="number" {...register("pricing.registrationTax")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Insurance Premium (₹)</label>
                          <Input type="number" {...register("pricing.insurance")} className="bg-muted/50 font-mono" />
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
                          <Input type="number" {...register("payment.amountPaid")} className="bg-muted/50 font-mono text-lg" />
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
                  <Button onClick={handleSubmit((d) => onSubmit(d))} disabled={createMutation.isPending || updateMutation.isPending} className="shadow-sm">
                    {createMutation.isPending || updateMutation.isPending ? "Processing..." : (isEditMode ? "Update Invoice Details" : "Generate Invoice")}
                    {!(createMutation.isPending || updateMutation.isPending) && <Save className="ml-2 h-4 w-4" />}
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
