import { z } from "zod";

export const invoiceSaleSchema = z.object({
  saleId: z.string().min(1, "Sale reference is required"),
});

export const invoiceMetadataSchema = z.object({
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  salesExecutive: z.string().min(1, "Sales executive is required"),
  branch: z.string().min(1, "Branch is required"),
});

export const invoicePricingSchema = z.object({
  basePrice: z.coerce.number().min(0),
  accessoriesPrice: z.coerce.number().min(0).default(0),
  registrationTax: z.coerce.number().min(0).default(0),
  insurance: z.coerce.number().min(0).default(0),
  otherCharges: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  gstRate: z.coerce.number().min(0).default(28), // Usually 28% for bikes
});

export const invoicePaymentSchema = z.object({
  amountPaid: z.coerce.number().min(0).default(0),
  method: z.string().default("Bank Transfer"),
  referenceId: z.string().optional(),
});

export const createInvoiceWizardSchema = z.object({
  sale: invoiceSaleSchema,
  metadata: invoiceMetadataSchema,
  pricing: invoicePricingSchema,
  payment: invoicePaymentSchema,
});

export type CreateInvoiceWizardForm = z.infer<typeof createInvoiceWizardSchema>;
