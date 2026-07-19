import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerWizardSchema, CreateCustomerWizardForm } from "../schemas";
import { useCreateCustomer, useCustomer, useUpdateCustomer } from "../hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";

const steps = [
  { id: "basic", title: "Basic Info" },
  { id: "address", title: "Address" },
  { id: "identity", title: "Identity" },
  { id: "finance", title: "Finance" },
  { id: "additional", title: "Additional" },
  { id: "review", title: "Review" },
];

export function CustomerWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { customerId } = useParams({ strict: false });
  const { data: customer, isLoading } = useCustomer(customerId as string);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const isEditMode = !!customerId;
  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  console.log(customerId, "customerId")

  const form = useForm<CreateCustomerWizardForm>({
    resolver: zodResolver(createCustomerWizardSchema) as any,
    defaultValues: {
      basic: { firstName: "", lastName: "", phone: "", email: "", gender: "male" },
      address: { line1: "", city: "", state: "", pincode: "" },
      identity: { panNumber: "", aadharNumber: "", drivingLicense: "", gstNumber: "" },
      finance: { required: false },
      additional: { salesExecutive: "", tags: [] },
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, reset } = form;

  useEffect(() => {
    if (!customer) return;

    reset({
      basic: {
        firstName: customer.firstName ?? "",
        lastName: customer.lastName ?? "",
        phone: customer.phone ?? "",
        email: customer.email ?? "",
        gender: customer.gender ?? "other",
        dob: customer.dob ?? "",
      },

      address: {
        line1: customer.address?.line1 ?? "",
        city: customer.address?.city ?? "",
        state: customer.address?.state ?? "",
        pincode: customer.address?.pincode ?? "",
      },

      identity: {
        panNumber: customer.panNumber ?? "",
        aadharNumber: customer.aadharNumber ?? "",
        drivingLicense: customer.drivingLicense ?? "",
        gstNumber: customer.gstNumber ?? "",
      },

      finance: {
        required: customer.finance?.required ?? false,
        company: customer.finance?.company ?? "",
        loanAmount: customer.finance?.loanAmount ?? undefined,
        tenureMonths: customer.finance?.tenureMonths ?? undefined,
        emi: customer.finance?.emi ?? undefined,
      },

      additional: {
        salesExecutive: customer.salesExecutive ?? "",
        leadSource: customer.leadSource ?? "",
        internalNotes:
          customer.notes?.map((note) => note).join("\n") ?? "",
        tags: customer.tags ?? [],
      },
    });
  }, [customer, reset]);

  const handleNext = async () => {
    const stepIds = ["basic", "address", "identity", "finance", "additional", "review"] as const;
    const currentStepId = stepIds[currentStep];
    const isStepValid = currentStepId === "review" ? true : await trigger(currentStepId as any);

    if (isStepValid) {
      setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  const onSubmit = (data: CreateCustomerWizardForm) => {
    const onSuccess = () => {
      navigate({
        to: "/customers",
      });
    };

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: customerId!,
          data,
        },
        { onSuccess }
      );
    } else {
      createMutation.mutate(data, { onSuccess });
    }
  };

  const financeRequired = watch("finance.required");

  if (isEditMode && isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title={`${isEditMode ? `${customer.firstName} ${customer.lastName}` : "Create New Customer"}`}
        description={isEditMode ? `Updating ${customer.firstName + " " + customer.lastName} details.` : "Creating new customer."}
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/customers" })}>
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${isCompleted ? "bg-primary border-primary text-primary-foreground" :
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
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">Enter the primary contact details.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name *</label>
                      <Input {...register("basic.firstName")} placeholder="John" className="bg-muted/50" />
                      {errors.basic?.firstName && <p className="text-xs text-destructive">{errors.basic.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name *</label>
                      <Input {...register("basic.lastName")} placeholder="Doe" className="bg-muted/50" />
                      {errors.basic?.lastName && <p className="text-xs text-destructive">{errors.basic.lastName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date of Birth</label>
                      <Input type="date" {...register("basic.dob")} className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gender *</label>

                      <select
                        {...register("basic.gender")}
                        className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>

                      {errors.basic?.gender && (
                        <p className="text-xs text-destructive">
                          {errors.basic.gender.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number *</label>
                      <Input {...register("basic.phone")} placeholder="9876543210" className="bg-muted/50" />
                      {errors.basic?.phone && <p className="text-xs text-destructive">{errors.basic.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input {...register("basic.email")} placeholder="john@example.com" className="bg-muted/50" />
                      {errors.basic?.email && <p className="text-xs text-destructive">{errors.basic.email.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Address</h3>
                    <p className="text-sm text-muted-foreground">Where does the customer live?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address Line 1 *</label>
                      <Input {...register("address.line1")} placeholder="123 Main St" className="bg-muted/50" />
                      {errors.address?.line1 && <p className="text-xs text-destructive">{errors.address.line1.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City *</label>
                        <Input {...register("address.city")} placeholder="Mumbai" className="bg-muted/50" />
                        {errors.address?.city && <p className="text-xs text-destructive">{errors.address.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">State *</label>
                        <Input {...register("address.state")} placeholder="Maharashtra" className="bg-muted/50" />
                        {errors.address?.state && <p className="text-xs text-destructive">{errors.address.state.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pincode *</label>
                        <Input {...register("address.pincode")} placeholder="400001" className="bg-muted/50" />
                        {errors.address?.pincode && <p className="text-xs text-destructive">{errors.address.pincode.message}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Identity Documents</h3>
                    <p className="text-sm text-muted-foreground">KYC details for billing and finance.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PAN Number</label>
                      <Input {...register("identity.panNumber")} placeholder="ABCDE1234F" className="bg-muted/50 uppercase" />
                      {errors.identity?.panNumber && <p className="text-xs text-destructive">{errors.identity.panNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Aadhar Number</label>
                      <Input {...register("identity.aadharNumber")} placeholder="1234 5678 9012" className="bg-muted/50" />
                      {errors.identity?.aadharNumber && <p className="text-xs text-destructive">{errors.identity.aadharNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Driving License</label>
                      <Input {...register("identity.drivingLicense")} placeholder="MH12 20240000000" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gender</label>

                      <select
                        {...register("basic.gender")}
                        className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>

                      {errors.basic?.gender && (
                        <p className="text-xs text-destructive">
                          {errors.basic.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Finance Requirements</h3>
                    <p className="text-sm text-muted-foreground">Is the customer opting for a vehicle loan?</p>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-xl bg-muted/20">
                    <input type="checkbox" id="finance-req" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" {...register("finance.required")} />
                    <label htmlFor="finance-req" className="text-sm font-medium cursor-pointer">Yes, customer requires finance</label>
                  </div>

                  {financeRequired && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Finance Company</label>
                        <Input {...register("finance.company")} placeholder="e.g. HDFC Bank" className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Loan Amount (₹)</label>
                        <Input type="number" {...register("finance.loanAmount", { valueAsNumber: true })} className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tenure (Months)</label>
                        <Input type="number" {...register("finance.tenureMonths", { valueAsNumber: true })} className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">EMI (₹)</label>
                        <Input type="number" {...register("finance.emi", { valueAsNumber: true })} className="bg-muted/50" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Additional Details</h3>
                    <p className="text-sm text-muted-foreground">Final showroom metadata.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sales Executive *</label>
                      <Input {...register("additional.salesExecutive")} placeholder="Assign to..." className="bg-muted/50" />
                      {errors.additional?.salesExecutive && <p className="text-xs text-destructive">{errors.additional.salesExecutive.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lead Source</label>
                      <Input {...register("additional.leadSource")} placeholder="e.g. Walk-in, Website" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium">Internal Notes</label>
                      <textarea {...register("additional.internalNotes")} className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Any initial notes about the customer's preferences..."></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Review & Save</h3>
                    <p className="text-sm text-muted-foreground">Verify the details before creating the customer workspace.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl border border-border/50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal</h4>
                        <p className="text-sm font-medium">{watch("basic.firstName")} {watch("basic.lastName")}</p>
                        <p className="text-sm text-muted-foreground">{watch("basic.phone")} • {watch("basic.email") || "No email"}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Address</h4>
                        <p className="text-sm text-muted-foreground">{watch("address.line1")}, {watch("address.city")}, {watch("address.state")} - {watch("address.pincode")}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">KYC & Finance</h4>
                        <p className="text-sm text-muted-foreground">PAN: <span className="font-mono text-foreground uppercase">{watch("identity.panNumber") || "N/A"}</span></p>
                        <p className="text-sm text-muted-foreground mt-1">Finance Required: <span className="font-medium text-foreground">{watch("finance.required") ? "Yes" : "No"}</span></p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Internal</h4>
                        <p className="text-sm text-muted-foreground">Exec: <span className="text-foreground">{watch("additional.salesExecutive")}</span></p>
                        {watch("additional.internalNotes") && (
                          <p className="text-sm text-muted-foreground mt-1 italic border-l-2 pl-2">"{watch("additional.internalNotes")}"</p>
                        )}
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
                <Button variant="secondary" onClick={handleSubmit((d) => onSubmit(d))} disabled={createMutation.isPending} className="shadow-sm hidden sm:flex">
                  Save & Add Another
                </Button>
                <Button onClick={handleSubmit((d) => onSubmit(d))} disabled={isSaving} className="shadow-sm">
                  {isSaving
                    ? (isEditMode ? "Updating..." : "Creating...")
                    : (isEditMode ? "Update Customer" : "Save Workspace")}
                  {!isSaving && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
