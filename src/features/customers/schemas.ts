import { z } from 'zod';

export const customerBasicSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  dob: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const customerAddressSchema = z.object({
  line1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a valid 6-digit pincode"),
});

export const customerIdentitySchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").optional().or(z.literal('')),
  aadharNumber: z.string().regex(/^\d{12}$/, "Must be a 12-digit Aadhar number").optional().or(z.literal('')),
  drivingLicense: z.string().optional(),
  gstNumber: z.string().optional(),
});

export const customerFinanceSchema = z.object({
  required: z.boolean().default(false),
  company: z.string().optional(),
  loanAmount: z.coerce.number().min(0).optional().or(z.literal('').transform(() => undefined)).or(z.nan().transform(() => undefined)),
  emi: z.coerce.number().min(0).optional().or(z.literal('').transform(() => undefined)).or(z.nan().transform(() => undefined)),
  tenureMonths: z.coerce.number().min(0).optional().or(z.literal('').transform(() => undefined)).or(z.nan().transform(() => undefined)),
  downPayment: z.coerce.number().min(0).optional().or(z.literal('').transform(() => undefined)).or(z.nan().transform(() => undefined)),
});

export const customerAdditionalSchema = z.object({
  salesExecutive: z.string().min(1, "Sales executive is required"),
  leadSource: z.string().optional(),
  tags: z.array(z.string()).default([]),
  internalNotes: z.string().optional(),
});

export const createCustomerWizardSchema = z.object({
  basic: customerBasicSchema,
  address: customerAddressSchema,
  identity: customerIdentitySchema,
  finance: customerFinanceSchema,
  additional: customerAdditionalSchema,
});

export type CustomerBasicForm = z.infer<typeof customerBasicSchema>;
export type CustomerAddressForm = z.infer<typeof customerAddressSchema>;
export type CustomerIdentityForm = z.infer<typeof customerIdentitySchema>;
export type CustomerFinanceForm = z.infer<typeof customerFinanceSchema>;
export type CustomerAdditionalForm = z.infer<typeof customerAdditionalSchema>;
export type CreateCustomerWizardForm = z.infer<typeof createCustomerWizardSchema>;
