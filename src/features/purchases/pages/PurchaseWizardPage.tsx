import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { PURCHASE_PAYMENT_TERMS, PURCHASE_PAYMENT_METHODS, PURCHASE_WAREHOUSES, SUPPLIERS } from "@/constants/staticDropdowns";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPurchaseWizardSchema, CreatePurchaseWizardForm } from "../schemas";
import { useCreatePurchase, usePurchase, useUpdatePurchase } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save, IndianRupee, Building, Truck, Banknote, Package, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { formatCurrency } from "@/utils/formatters";

const steps = [
  { id: "supplier", title: "Supplier" },
  { id: "items", title: "Products" },
  { id: "pricing", title: "Pricing" },
  { id: "payment", title: "Payment" },
  { id: "delivery", title: "Delivery" },
  { id: "review", title: "Review" },
];

export function PurchaseWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { purchaseId } = useParams({ strict: false });
  const { data: purchase, isLoading: isPurchaseLoading } = usePurchase(purchaseId as string);
  const createMutation = useCreatePurchase();
  const updateMutation = useUpdatePurchase();

  const isEditMode = !!purchaseId;

  const form = useForm<CreatePurchaseWizardForm>({
    resolver: zodResolver(createPurchaseWizardSchema) as any,
    defaultValues: {
      supplier: { supplierId: "" },
      items: [
        { make: "", model: "", variant: "", color: "", quantityOrdered: 1, unitCost: 0 }
      ],
      pricing: { discount: 0, gstAmount: 0, transportation: 0, insurance: 0, otherCharges: 0 },
      payment: { terms: "Net 30", advancePayment: 0, method: "Bank Transfer" },
      delivery: { expectedDeliveryDate: new Date().toISOString().split('T')[0], warehouse: "Main Warehouse", notes: "" },
    },
    mode: "onChange",
  });

  const { register, control, handleSubmit, formState: { errors }, trigger, watch, reset } = form;

  useEffect(() => {
    if (!purchase) return;
    reset({
      supplier: {
        supplierId: purchase.supplierId ?? "",
      },
      items: purchase.items?.map(item => ({
        make: item.make ?? "",
        model: item.model ?? "",
        variant: item.variant ?? "",
        color: item.color ?? "",
        quantityOrdered: item.quantityOrdered ?? 1,
        unitCost: item.unitCost ?? 0,
      })) ?? [{ make: "", model: "", variant: "", color: "", quantityOrdered: 1, unitCost: 0 }],
      pricing: {
        discount: purchase.discount ?? 0,
        gstAmount: purchase.gstAmount ?? 0,
        transportation: purchase.transportation ?? 0,
        insurance: purchase.insurance ?? 0,
        otherCharges: purchase.otherCharges ?? 0,
      },
      payment: {
        terms: purchase.paymentTerms ?? "Net 30",
        advancePayment: purchase.amountPaid ?? 0,
        method: purchase.payments?.[0]?.method ?? "Bank Transfer",
        referenceId: purchase.payments?.[0]?.referenceId ?? "",
      },
      delivery: {
        expectedDeliveryDate: purchase.expectedDelivery ? purchase.expectedDelivery.split('T')[0] : new Date().toISOString().split('T')[0],
        warehouse: purchase.warehouse ?? "Main Warehouse",
        notes: purchase.deliveryNotes ?? "",
      },
    });
  }, [purchase, reset]);
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Live Pricing Calculation
  const itemsWatch = watch("items");
  const pricingWatch = watch("pricing");
  
  const baseSubtotal = itemsWatch.reduce((sum, item) => sum + ((item.quantityOrdered || 0) * (item.unitCost || 0)), 0);
  const grandTotal = baseSubtotal - (pricingWatch.discount || 0) + (pricingWatch.gstAmount || 0) + (pricingWatch.transportation || 0) + (pricingWatch.insurance || 0) + (pricingWatch.otherCharges || 0);

  const advancePayment = watch("payment.advancePayment") || 0;
  const outstanding = Math.max(0, grandTotal - advancePayment);
  
  const handleNext = async () => {
    const stepIds = ["supplier", "items", "pricing", "payment", "delivery", "review"] as const;
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
      updateMutation.mutate({ id: purchaseId as string, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isPurchaseLoading && !purchase) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading PO details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title={isEditMode ? "Edit Purchase Order" : "Create Purchase Order"} 
        description={isEditMode ? "Update details of the vehicle purchase order record." : "Draft a new procurement order for vehicles or parts."}
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/purchases" })}>
            Cancel
          </Button>
        }
      />

      {/* Stepper Header */}
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
                        <h3 className="text-lg font-medium flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Select Supplier</h3>
                        <p className="text-sm text-muted-foreground">Choose the manufacturer or vendor.</p>
                      </div>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Supplier *</label>
                          <select {...register("supplier.supplierId")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="">Select a supplier...</option>
                            {SUPPLIERS.map(sup => (
                              <option key={sup.value} value={sup.value}>{sup.label} ({sup.contactPerson})</option>
                            ))}
                          </select>
                          {errors.supplier?.supplierId && <p className="text-xs text-destructive">{errors.supplier.supplierId.message}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Order Items</h3>
                          <p className="text-sm text-muted-foreground">Add vehicles to this purchase order.</p>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => append({ make: "", model: "", variant: "", color: "", quantityOrdered: 1, unitCost: 0 })}
                        >
                          <Plus className="h-4 w-4 mr-2"/> Add Line Item
                        </Button>
                      </div>
                      
                      <div className="space-y-6 pt-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-xl bg-muted/10 relative group">
                            {index > 0 && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-2 top-2 h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-4">Item {index + 1}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium">Make</label>
                                <Input {...register(`items.${index}.make` as const)} placeholder="e.g. Honda" className="h-9 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">Model</label>
                                <Input {...register(`items.${index}.model` as const)} placeholder="e.g. CB350" className="h-9 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">Variant</label>
                                <Input {...register(`items.${index}.variant` as const)} placeholder="e.g. DLX" className="h-9 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">Color</label>
                                <Input {...register(`items.${index}.color` as const)} placeholder="e.g. Matte Black" className="h-9 text-sm" />
                              </div>
                              <div className="space-y-2 sm:col-span-2">
                                <label className="text-xs font-medium">Quantity</label>
                                <Input type="number" {...register(`items.${index}.quantityOrdered` as const, { valueAsNumber: true })} className="h-9 text-sm" />
                              </div>
                              <div className="space-y-2 sm:col-span-2">
                                <label className="text-xs font-medium">Unit Cost (₹)</label>
                                <Input type="number" {...register(`items.${index}.unitCost` as const, { valueAsNumber: true })} className="h-9 text-sm font-mono" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary" /> Pricing Overrides</h3>
                        <p className="text-sm text-muted-foreground">Add taxes and transport overhead to calculate OTR cost.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">GST Amount (₹)</label>
                          <Input type="number" {...register("pricing.gstAmount", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Transportation (₹)</label>
                          <Input type="number" {...register("pricing.transportation", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Transit Insurance (₹)</label>
                          <Input type="number" {...register("pricing.insurance", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Other Charges (₹)</label>
                          <Input type="number" {...register("pricing.otherCharges", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2 sm:col-span-2 border-t pt-4">
                          <label className="text-sm font-medium text-destructive">Bulk Discount (₹)</label>
                          <Input type="number" {...register("pricing.discount", { valueAsNumber: true })} className="bg-destructive/5 font-mono text-destructive" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" /> Payment Terms</h3>
                        <p className="text-sm text-muted-foreground">Configure payment schedules and advances.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium">Payment Terms *</label>
                          <select {...register("payment.terms")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {PURCHASE_PAYMENT_TERMS.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Advance Payment (₹)</label>
                          <Input type="number" {...register("payment.advancePayment", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Method</label>
                          <select {...register("payment.method")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {PURCHASE_PAYMENT_METHODS.map((m) => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Delivery Logistics</h3>
                        <p className="text-sm text-muted-foreground">Where and when to expect this shipment.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Destination Warehouse *</label>
                          <select {...register("delivery.warehouse")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {PURCHASE_WAREHOUSES.map((w) => (
                              <option key={w.value} value={w.value}>{w.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Expected Arrival Date *</label>
                          <Input type="date" {...register("delivery.expectedDeliveryDate")} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium">Transport Instructions</label>
                          <textarea {...register("delivery.notes")} className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="e.g. Unload at Gate 2"></textarea>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1 flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-medium">Review Order</h3>
                      </div>
                      <p className="text-sm text-muted-foreground -mt-4">Finalize the purchase order before sending to supplier.</p>
                      
                      <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Supplier</h4>
                         <div className="space-y-2 mb-6">
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Supplier ID:</span><span className="text-sm font-medium">{watch("supplier.supplierId")}</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Expected Arrival:</span><span className="text-sm font-medium">{watch("delivery.expectedDeliveryDate")}</span></div>
                         </div>
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-t border-border/50 pt-4">Procurement Totals</h4>
                         <div className="space-y-2">
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Items:</span><span className="text-sm font-medium">{itemsWatch.length} Line Items</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">PO Value:</span><span className="text-sm font-medium font-mono">{formatCurrency(grandTotal)}</span></div>
                           <div className="flex justify-between items-center pt-2 border-t border-border/50"><span className="text-sm font-medium">Balance Payable:</span><span className="text-sm font-bold font-mono text-destructive">{formatCurrency(outstanding)}</span></div>
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
                    {createMutation.isPending || updateMutation.isPending ? "Processing..." : (isEditMode ? "Update Purchase Order" : "Place Order")}
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
              <h3 className="font-semibold flex items-center gap-2 mb-6"><IndianRupee className="h-4 w-4 text-primary" /> Order Totals</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Items Subtotal</span><span className="font-mono">{formatCurrency(baseSubtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST Amount</span><span className="font-mono">{formatCurrency(watch("pricing.gstAmount") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span className="font-mono">{formatCurrency(watch("pricing.transportation") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span className="font-mono">{formatCurrency(watch("pricing.insurance") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Other Charges</span><span className="font-mono">{formatCurrency(watch("pricing.otherCharges") || 0)}</span></div>
                <div className="flex justify-between text-destructive"><span className="text-destructive/80">Bulk Discount</span><span className="font-mono">-{formatCurrency(watch("pricing.discount") || 0)}</span></div>
                
                <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-base mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatCurrency(grandTotal)}</span>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex justify-between text-emerald-600 font-medium"><span>Advance Paid</span><span className="font-mono">{formatCurrency(advancePayment)}</span></div>
                  <div className="flex justify-between text-destructive font-medium mt-1"><span>Balance</span><span className="font-mono">{formatCurrency(outstanding)}</span></div>
                </div>

                <div className="mt-4 p-3 bg-card rounded border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Terms</p>
                  <p className="font-medium text-xs">{watch("payment.terms") || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
