import { z } from "zod";

export const supplierSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  isNewSupplier: z.boolean().default(false),
});

export const purchaseItemSchema = z.object({
  id: z.string().optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  variant: z.string().min(1, "Variant is required"),
  color: z.string().min(1, "Color is required"),
  quantityOrdered: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitCost: z.coerce.number().min(1, "Unit cost is required"),
});

export const purchasePricingSchema = z.object({
  discount: z.coerce.number().min(0).default(0),
  gstAmount: z.coerce.number().min(0).default(0),
  transportation: z.coerce.number().min(0).default(0),
  insurance: z.coerce.number().min(0).default(0),
  otherCharges: z.coerce.number().min(0).default(0),
});

export const purchasePaymentTermsSchema = z.object({
  terms: z.string().min(1, "Payment terms required"),
  advancePayment: z.coerce.number().min(0).default(0),
  method: z.string().default("Bank Transfer"),
  referenceId: z.string().optional(),
});

export const purchaseDeliverySchema = z.object({
  warehouse: z.string().min(1, "Destination warehouse required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date required"),
  notes: z.string().optional(),
});

export const createPurchaseWizardSchema = z.object({
  supplier: supplierSchema,
  items: z.array(purchaseItemSchema).min(1, "At least one item must be ordered"),
  pricing: purchasePricingSchema,
  payment: purchasePaymentTermsSchema,
  delivery: purchaseDeliverySchema,
});

export type CreatePurchaseWizardForm = z.infer<typeof createPurchaseWizardSchema>;
