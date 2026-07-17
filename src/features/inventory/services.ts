import { InventoryVehicle, InventoryMetrics } from './types';
import { mockInventory, mockInventoryMetrics } from './data';
import { CreateInventoryWizardForm } from './schemas';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryService = {
  getInventory: async (): Promise<InventoryVehicle[]> => {
    await delay(800);
    return mockInventory;
  },

  getInventoryVehicle: async (id: string): Promise<InventoryVehicle | undefined> => {
    await delay(500);
    return mockInventory.find(v => v.id === id);
  },

  getMetrics: async (): Promise<InventoryMetrics> => {
    await delay(600);
    return mockInventoryMetrics;
  },

  receiveInventory: async (data: CreateInventoryWizardForm): Promise<InventoryVehicle> => {
    await delay(1200);
    
    // Create a mock vehicle object from the wizard data
    const newVehicle: InventoryVehicle = {
      id: `inv_new_${Math.random().toString(36).substr(2, 9)}`,
      make: data.vehicleInfo.make,
      model: data.vehicleInfo.model,
      variant: data.vehicleInfo.variant,
      color: data.vehicleInfo.color,
      fuelType: data.vehicleInfo.fuelType,
      transmission: data.vehicleInfo.transmission,
      manufacturingYear: data.vehicleInfo.manufacturingYear,
      
      vin: data.vehicleInfo.vin.toUpperCase(),
      engineNumber: data.vehicleInfo.engineNumber.toUpperCase(),
      chassisNumber: data.vehicleInfo.chassisNumber.toUpperCase(),
      
      supplier: data.supplierInfo.supplier,
      purchaseDate: new Date(data.supplierInfo.purchaseDate).toISOString(),
      purchaseOrderNumber: data.supplierInfo.purchaseOrderNumber,
      invoiceNumber: data.supplierInfo.invoiceNumber,
      
      purchaseCost: data.pricing.purchaseCost,
      gstAmount: data.pricing.gstAmount || 0,
      mrp: data.pricing.mrp,
      sellingPrice: data.pricing.sellingPrice,
      roadTax: data.pricing.roadTax || 0,
      accessoriesCost: data.pricing.accessoriesCost || 0,
      
      status: 'Available',
      location: data.locationInfo.location,
      rackOrBin: data.locationInfo.rackOrBin,
      
      daysInInventory: 0,
      warrantyInfo: 'Standard Warranty',
      
      movementHistory: [
        {
          id: `mv_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Received',
          user: 'Current User',
          toLocation: data.locationInfo.location,
          notes: data.locationInfo.storageNotes || 'Initial receipt',
        }
      ],
      serviceHistory: [],
      documents: [],
      timeline: [
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          type: 'created',
          title: 'Inventory Received',
          description: `Added via Purchase Order ${data.supplierInfo.purchaseOrderNumber}`,
          timestamp: new Date().toISOString(),
        }
      ]
    };

    mockInventory.unshift(newVehicle);
    return newVehicle;
  },

  transferInventory: async (id: string, toLocation: string, notes: string): Promise<void> => {
    await delay(800);
    const vehicle = mockInventory.find(v => v.id === id);
    if (vehicle) {
      const fromLocation = vehicle.location;
      vehicle.location = toLocation as any;
      vehicle.movementHistory.push({
        id: `mv_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        type: 'Warehouse Transfer',
        user: 'Current User',
        fromLocation,
        toLocation,
        notes
      });
    }
  }
};
