import { z } from "zod";

export const inventorySupplierSchema = z.object({
  supplier: z.string().min(2, "Supplier name is required"),
  purchaseOrderNumber: z.string().min(3, "PO number is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  invoiceNumber: z.string().min(3, "Invoice number is required"),
});

export const inventoryVehicleInfoSchema = z.object({
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  variant: z.string().min(1, "Variant is required"),
  color: z.string().min(2, "Color is required"),
  vin: z.string().length(17, "VIN must be exactly 17 characters"),
  engineNumber: z.string().min(5, "Engine number is required"),
  chassisNumber: z.string().min(5, "Chassis number is required"),
  manufacturingYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  fuelType: z.enum(["Petrol", "Electric", "Hybrid"]),
  transmission: z.enum(["Manual", "Automatic"]),
});

export const inventoryPricingSchema = z.object({
  purchaseCost: z.coerce.number().min(0, "Must be positive"),
  gstAmount: z.coerce.number().min(0).optional().or(z.nan().transform(() => undefined)),
  mrp: z.coerce.number().min(0, "Must be positive"),
  sellingPrice: z.coerce.number().min(0, "Must be positive"),
  roadTax: z.coerce.number().min(0).optional().or(z.nan().transform(() => undefined)),
  accessoriesCost: z.coerce.number().min(0).optional().or(z.nan().transform(() => undefined)),
});

export const inventoryLocationSchema = z.object({
  location: z.enum(["Showroom", "Warehouse", "Branch"]),
  rackOrBin: z.string().optional(),
  storageNotes: z.string().optional(),
});

export const createInventoryWizardSchema = z.object({
  supplierInfo: inventorySupplierSchema,
  vehicleInfo: inventoryVehicleInfoSchema,
  pricing: inventoryPricingSchema,
  locationInfo: inventoryLocationSchema,
});

export type CreateInventoryWizardForm = z.infer<typeof createInventoryWizardSchema>;
