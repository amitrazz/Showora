import { z } from "zod";

export const expenseInfoSchema = z.object({
  title: z.string().min(1, "Expense title is required"),
  category: z.string().min(1, "Category is required"),
  vendor: z.string().min(1, "Vendor name is required"),
  description: z.string().optional(),
  branch: z.string().min(1, "Branch is required"),
  expenseDate: z.string().min(1, "Date is required"),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.string().optional(),
});

export const expenseAmountSchema = z.object({
  subtotal: z.coerce.number().min(0, "Subtotal must be positive"),
  gstAmount: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
});

export const expensePaymentSchema = z.object({
  dueDate: z.string().min(1, "Due date is required"),
  method: z.string().default("Bank Transfer"),
  paidAmount: z.coerce.number().min(0).default(0),
  referenceId: z.string().optional(),
});

export const createExpenseWizardSchema = z.object({
  info: expenseInfoSchema,
  amount: expenseAmountSchema,
  payment: expensePaymentSchema,
});

export type CreateExpenseWizardForm = z.infer<typeof createExpenseWizardSchema>;
