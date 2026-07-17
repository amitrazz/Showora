import { InventoryVehicle, InventoryMetrics, LocationType, StockStatus, TimelineEvent, MovementHistoryEvent, AllocationDetails } from './types';
import { subDays } from 'date-fns';

const indianBikes = [
  { make: 'Royal Enfield', models: [
    { model: 'Classic 350', variants: ['Halcyon', 'Signals', 'Dark', 'Chrome'], priceBase: 193000 },
    { model: 'Meteor 350', variants: ['Fireball', 'Stellar', 'Supernova'], priceBase: 205000 },
    { model: 'Himalayan 450', variants: ['Base', 'Pass', 'Summit'], priceBase: 285000 },
    { model: 'Continental GT 650', variants: ['Standard', 'Custom', 'Alloy'], priceBase: 319000 },
    { model: 'Interceptor 650', variants: ['Standard', 'Custom', 'Alloy'], priceBase: 303000 }
  ]},
  { make: 'Honda', models: [
    { model: 'Activa 6G', variants: ['Standard', 'DLX', 'H-Smart'], priceBase: 76000 },
    { model: 'CB350', variants: ['DLX', 'DLX Pro', 'Legacy Edition'], priceBase: 214000 },
    { model: 'Shine', variants: ['Drum', 'Disc'], priceBase: 79000 }
  ]},
  { make: 'TVS', models: [
    { model: 'Apache RTR 160 4V', variants: ['Drum', 'Disc', 'BT'], priceBase: 124000 },
    { model: 'Jupiter', variants: ['Sheet Metal', 'Standard', 'ZX', 'Classic'], priceBase: 73000 },
    { model: 'Ronin', variants: ['SS', 'DS', 'TD'], priceBase: 149000 }
  ]},
  { make: 'Bajaj', models: [
    { model: 'Pulsar NS200', variants: ['Standard'], priceBase: 149000 },
    { model: 'Dominar 400', variants: ['Standard'], priceBase: 229000 },
    { model: 'Chetak', variants: ['Urbane', 'Premium'], priceBase: 115000 }
  ]},
  { make: 'Yamaha', models: [
    { model: 'MT-15 V2', variants: ['Standard', 'Deluxe'], priceBase: 168000 },
    { model: 'R15 V4', variants: ['Standard', 'M', 'MotoGP'], priceBase: 182000 },
    { model: 'Fascino 125', variants: ['Drum', 'Disc'], priceBase: 79000 }
  ]},
  { make: 'Suzuki', models: [
    { model: 'Access 125', variants: ['Standard', 'Special Edition', 'Ride Connect'], priceBase: 79000 },
    { model: 'Gixxer SF 250', variants: ['Standard', 'Ride Connect'], priceBase: 192000 },
    { model: 'V-Strom SX', variants: ['Standard'], priceBase: 211000 }
  ]},
  { make: 'KTM', models: [
    { model: 'Duke 390', variants: ['Standard'], priceBase: 310000 },
    { model: 'RC 200', variants: ['Standard'], priceBase: 217000 },
    { model: 'Adventure 390', variants: ['Standard', 'X', 'SW'], priceBase: 338000 }
  ]}
];

const colors = ['Stealth Black', 'Racing Blue', 'Matte Grey', 'Pearl White', 'Candy Red', 'Metallic Silver', 'Neon Green', 'Sunset Orange'];
const suppliers = ['AutoHub Distributors', 'Prime Wheels Supply', 'Metro Motors Wholesale', 'Eagle Eye Vehicles'];
const locations: LocationType[] = ['Showroom', 'Warehouse', 'Branch'];
const statuses: StockStatus[] = ['Available', 'Available', 'Available', 'Reserved', 'Allocated', 'Sold', 'Delivered', 'In Transit', 'Under Service'];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 10)}`;

const generateVIN = () => {
  const chars = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
  let vin = 'ME3'; // Indian WMI example
  for (let i = 0; i < 14; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return vin;
};

const generateEngineNumber = () => `E${getRandomNum(10000, 99999)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
const generateChassisNumber = () => `CH${getRandomNum(1000000, 9999999)}`;

export const mockInventory: InventoryVehicle[] = Array.from({ length: 150 }).map((_, i) => {
  const makeData = getRandom(indianBikes);
  const modelData = getRandom(makeData.models);
  const variant = getRandom(modelData.variants);
  const isElectric = modelData.model === 'Chetak';
  
  const purchaseCost = modelData.priceBase * (0.8 + (Math.random() * 0.1)); // 80-90% of base price
  const mrp = modelData.priceBase * 1.05; 
  const sellingPrice = modelData.priceBase;
  
  const status = getRandom(statuses);
  const purchaseDate = subDays(new Date(), getRandomNum(1, 180));
  const daysInInventory = Math.floor((new Date().getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24));
  
  const hasAllocation = ['Allocated', 'Sold', 'Delivered'].includes(status);
  let allocation: AllocationDetails | undefined;
  
  if (hasAllocation) {
    allocation = {
      customerId: generateId('cust'),
      customerName: getRandom(['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh']),
      salesExecutive: getRandom(['Rajesh K.', 'Priya M.', 'Suresh D.']),
      reservationDate: subDays(new Date(), getRandomNum(1, 30)).toISOString(),
      expectedDelivery: subDays(new Date(), -getRandomNum(1, 10)).toISOString(), // Future or past
      deliveryStatus: status === 'Delivered' ? 'Delivered' : status === 'Sold' ? 'Ready' : 'Pending',
      paymentStatus: status === 'Delivered' ? 'Complete' : 'Partial'
    };
  }

  const movementHistory: MovementHistoryEvent[] = [
    {
      id: generateId('mv'),
      date: purchaseDate.toISOString(),
      type: 'Received',
      user: 'System',
      toLocation: 'Warehouse',
      notes: 'Initial inventory receipt from supplier'
    }
  ];
  
  if (daysInInventory > 5 && Math.random() > 0.5) {
    movementHistory.push({
      id: generateId('mv'),
      date: subDays(new Date(), getRandomNum(1, daysInInventory - 2)).toISOString(),
      type: 'Warehouse Transfer',
      user: 'Admin',
      fromLocation: 'Warehouse',
      toLocation: 'Showroom',
      notes: 'Transferred for display'
    });
  }

  const timeline: TimelineEvent[] = [
    {
      id: generateId('tl'),
      type: 'created',
      title: 'Vehicle Received',
      description: 'Added to inventory system',
      timestamp: purchaseDate.toISOString()
    }
  ];

  return {
    id: `inv_${1000 + i}`,
    make: makeData.make,
    model: modelData.model,
    variant: variant,
    color: getRandom(colors),
    fuelType: isElectric ? 'Electric' : 'Petrol',
    transmission: isElectric || makeData.make === 'Honda' && modelData.model === 'Activa 6G' || makeData.make === 'TVS' && modelData.model === 'Jupiter' ? 'Automatic' : 'Manual',
    manufacturingYear: 2026,
    
    vin: generateVIN(),
    engineNumber: generateEngineNumber(),
    chassisNumber: generateChassisNumber(),
    
    supplier: getRandom(suppliers),
    purchaseDate: purchaseDate.toISOString(),
    purchaseOrderNumber: `PO-${2026}-${1000 + i}`,
    invoiceNumber: `INV-S-${getRandomNum(10000, 99999)}`,
    purchaseCost,
    gstAmount: purchaseCost * 0.28, // Assuming 28% GST on bikes
    
    mrp,
    sellingPrice,
    roadTax: sellingPrice * 0.08, // Approx 8% road tax
    accessoriesCost: getRandomNum(2000, 15000),
    
    status,
    location: getRandom(locations),
    rackOrBin: `RACK-${getRandomNum(1, 10)}-${getRandomNum(1, 20)}`,
    
    daysInInventory,
    warrantyInfo: 'Standard 2 Years / 30,000 km',
    
    allocation,
    movementHistory,
    serviceHistory: [],
    documents: [],
    timeline
  };
});

export const mockInventoryMetrics: InventoryMetrics = {
  totalVehicles: mockInventory.length,
  availableStock: mockInventory.filter(v => v.status === 'Available').length,
  reservedStock: mockInventory.filter(v => v.status === 'Reserved' || v.status === 'Allocated').length,
  deliveredToday: mockInventory.filter(v => v.status === 'Delivered' && new Date(v.movementHistory[v.movementHistory.length - 1]?.date || Date.now()).toDateString() === new Date().toDateString()).length || 3, // Mock fallback
  lowStockModels: 4, // Mock calculation
  incomingStock: 24, // Mock calculation
  inventoryValue: mockInventory.filter(v => ['Available', 'Reserved', 'Allocated', 'In Transit'].includes(v.status)).reduce((sum, v) => sum + v.purchaseCost, 0),
  averageInventoryAge: Math.floor(mockInventory.reduce((sum, v) => sum + v.daysInInventory, 0) / mockInventory.length),
  monthlyStockMovement: 45 // Mock calculation
};
