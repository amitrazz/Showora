export type StockStatus = 'Available' | 'Reserved' | 'Allocated' | 'Sold' | 'Delivered' | 'In Transit' | 'Under Service' | 'Returned';
export type LocationType = 'Showroom' | 'Warehouse' | 'Branch';

export interface MovementHistoryEvent {
  id: string;
  date: string;
  type: 'Received' | 'Warehouse Transfer' | 'Reserved' | 'Allocated' | 'Delivered' | 'Returned' | 'Service Entry';
  user: string;
  fromLocation?: string;
  toLocation?: string;
  notes: string;
}

export interface AllocationDetails {
  customerId?: string;
  customerName?: string;
  salesExecutive: string;
  reservationDate: string;
  expectedDelivery: string;
  deliveryStatus: 'Pending' | 'Ready' | 'Delivered';
  paymentStatus: 'Pending' | 'Partial' | 'Complete';
}

export interface ServiceEvent {
  id: string;
  date: string;
  type: 'PDI' | 'Repair' | 'Accessories' | 'Maintenance';
  description: string;
  technician: string;
  cost?: number;
}

export interface InventoryDocument {
  id: string;
  type: 'Purchase Invoice' | 'Vehicle Invoice' | 'Insurance' | 'Warranty' | 'Registration' | 'Road Tax' | 'Image';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'transferred' | 'reserved' | 'allocated' | 'delivered' | 'service' | 'updated';
  title: string;
  description: string;
  timestamp: string;
}

export interface InventoryVehicle {
  id: string;
  
  // Specs
  make: string;
  model: string;
  variant: string;
  color: string;
  fuelType: 'Petrol' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  manufacturingYear: number;
  
  // Identifiers
  vin: string;
  engineNumber: string;
  chassisNumber: string;
  
  // Purchase
  supplier: string;
  purchaseDate: string;
  purchaseOrderNumber: string;
  invoiceNumber: string;
  purchaseCost: number;
  gstAmount: number;
  
  // Pricing
  mrp: number;
  sellingPrice: number;
  roadTax: number;
  accessoriesCost: number;
  
  // Status & Location
  status: StockStatus;
  location: LocationType;
  rackOrBin?: string;
  
  // Operations
  daysInInventory: number;
  warrantyInfo: string;
  
  // Complex relationships
  allocation?: AllocationDetails;
  movementHistory: MovementHistoryEvent[];
  serviceHistory: ServiceEvent[];
  documents: InventoryDocument[];
  timeline: TimelineEvent[];
}

export interface InventoryMetrics {
  totalVehicles: number;
  availableStock: number;
  reservedStock: number;
  deliveredToday: number;
  lowStockModels: number;
  incomingStock: number;
  inventoryValue: number;
  averageInventoryAge: number; // in days
  monthlyStockMovement: number;
}
