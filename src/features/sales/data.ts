import { SalesRecord, SalesMetrics, SalesStatus, PaymentMethod, PaymentRecord, SaleTimelineEvent } from './types';
import { subDays } from 'date-fns';

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 10)}`;

const statuses: SalesStatus[] = [
  'Draft', 'Quotation', 'Reserved', 'Payment Pending', 
  'Finance Processing', 'Ready For Delivery', 'Delivered', 
  'Delivered', 'Delivered', 'Cancelled'
];

const branches = ['Downtown Main Showroom', 'Northside Branch', 'Airport Road Outlet'];
const executives = ['Rajesh Kumar', 'Priya Singh', 'Amit Patel', 'Neha Sharma', 'Vikram Desai'];

const bikeModels = [
  { make: 'Royal Enfield', model: 'Classic 350', variant: 'Dark Stealth', price: 215000 },
  { make: 'Honda', model: 'CB350', variant: 'DLX Pro', price: 214000 },
  { make: 'KTM', model: 'Duke 390', variant: 'Standard', price: 310000 },
  { make: 'TVS', model: 'Apache RTR 160', variant: 'Disc', price: 124000 },
  { make: 'Bajaj', model: 'Pulsar NS200', variant: 'Standard', price: 149000 },
];

const customerNames = [
  'Rahul Sharma', 'Sneha Reddy', 'Karan Gupta', 'Pooja Iyer', 
  'Aditya Verma', 'Riya Desai', 'Siddharth Menon', 'Ananya Joshi'
];

export const mockSales: SalesRecord[] = Array.from({ length: 100 }).map((_, i) => {
  const status = getRandom(statuses);
  const isDelivered = status === 'Delivered';
  const saleDate = subDays(new Date(), getRandomNum(0, 90));
  
  const bike = getRandom(bikeModels);
  const basePrice = bike.price;
  const accessoriesPrice = getRandomNum(2000, 15000);
  const registrationTax = basePrice * 0.10;
  const roadTax = basePrice * 0.08;
  const insurance = getRandomNum(5000, 12000);
  const gstAmount = basePrice * 0.28;
  const discount = getRandomNum(0, 5000);
  const exchangeBonus = Math.random() > 0.8 ? getRandomNum(10000, 40000) : 0;
  
  const grandTotal = Math.round(basePrice + accessoriesPrice + registrationTax + roadTax + insurance + gstAmount - discount - exchangeBonus);
  
  const usesFinance = Math.random() > 0.6;
  const totalPaid = isDelivered ? grandTotal : (usesFinance ? getRandomNum(10000, 50000) : getRandomNum(10000, grandTotal - 10000));
  const outstandingBalance = Math.max(0, grandTotal - totalPaid);
  
  // Approximate simulated profit (Markup minus discount)
  const profitMargin = Math.round((basePrice * 0.15) + (accessoriesPrice * 0.30) - discount);

  const payments: PaymentRecord[] = [
    {
      id: generateId('pay'),
      date: saleDate.toISOString(),
      amount: totalPaid,
      method: usesFinance ? 'Finance' : getRandom<PaymentMethod>(['UPI', 'Bank Transfer', 'Cash']),
      status: 'Completed',
      referenceId: `TXN${getRandomNum(100000, 999999)}`
    }
  ];

  const timeline: SaleTimelineEvent[] = [
    {
      id: generateId('tl'),
      date: saleDate.toISOString(),
      type: 'Created',
      title: 'Sale Initiated',
      description: 'Customer showed intent and quotation generated.',
      user: getRandom(executives)
    }
  ];

  if (isDelivered) {
    timeline.push({
      id: generateId('tl'),
      date: subDays(saleDate, -getRandomNum(1, 5)).toISOString(),
      type: 'Delivery',
      title: 'Vehicle Delivered',
      description: 'Handover complete and gate pass generated.',
      user: getRandom(executives)
    });
  }

  return {
    id: `sale_${1000 + i}`,
    invoiceNumber: `INV-${new Date().getFullYear()}-${3000 + i}`,
    saleDate: saleDate.toISOString(),
    status,
    
    customerId: generateId('cust'),
    customerName: getRandom(customerNames),
    customerPhone: `+91 9${getRandomNum(100000000, 999999999)}`,
    
    inventoryId: generateId('inv'),
    vehicleMake: bike.make,
    vehicleModel: bike.model,
    vehicleVariant: bike.variant,
    vehicleColor: getRandom(['Matte Black', 'Racing Blue', 'Pearl White', 'Candy Red']),
    vin: `ME3${getRandomNum(10000000000000, 99999999999999)}`,
    
    salesExecutive: getRandom(executives),
    branch: getRandom(branches),
    
    basePrice,
    accessoriesPrice,
    registrationTax,
    roadTax,
    insurance,
    gstAmount,
    discount,
    exchangeBonus,
    grandTotal,
    
    totalPaid,
    outstandingBalance,
    profitMargin,
    
    payments,
    finance: {
      required: usesFinance,
      partner: usesFinance ? getRandom(['HDFC Bank', 'ICICI Bank', 'IDFC First', 'Bajaj Finance']) : undefined,
      loanAmount: usesFinance ? grandTotal - totalPaid : undefined,
      status: usesFinance ? (isDelivered ? 'Disbursed' : 'Approved') : undefined,
    },
    delivery: {
      expectedDate: subDays(saleDate, -7).toISOString(),
      actualDate: isDelivered ? subDays(saleDate, -getRandomNum(1, 7)).toISOString() : undefined,
      executive: getRandom(executives),
      status: isDelivered ? 'Completed' : 'Pending',
      checklistCompleted: isDelivered,
    },
    timeline
  };
});

export const mockSalesMetrics: SalesMetrics = {
  todaysSales: 4,
  todaysRevenue: 850000,
  monthlyRevenue: 12500000,
  unitsSold: 58,
  pendingDeliveries: mockSales.filter(s => s.status === 'Ready For Delivery').length,
  pendingPayments: mockSales.filter(s => s.outstandingBalance > 0 && s.status !== 'Cancelled').length,
  financePending: mockSales.filter(s => s.status === 'Finance Processing').length,
  averageDealValue: Math.floor(mockSales.reduce((sum, s) => sum + s.grandTotal, 0) / mockSales.length),
  totalProfit: mockSales.reduce((sum, s) => sum + s.profitMargin, 0)
};
