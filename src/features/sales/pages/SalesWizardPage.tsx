import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSaleWizardSchema, CreateSaleWizardForm } from "../schemas";
import { useCreateSale, useSale, useUpdateSale } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save, IndianRupee, Users, Truck, Banknote, Shield, Package } from "lucide-react";
import { useNavigate, Link, useParams } from "@tanstack/react-router";
import { formatCurrency } from "@/utils/formatters";
import { useCustomers, useCustomer } from "../../customers/hooks";
import { useInventory } from "../../inventory/hooks";

const steps = [
  { id: "customer", title: "Customer" },
  { id: "vehicle", title: "Vehicle" },
  { id: "pricing", title: "Pricing" },
  { id: "payment", title: "Payment" },
  { id: "finance", title: "Finance" },
  { id: "delivery", title: "Delivery" },
  { id: "review", title: "Review" },
];

export function SalesWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { saleId } = useParams({ strict: false });
  const { data: sale, isLoading: isSaleLoading } = useSale(saleId as string);
  const createMutation = useCreateSale();
  const updateMutation = useUpdateSale();
  const { data: inventory } = useInventory();
  const inventoryList = (inventory || []).filter(v => v.status === 'Available' || (sale && v.id === sale.inventoryId));

  const isEditMode = !!saleId;

  // Customer Search with Debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: customerSearchPage, isLoading: isCustomersLoading } = useCustomers({
    search: debouncedSearchTerm,
    limit: 10,
  });
  const customerSearchResults = customerSearchPage?.data ?? [];

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

  const form = useForm<CreateSaleWizardForm>({
    resolver: zodResolver(createSaleWizardSchema) as any,
    defaultValues: {
      customer: { customerId: "", isNewCustomer: false },
      vehicle: { inventoryId: "", reserveVehicle: true },
      pricing: { basePrice: 0, accessoriesPrice: 0, registrationTax: 0, roadTax: 0, insurance: 0, gstAmount: 0, discount: 0, exchangeBonus: 0 },
      payment: { method: "Bank Transfer", initialPaymentAmount: 0, referenceId: "" },
      finance: { required: false },
      delivery: { expectedDate: new Date().toISOString().split('T')[0], executive: "", notes: "" },
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue, reset } = form;

  useEffect(() => {
    if (!sale) return;
    reset({
      customer: {
        customerId: sale.customerId ?? "",
        isNewCustomer: false,
      },
      vehicle: {
        inventoryId: sale.inventoryId ?? "",
        reserveVehicle: true,
      },
      pricing: {
        basePrice: (sale.basePrice ?? 0) / 100,
        accessoriesPrice: (sale.accessoriesPrice ?? 0) / 100,
        registrationTax: (sale.registrationTax ?? 0) / 100,
        roadTax: (sale.roadTax ?? 0) / 100,
        insurance: (sale.insurance ?? 0) / 100,
        gstAmount: (sale.gstAmount ?? 0) / 100,
        discount: (sale.discount ?? 0) / 100,
        exchangeBonus: (sale.exchangeBonus ?? 0) / 100,
      },
      payment: {
        method: sale.payments?.[0]?.method ?? "Bank Transfer",
        initialPaymentAmount: (sale.payments?.[0]?.amount ?? 0) / 100,
        referenceId: sale.payments?.[0]?.referenceId ?? "",
      },
      finance: {
        required: sale.finance?.required ?? false,
        partner: sale.finance?.partner ?? "",
        loanAmount: (sale.finance?.loanAmount ?? 0) / 100,
        downPayment: (sale.finance?.downPayment ?? 0) / 100,
        interestRate: sale.finance?.interestRate ?? 0,
        tenureMonths: sale.finance?.tenureMonths ?? 0,
      },
      delivery: {
        expectedDate: sale.delivery?.expectedDate ? sale.delivery.expectedDate.split('T')[0] : new Date().toISOString().split('T')[0],
        executive: sale.delivery?.executive ?? "",
        notes: sale.delivery?.notes ?? "",
      },
    });
  }, [sale, reset]);

  // Live Pricing Calculation
  const pricing = watch("pricing");
  const grandTotal = (pricing.basePrice || 0) + (pricing.accessoriesPrice || 0) + (pricing.registrationTax || 0) + (pricing.roadTax || 0) + (pricing.insurance || 0) + (pricing.gstAmount || 0) - (pricing.discount || 0) - (pricing.exchangeBonus || 0);

  const paymentAmount = watch("payment.initialPaymentAmount") || 0;
  const outstanding = Math.max(0, grandTotal - paymentAmount);

  const selectedCustomerId = watch("customer.customerId");
  const selectedVehicleId = watch("vehicle.inventoryId");
  const { data: selectedCustomer } = useCustomer(selectedCustomerId);
  const selectedVehicle = inventoryList.find(v => v.id === selectedVehicleId);
  
  const financeRequired = watch("finance.required");

  // Auto-populate pricing based on selected vehicle
  useEffect(() => {
    if (selectedVehicle && !isEditMode) {
      setValue("pricing.basePrice", selectedVehicle.sellingPrice || 0, { shouldValidate: true });
      setValue("pricing.gstAmount", selectedVehicle.gstAmount || 0, { shouldValidate: true });
      setValue("pricing.roadTax", selectedVehicle.roadTax || 0, { shouldValidate: true });
      setValue("pricing.accessoriesPrice", selectedVehicle.accessoriesCost || 0, { shouldValidate: true });
    }
  }, [selectedVehicle, setValue, isEditMode]);

  // Sync loan amount to outstanding if finance is toggled
  useEffect(() => {
    if (financeRequired) {
      setValue("finance.loanAmount", outstanding, { shouldValidate: true });
    }
  }, [financeRequired, outstanding, setValue]);

  const handleNext = async () => {
    const stepIds = ["customer", "vehicle", "pricing", "payment", "finance", "delivery", "review"] as const;
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
      updateMutation.mutate({ id: saleId as string, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isSaleLoading && !sale) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading deal details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title={isEditMode ? "Edit Sale Details" : "Create Sale"} 
        description={isEditMode ? "Update details of the vehicle sale record." : "Process a new vehicle sale and generate a quotation or invoice."}
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/sales" })}>
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
                        <h3 className="text-lg font-medium flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Select Customer</h3>
                        <p className="text-sm text-muted-foreground">Link this sale to an existing customer profile.</p>
                      </div>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2 relative" ref={dropdownRef}>
                          <label className="text-sm font-medium">Customer Search *</label>
                          {selectedCustomerId && selectedCustomer && selectedCustomer.id ? (
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border/80 bg-primary/5 animate-in fade-in duration-200">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Phone: {selectedCustomer.phone} | Email: {selectedCustomer.email || "N/A"}
                                </p>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setValue("customer.customerId", "", { shouldValidate: true });
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
                                placeholder="Type name, email or phone to search..."
                                value={searchTerm}
                                onChange={(e) => {
                                  setSearchTerm(e.target.value);
                                  setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="bg-muted/50 pr-10"
                              />
                              {isCustomersLoading && (
                                <div className="absolute right-3 top-3">
                                  <svg className="animate-spin h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </div>
                              )}
                              
                              <AnimatePresence>
                                {isDropdownOpen && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border border-border/80 rounded-md shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1"
                                  >
                                    {customerSearchResults && customerSearchResults.length > 0 ? (
                                      <div className="py-1">
                                        {customerSearchResults.map((c: any) => (
                                          <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                              setValue("customer.customerId", c.id, { shouldValidate: true });
                                              setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col"
                                          >
                                            <span className="font-medium">{c.firstName} {c.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{c.phone} • {c.email}</span>
                                          </button>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                        {isCustomersLoading ? "Searching..." : "No customers found"}
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                          <input type="hidden" {...register("customer.customerId")} />
                          {errors.customer?.customerId && <p className="text-xs text-destructive">{errors.customer.customerId.message}</p>}
                        </div>
                        <div className="pt-4 flex items-center gap-4 border-t border-border/50">
                          <span className="text-sm text-muted-foreground">Or create a new customer?</span>
                          <Link to="/customers/new">
                            <Button variant="secondary" size="sm">Create New</Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Select Vehicle</h3>
                        <p className="text-sm text-muted-foreground">Choose a vehicle from the available showroom stock.</p>
                      </div>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Available Inventory *</label>
                          <select {...register("vehicle.inventoryId")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="">Select an available vehicle...</option>
                            {inventoryList.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.make} {v.model} - {v.variant} (VIN: {v.vin})
                              </option>
                            ))}
                          </select>
                          {errors.vehicle?.inventoryId && <p className="text-xs text-destructive">{errors.vehicle.inventoryId.message}</p>}
                        </div>
                        <div className="pt-4 flex items-center gap-2">
                          <input type="checkbox" id="reserve" {...register("vehicle.reserveVehicle")} className="rounded border-input text-primary focus:ring-primary" />
                          <label htmlFor="reserve" className="text-sm font-medium">Reserve this vehicle immediately from other executives</label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary" /> Pricing & Breakdown</h3>
                        <p className="text-sm text-muted-foreground">Configure the final OTR (On-Road) price.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ex-Showroom Price (₹) *</label>
                          <Input type="number" {...register("pricing.basePrice")} className="bg-muted/50 font-mono" />
                          {errors.pricing?.basePrice && <p className="text-xs text-destructive">{errors.pricing.basePrice.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Accessories (₹)</label>
                          <Input type="number" {...register("pricing.accessoriesPrice")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">RTO / Registration (₹)</label>
                          <Input type="number" {...register("pricing.registrationTax")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Insurance (₹)</label>
                          <Input type="number" {...register("pricing.insurance")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">GST Amount (₹) *</label>
                          <Input type="number" {...register("pricing.gstAmount")} className="bg-muted/50 font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-destructive">Discount (₹)</label>
                          <Input type="number" {...register("pricing.discount")} className="bg-destructive/5 font-mono text-destructive" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" /> Payment details</h3>
                        <p className="text-sm text-muted-foreground">Record the initial booking amount or full payment.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium">Payment Method *</label>
                          <select {...register("payment.method")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Finance">Finance (Loan)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Initial Payment Amount (₹) *</label>
                          <Input type="number" {...register("payment.initialPaymentAmount", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                          {errors.payment?.initialPaymentAmount && <p className="text-xs text-destructive">{errors.payment.initialPaymentAmount.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reference ID / UTR</label>
                          <Input {...register("payment.referenceId")} placeholder="e.g. UTR-12345" className="bg-muted/50 font-mono" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Finance details</h3>
                          <p className="text-sm text-muted-foreground">Is the customer applying for a vehicle loan?</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="financeReq" className="text-sm font-medium">Finance Required</label>
                          <input type="checkbox" id="financeReq" {...register("finance.required")} className="w-4 h-4 rounded text-primary" />
                        </div>
                      </div>
                      
                      {financeRequired ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 animate-in fade-in zoom-in-95 duration-200">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Finance Partner</label>
                            <select {...register("finance.partner")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                              <option value="HDFC Bank">HDFC Bank</option>
                              <option value="ICICI Bank">ICICI Bank</option>
                              <option value="IDFC First">IDFC First</option>
                              <option value="Bajaj Finance">Bajaj Finance</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Loan Amount (₹)</label>
                            <Input type="number" {...register("finance.loanAmount", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Interest Rate (%)</label>
                            <Input type="number" {...register("finance.interestRate", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tenure (Months)</label>
                            <Input type="number" {...register("finance.tenureMonths", { valueAsNumber: true })} className="bg-muted/50" />
                          </div>
                        </div>
                      ) : (
                        <div className="py-10 text-center border rounded-lg border-dashed bg-muted/10 text-muted-foreground">
                          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No finance required for this sale.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Delivery Schedule</h3>
                        <p className="text-sm text-muted-foreground">Assign handover timeline and executive.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Expected Delivery Date *</label>
                          <Input type="date" {...register("delivery.expectedDate")} className="bg-muted/50" />
                          {errors.delivery?.expectedDate && <p className="text-xs text-destructive">{errors.delivery.expectedDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Assigned Executive *</label>
                          <select {...register("delivery.executive")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="">Select executive...</option>
                            <option value="Rajesh Kumar">Rajesh Kumar</option>
                            <option value="Priya Singh">Priya Singh</option>
                            <option value="Amit Patel">Amit Patel</option>
                          </select>
                          {errors.delivery?.executive && <p className="text-xs text-destructive">{errors.delivery.executive.message}</p>}
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium">Delivery Notes / Special Requests</label>
                          <textarea {...register("delivery.notes")} className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="e.g. Must install accessories before handover"></textarea>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 6 && (
                    <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-1 flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-medium">Review & Commit</h3>
                      </div>
                      <p className="text-sm text-muted-foreground -mt-4">Finalize the deal parameters to generate invoice.</p>
                      
                      <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Sale Summary</h4>
                         <div className="space-y-2 mb-6">
                            <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Customer:</span><span className="text-sm font-medium">{selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : (selectedCustomerId || "None")}</span></div>
                            <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Vehicle:</span><span className="text-sm font-medium font-mono">{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} - ${selectedVehicle.variant}` : (selectedVehicleId || "None")}</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Expected Delivery:</span><span className="text-sm font-medium">{watch("delivery.expectedDate")}</span></div>
                         </div>
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-t border-border/50 pt-4">Financials</h4>
                         <div className="space-y-2">
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Grand Total:</span><span className="text-sm font-medium font-mono">{formatCurrency(grandTotal)}</span></div>
                           <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Initial Payment:</span><span className="text-sm font-medium font-mono text-emerald-600">{formatCurrency(paymentAmount)}</span></div>
                           <div className="flex justify-between items-center pt-2 border-t border-border/50"><span className="text-sm font-medium">Outstanding Balance:</span><span className="text-sm font-bold font-mono text-destructive">{formatCurrency(outstanding)}</span></div>
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
                    {createMutation.isPending || updateMutation.isPending ? "Processing..." : (isEditMode ? "Update Deal Details" : "Confirm & Generate Invoice")}
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
              <h3 className="font-semibold flex items-center gap-2 mb-6"><IndianRupee className="h-4 w-4 text-primary" /> Live Pricing</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span className="font-mono">{formatCurrency(watch("pricing.basePrice") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Accessories</span><span className="font-mono">{formatCurrency(watch("pricing.accessoriesPrice") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">RTO / Reg</span><span className="font-mono">{formatCurrency(watch("pricing.registrationTax") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span className="font-mono">{formatCurrency(watch("pricing.insurance") || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST Amount</span><span className="font-mono">{formatCurrency(watch("pricing.gstAmount") || 0)}</span></div>
                <div className="flex justify-between text-destructive"><span className="text-destructive/80">Discount</span><span className="font-mono">-{formatCurrency(watch("pricing.discount") || 0)}</span></div>
                <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-base mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatCurrency(grandTotal)}</span>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex justify-between text-emerald-600 font-medium"><span>Paid</span><span className="font-mono">{formatCurrency(paymentAmount)}</span></div>
                  <div className="flex justify-between text-destructive font-medium mt-1"><span>Balance</span><span className="font-mono">{formatCurrency(outstanding)}</span></div>
                </div>

                {financeRequired && (
                  <div className="mt-4 p-3 bg-card rounded border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Finance Loan</p>
                    <div className="flex justify-between"><span className="text-muted-foreground text-xs">Amount</span><span className="font-mono text-xs">{formatCurrency(watch("finance.loanAmount") || 0)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground text-xs">Partner</span><span className="font-medium text-xs">{watch("finance.partner") || "N/A"}</span></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
