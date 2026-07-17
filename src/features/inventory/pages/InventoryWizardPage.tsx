import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInventoryWizardSchema, CreateInventoryWizardForm } from "../schemas";
import { useReceiveInventory } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save, Truck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const steps = [
  { id: "supplier", title: "Supplier" },
  { id: "vehicle", title: "Vehicle" },
  { id: "pricing", title: "Pricing" },
  { id: "location", title: "Location" },
  { id: "review", title: "Review" },
];

export function InventoryWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const receiveMutation = useReceiveInventory();

  const form = useForm<CreateInventoryWizardForm>({
    resolver: zodResolver(createInventoryWizardSchema) as any,
    defaultValues: {
      supplierInfo: { supplier: "", purchaseOrderNumber: "", purchaseDate: new Date().toISOString().split('T')[0], invoiceNumber: "" },
      vehicleInfo: { make: "", model: "", variant: "", color: "", vin: "", engineNumber: "", chassisNumber: "", manufacturingYear: new Date().getFullYear(), fuelType: "Petrol", transmission: "Manual" },
      pricing: { purchaseCost: 0, mrp: 0, sellingPrice: 0 },
      locationInfo: { location: "Warehouse", rackOrBin: "", storageNotes: "" }
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch } = form;

  const handleNext = async () => {
    const stepIds = ["supplierInfo", "vehicleInfo", "pricing", "locationInfo", "review"] as const;
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
    receiveMutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title="Receive Inventory" 
        description="Add a new vehicle to the showroom stock."
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/inventory" })}>
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

      <Card className="overflow-hidden shadow-soft border-border/50">
        <CardContent className="p-0">
          <div className="p-6 sm:p-10 min-h-[400px] relative">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Supplier & Purchase</h3>
                    <p className="text-sm text-muted-foreground">Log the source of the incoming vehicle.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supplier Name *</label>
                      <Input {...register("supplierInfo.supplier")} placeholder="e.g. Metro Motors Wholesale" className="bg-muted/50" />
                      {errors.supplierInfo?.supplier && <p className="text-xs text-destructive">{errors.supplierInfo.supplier.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Purchase Order *</label>
                      <Input {...register("supplierInfo.purchaseOrderNumber")} placeholder="PO-2026-..." className="bg-muted/50" />
                      {errors.supplierInfo?.purchaseOrderNumber && <p className="text-xs text-destructive">{errors.supplierInfo.purchaseOrderNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Invoice Number *</label>
                      <Input {...register("supplierInfo.invoiceNumber")} placeholder="INV-S-..." className="bg-muted/50" />
                      {errors.supplierInfo?.invoiceNumber && <p className="text-xs text-destructive">{errors.supplierInfo.invoiceNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Purchase Date *</label>
                      <Input type="date" {...register("supplierInfo.purchaseDate")} className="bg-muted/50" />
                      {errors.supplierInfo?.purchaseDate && <p className="text-xs text-destructive">{errors.supplierInfo.purchaseDate.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Vehicle Information</h3>
                    <p className="text-sm text-muted-foreground">Specifics about the unit being received.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Make *</label>
                      <Input {...register("vehicleInfo.make")} placeholder="Royal Enfield" className="bg-muted/50" />
                      {errors.vehicleInfo?.make && <p className="text-xs text-destructive">{errors.vehicleInfo.make.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Model *</label>
                      <Input {...register("vehicleInfo.model")} placeholder="Classic 350" className="bg-muted/50" />
                      {errors.vehicleInfo?.model && <p className="text-xs text-destructive">{errors.vehicleInfo.model.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Variant *</label>
                      <Input {...register("vehicleInfo.variant")} placeholder="Dark Stealth" className="bg-muted/50" />
                      {errors.vehicleInfo?.variant && <p className="text-xs text-destructive">{errors.vehicleInfo.variant.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Color *</label>
                      <Input {...register("vehicleInfo.color")} placeholder="Matte Black" className="bg-muted/50" />
                      {errors.vehicleInfo?.color && <p className="text-xs text-destructive">{errors.vehicleInfo.color.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fuel Type</label>
                      <select {...register("vehicleInfo.fuelType")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transmission</label>
                      <select {...register("vehicleInfo.transmission")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    <div className="space-y-2 sm:col-span-3">
                      <label className="text-sm font-medium">VIN (Vehicle Identification Number) *</label>
                      <Input {...register("vehicleInfo.vin")} placeholder="17-character VIN" className="bg-muted/50 uppercase font-mono" maxLength={17} />
                      {errors.vehicleInfo?.vin && <p className="text-xs text-destructive">{errors.vehicleInfo.vin.message}</p>}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium">Engine Number *</label>
                      <Input {...register("vehicleInfo.engineNumber")} placeholder="E..." className="bg-muted/50 font-mono uppercase" />
                      {errors.vehicleInfo?.engineNumber && <p className="text-xs text-destructive">{errors.vehicleInfo.engineNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Manufacturing Year</label>
                      <Input type="number" {...register("vehicleInfo.manufacturingYear", { valueAsNumber: true })} className="bg-muted/50" />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Financial Details</h3>
                    <p className="text-sm text-muted-foreground">Costs, margins, and selling price.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Purchase Cost (₹) *</label>
                      <Input type="number" {...register("pricing.purchaseCost", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                      {errors.pricing?.purchaseCost && <p className="text-xs text-destructive">{errors.pricing.purchaseCost.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GST Amount (₹)</label>
                      <Input type="number" {...register("pricing.gstAmount", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Selling Price (₹) *</label>
                      <Input type="number" {...register("pricing.sellingPrice", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                      {errors.pricing?.sellingPrice && <p className="text-xs text-destructive">{errors.pricing.sellingPrice.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">MRP (₹) *</label>
                      <Input type="number" {...register("pricing.mrp", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                      {errors.pricing?.mrp && <p className="text-xs text-destructive">{errors.pricing.mrp.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Road Tax (₹)</label>
                      <Input type="number" {...register("pricing.roadTax", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Accessories Installed (₹)</label>
                      <Input type="number" {...register("pricing.accessoriesCost", { valueAsNumber: true })} className="bg-muted/50 font-mono" />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Physical Location</h3>
                    <p className="text-sm text-muted-foreground">Where is this vehicle being stored?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Location *</label>
                      <select {...register("locationInfo.location")} className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="Warehouse">Warehouse</option>
                        <option value="Showroom">Showroom (Display)</option>
                        <option value="Branch">Branch Location</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rack / Bin Indicator</label>
                      <Input {...register("locationInfo.rackOrBin")} placeholder="e.g. ROW-4-A" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium">Storage Notes</label>
                      <textarea {...register("locationInfo.storageNotes")} className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Any scratches? Display notes?"></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Review & Receive</h3>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-4">Verify the vehicle details before committing to stock ledger.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl border border-border/50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Vehicle</h4>
                        <p className="text-sm font-medium">{watch("vehicleInfo.make")} {watch("vehicleInfo.model")} {watch("vehicleInfo.variant")}</p>
                        <p className="text-sm text-muted-foreground">{watch("vehicleInfo.color")} • {watch("vehicleInfo.transmission")}</p>
                        <p className="text-sm text-muted-foreground mt-1">VIN: <span className="font-mono text-foreground uppercase">{watch("vehicleInfo.vin") || "N/A"}</span></p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</h4>
                        <p className="text-sm text-muted-foreground">{watch("locationInfo.location")} <span className="font-mono">({watch("locationInfo.rackOrBin") || "No Rack"})</span></p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Purchase</h4>
                        <p className="text-sm text-muted-foreground">Supplier: <span className="text-foreground">{watch("supplierInfo.supplier")}</span></p>
                        <p className="text-sm text-muted-foreground">Invoice: <span className="font-mono text-foreground">{watch("supplierInfo.invoiceNumber")}</span></p>
                        <p className="text-sm text-muted-foreground mt-1">Cost: <span className="text-foreground font-mono">₹{watch("pricing.purchaseCost")?.toLocaleString()}</span></p>
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
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleSubmit((d) => onSubmit(d))} disabled={receiveMutation.isPending} className="shadow-sm hidden sm:flex">
                  Receive & Add Another
                </Button>
                <Button onClick={handleSubmit((d) => onSubmit(d))} disabled={receiveMutation.isPending} className="shadow-sm">
                  {receiveMutation.isPending ? "Receiving..." : "Receive to Stock"}
                  {!receiveMutation.isPending && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
