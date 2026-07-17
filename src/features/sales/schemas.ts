import { z } from "zod";

export const salesCustomerSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  isNewCustomer: z.boolean().default(false),
});

export const salesVehicleSchema = z.object({
  inventoryId: z.string().min(1, "Vehicle selection is required"),
  reserveVehicle: z.boolean().default(true),
});

export const salesPricingSchema = z.object({
  basePrice: z.coerce.number().min(0),
  accessoriesPrice: z.coerce.number().min(0).default(0),
  registrationTax: z.coerce.number().min(0).default(0),
  roadTax: z.coerce.number().min(0).default(0),
  insurance: z.coerce.number().min(0).default(0),
  gstAmount: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  exchangeBonus: z.coerce.number().min(0).default(0),
});

export const salesPaymentSchema = z.object({
  method: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Finance']),
  initialPaymentAmount: z.coerce.number().min(0),
  referenceId: z.string().optional(),
});

export const salesFinanceSchema = z.object({
  required: z.boolean(),
  partner: z.string().optional(),
  loanAmount: z.coerce.number().optional(),
  downPayment: z.coerce.number().optional(),
  interestRate: z.coerce.number().optional(),
  tenureMonths: z.coerce.number().optional(),
});

export const salesDeliverySchema = z.object({
  expectedDate: z.string().min(1, "Expected delivery date is required"),
  executive: z.string().min(2, "Delivery executive is required"),
  notes: z.string().optional(),
});

export const createSaleWizardSchema = z.object({
  customer: salesCustomerSchema,
  vehicle: salesVehicleSchema,
  pricing: salesPricingSchema,
  payment: salesPaymentSchema,
  finance: salesFinanceSchema,
  delivery: salesDeliverySchema,
});

export type CreateSaleWizardForm = z.infer<typeof createSaleWizardSchema>;
