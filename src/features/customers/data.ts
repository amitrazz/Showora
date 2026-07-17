import { Customer, CustomerMetrics } from './types';
import { subDays, subMonths } from 'date-fns';

const indianFirstNames = ['Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Neha', 'Rohan', 'Pooja', 'Karan', 'Anjali', 'Arjun', 'Riya', 'Siddharth', 'Kavya', 'Aditya'];
const indianLastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Reddy', 'Rao', 'Nair', 'Das', 'Joshi', 'Mehta', 'Chopra', 'Jain', 'Shah'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
const bikes = [
  { model: 'Ninja 300', variant: 'ABS', price: 340000 },
  { model: 'Duke 390', variant: 'Standard', price: 310000 },
  { model: 'Continental GT 650', variant: 'Custom', price: 345000 },
  { model: 'R15 V4', variant: 'Racing Blue', price: 195000 },
  { model: 'Meteor 350', variant: 'Supernova', price: 225000 },
  { model: 'Himalayan 450', variant: 'Summit', price: 285000 },
];
const salesExecs = ['Rajesh K.', 'Priya M.', 'Suresh D.', 'Anita R.'];
const financeCompanies = ['HDFC Bank', 'Bajaj Finserv', 'IDFC First', 'TVS Credit'];


// Helper for random items
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

export const mockCustomers: Customer[] = Array.from({ length: 50 }).map((_, i) => {
  const firstName = getRandom(indianFirstNames);
  const lastName = getRandom(indianLastNames);
  const hasFinance = Math.random() > 0.4;
  const isActive = Math.random() > 0.2;
  const numPurchases = isActive ? getRandomNum(1, 3) : 0;
  
  const purchases = Array.from({ length: numPurchases }).map((_, j) => {
    const bike = getRandom(bikes);
    const date = subDays(new Date(), getRandomNum(10, 365));
    return {
      id: generateId('pur'),
      invoiceNumber: `INV-2026-${1000 + i * 10 + j}`,
      bikeModel: bike.model,
      variant: bike.variant,
      price: bike.price,
      purchaseDate: date.toISOString(),
      paymentMode: (hasFinance ? 'finance' : getRandom(['cash', 'card', 'upi'])) as any,
      warranty: '2 Years Extended',
      status: 'completed' as const,
    };
  });

  const totalPurchases = purchases.length;
  const lifetimeValue = purchases.reduce((sum, p) => sum + p.price, 0);
  // Give 30% of active customers some outstanding amount
  const outstandingAmount = (isActive && totalPurchases > 0 && Math.random() > 0.7) 
    ? getRandomNum(10000, 50000) 
    : 0;

  const payments = purchases.flatMap(p => {
    const amount = p.paymentMode === 'finance' ? p.price * 0.2 : p.price; // 20% downpayment if finance
    return [
      {
        id: generateId('pay'),
        amount: amount,
        date: p.purchaseDate,
        mode: p.paymentMode === 'finance' ? 'bank_transfer' : p.paymentMode,
        referenceId: `REF${getRandomNum(100000, 999999)}`,
        status: 'success' as const,
      }
    ];
  });

  return {
    id: `cust_${1000 + i}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `9${getRandomNum(100000000, 999999999)}`,
    dob: subYears(new Date(), getRandomNum(20, 55)).toISOString(),
    gender: getRandom(['male', 'female']),
    address: {
      line1: `${getRandomNum(1, 999)}, Phase ${getRandomNum(1, 5)}`,
      city: getRandom(cities),
      state: 'Maharashtra', // Default state for mock
      pincode: `4000${getRandomNum(10, 99)}`,
    },
    panNumber: `ABCDE${getRandomNum(1000, 9999)}F`,
    aadharNumber: `12345678${getRandomNum(1000, 9999)}`,
    finance: {
      required: hasFinance,
      ...(hasFinance ? {
        company: getRandom(financeCompanies),
        loanAmount: lifetimeValue * 0.8,
        emi: Math.round((lifetimeValue * 0.8) / 24),
        tenureMonths: 24,
        downPayment: lifetimeValue * 0.2,
        status: getRandom(['approved', 'disbursed']),
      } : {})
    },
    status: isActive ? 'active' : getRandom(['inactive', 'lead']),
    customerSince: subMonths(new Date(), getRandomNum(1, 36)).toISOString(),
    salesExecutive: getRandom(salesExecs),
    leadSource: getRandom(['Walk-in', 'Website', 'Reference', 'Social Media']),
    tags: isActive ? ['VIP', 'Enthusiast'] : ['Cold Lead'],
    
    purchases,
    payments,
    documents: [
      { id: generateId('doc'), type: 'pan', name: 'PAN Card.pdf', url: '#', uploadedAt: subDays(new Date(), 30).toISOString() },
      { id: generateId('doc'), type: 'aadhar', name: 'Aadhar.jpg', url: '#', uploadedAt: subDays(new Date(), 30).toISOString() }
    ],
    notes: [
      { id: generateId('note'), content: `Customer visited the showroom. Interested in ${getRandom(bikes).model}.`, author: getRandom(salesExecs), createdAt: subDays(new Date(), 5).toISOString(), isPinned: true }
    ],
    timeline: [
      { id: generateId('tl'), type: 'created', title: 'Customer Profile Created', description: 'Added via Walk-in', timestamp: subDays(new Date(), 40).toISOString() }
    ],
    
    totalPurchases,
    lifetimeValue,
    outstandingAmount,
    lastPurchaseDate: purchases.length > 0 ? purchases[0].purchaseDate : undefined,
  };
});

function subYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() - years);
  return d;
}

export const mockCustomerMetrics: CustomerMetrics = {
  totalCustomers: mockCustomers.length,
  activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
  newThisMonth: mockCustomers.filter(c => new Date(c.customerSince) >= subMonths(new Date(), 1)).length,
  outstandingAmount: mockCustomers.reduce((sum, c) => sum + c.outstandingAmount, 0),
  totalRevenue: mockCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0),
  repeatCustomers: mockCustomers.filter(c => c.totalPurchases > 1).length,
};
