import { PurchaseOrder, Supplier, PurchaseMetrics, PurchaseStatus, PaymentStatus, PurchaseTimelineEvent } from './types';
import { subDays, addDays } from 'date-fns';

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 10)}`;

const suppliers: Supplier[] = [
  { id: 'sup_1', name: 'Royal Enfield Direct', contactPerson: 'Arun Singh', phone: '+91 9876543210', email: 'orders@royalenfield.com', gstNumber: '29ABCDE1234F1Z5', address: 'Chennai Plant, TN', outstandingBalance: 1250000 },
  { id: 'sup_2', name: 'Honda Two Wheelers India', contactPerson: 'Priya Sharma', phone: '+91 9876543211', email: 'sales@honda2wheelersindia.com', gstNumber: '29BCDEF2345G1Z6', address: 'Manesar Plant, HR', outstandingBalance: 450000 },
  { id: 'sup_3', name: 'KTM India', contactPerson: 'Vikram Reddy', phone: '+91 9876543212', email: 'dealer.sales@ktm.in', gstNumber: '29CDEFG3456H1Z7', address: 'Pune Plant, MH', outstandingBalance: 0 },
  { id: 'sup_4', name: 'TVS Motor Company', contactPerson: 'Anjali Desai', phone: '+91 9876543213', email: 'wholesale@tvsmotor.com', gstNumber: '29DEFGH4567I1Z8', address: 'Hosur Plant, TN', outstandingBalance: 850000 },
  { id: 'sup_5', name: 'Bajaj Auto', contactPerson: 'Rahul Kumar', phone: '+91 9876543214', email: 'procurement@bajajauto.com', gstNumber: '29EFGHI5678J1Z9', address: 'Pune Plant, MH', outstandingBalance: 320000 },
];

const bikeModels = [
  { make: 'Royal Enfield', model: 'Classic 350', variant: 'Dark Stealth', cost: 185000 },
  { make: 'Honda', model: 'CB350', variant: 'DLX Pro', cost: 182000 },
  { make: 'KTM', model: 'Duke 390', variant: 'Standard', cost: 265000 },
  { make: 'TVS', model: 'Apache RTR 160', variant: 'Disc', cost: 105000 },
  { make: 'Bajaj', model: 'Pulsar NS200', variant: 'Standard', cost: 125000 },
];

const statuses: PurchaseStatus[] = [
  'Pending Approval', 'Approved', 'Ordered', 'Ordered', 'Partially Received', 'Received', 'Received', 'Received', 'Closed'
];

export const mockPurchases: PurchaseOrder[] = Array.from({ length: 50 }).map((_, i) => {
  const status = getRandom(statuses);
  const isReceived = status === 'Received' || status === 'Closed';
  const isPartiallyReceived = status === 'Partially Received';
  const orderDate = subDays(new Date(), getRandomNum(5, 60));
  
  const supplier = getRandom(suppliers);
  const numItems = getRandomNum(1, 3);
  
  let subtotal = 0;
  const items = Array.from({ length: numItems }).map(() => {
    const bike = getRandom(bikeModels);
    const quantityOrdered = getRandomNum(5, 20);
    const quantityReceived = isReceived ? quantityOrdered : (isPartiallyReceived ? Math.floor(quantityOrdered / 2) : 0);
    const totalCost = quantityOrdered * bike.cost;
    subtotal += totalCost;
    
    return {
      id: generateId('pi'),
      make: bike.make,
      model: bike.model,
      variant: bike.variant,
      color: getRandom(['Matte Black', 'Racing Blue', 'Pearl White', 'Candy Red']),
      quantityOrdered,
      quantityReceived,
      unitCost: bike.cost,
      totalCost
    };
  });

  const discount = getRandomNum(0, 15000);
  const gstAmount = (subtotal - discount) * 0.28;
  const transportation = getRandomNum(5000, 25000);
  const insurance = getRandomNum(2000, 10000);
  const otherCharges = 0;
  
  const grandTotal = Math.round(subtotal - discount + gstAmount + transportation + insurance + otherCharges);
  
  const paymentStatus: PaymentStatus = isReceived ? 'Paid' : getRandom(['Unpaid', 'Partially Paid']);
  const amountPaid = paymentStatus === 'Paid' ? grandTotal : (paymentStatus === 'Partially Paid' ? Math.floor(grandTotal * 0.3) : 0);
  const outstandingAmount = grandTotal - amountPaid;

  const payments = amountPaid > 0 ? [
    {
      id: generateId('pay'),
      date: orderDate.toISOString(),
      amount: amountPaid,
      method: 'Bank Transfer',
      referenceId: `REF${getRandomNum(10000, 99999)}`,
      status: 'Completed' as const
    }
  ] : [];

  const timeline: PurchaseTimelineEvent[] = [
    {
      id: generateId('tl'),
      date: orderDate.toISOString(),
      type: 'Created' as const,
      title: 'PO Created',
      description: 'Draft purchase order generated.',
      user: 'Procurement Manager'
    },
    {
      id: generateId('tl'),
      date: addDays(orderDate, 1).toISOString(),
      type: 'Ordered' as const,
      title: 'Order Placed',
      description: 'PO sent to supplier.',
      user: 'Procurement Manager'
    }
  ];

  if (isReceived || isPartiallyReceived) {
    timeline.push({
      id: generateId('tl'),
      date: addDays(orderDate, getRandomNum(3, 10)).toISOString(),
      type: 'Received' as const,
      title: isReceived ? 'Fully Received' : 'Partially Received',
      description: 'Inventory arrived at warehouse.',
      user: 'Warehouse Staff'
    });
  }

  return {
    id: `po_${1000 + i}`,
    poNumber: `PO-${new Date().getFullYear()}-${5000 + i}`,
    orderDate: orderDate.toISOString(),
    expectedDelivery: addDays(orderDate, getRandomNum(7, 15)).toISOString(),
    status,
    
    supplierId: supplier.id,
    supplierName: supplier.name,
    
    items,
    
    subtotal,
    discount,
    gstAmount,
    transportation,
    insurance,
    otherCharges,
    grandTotal,
    
    paymentTerms: 'Net 30',
    paymentStatus,
    amountPaid,
    outstandingAmount,
    payments,
    
    warehouse: 'Main Warehouse',
    
    timeline,
    createdBy: 'Procurement Manager'
  };
});

export const mockSuppliers = suppliers;

export const mockPurchaseMetrics: PurchaseMetrics = {
  totalOrders: mockPurchases.length,
  pendingDeliveries: mockPurchases.filter(p => p.status === 'Ordered' || p.status === 'Partially Received').length,
  receivedThisMonth: 15,
  outstandingPayments: mockPurchases.reduce((sum, p) => sum + p.outstandingAmount, 0),
  totalPurchaseValue: mockPurchases.reduce((sum, p) => sum + p.grandTotal, 0),
  inventoryAdded: 145,
  averageProcurementCost: Math.floor(mockPurchases.reduce((sum, p) => sum + p.grandTotal, 0) / mockPurchases.length),
  activeSuppliers: suppliers.length
};
