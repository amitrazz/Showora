import { InvoiceRecord, InvoiceMetrics, InvoiceStatus, InvoiceTimelineEvent } from './types';
import { subDays, addDays } from 'date-fns';

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 10)}`;

const statuses: InvoiceStatus[] = [
  'Generated', 'Sent', 'Sent', 'Partially Paid', 'Paid', 'Paid', 'Paid', 'Overdue'
];

const branches = ['Downtown Main Showroom', 'Northside Branch', 'Airport Road Outlet'];
const executives = ['Rajesh Kumar', 'Priya Singh', 'Amit Patel', 'Neha Sharma', 'Vikram Desai'];
const customerNames = ['Rahul Sharma', 'Sneha Reddy', 'Karan Gupta', 'Pooja Iyer', 'Aditya Verma', 'Riya Desai', 'Siddharth Menon', 'Ananya Joshi'];

const bikeModels = [
  { make: 'Royal Enfield', model: 'Classic 350', variant: 'Dark Stealth', price: 215000 },
  { make: 'Honda', model: 'CB350', variant: 'DLX Pro', price: 214000 },
  { make: 'KTM', model: 'Duke 390', variant: 'Standard', price: 310000 },
  { make: 'TVS', model: 'Apache RTR 160', variant: 'Disc', price: 124000 },
  { make: 'Bajaj', model: 'Pulsar NS200', variant: 'Standard', price: 149000 },
];

export const mockInvoices: InvoiceRecord[] = Array.from({ length: 100 }).map((_, i) => {
  const status = getRandom(statuses);
  const isPaid = status === 'Paid';
  
  const invoiceDate = subDays(new Date(), getRandomNum(2, 90));
  const dueDate = addDays(invoiceDate, 15);
  
  const bike = getRandom(bikeModels);
  
  const basePrice = bike.price;
  const accessoriesPrice = getRandomNum(2000, 15000);
  const discount = getRandomNum(0, 5000);
  
  // Taxable amount is base + accessories - discount
  const taxableAmount = basePrice + accessoriesPrice - discount;
  
  // GST calculation for two-wheelers is typically 28% (14% CGST + 14% SGST)
  const cgstRate = 14;
  const sgstRate = 14;
  
  const cgstAmount = taxableAmount * (cgstRate / 100);
  const sgstAmount = taxableAmount * (sgstRate / 100);
  const totalGst = cgstAmount + sgstAmount;
  
  const registrationTax = basePrice * 0.10;
  const insurance = getRandomNum(5000, 12000);
  const otherCharges = getRandomNum(500, 2000);
  
  const grandTotal = Math.round(taxableAmount + totalGst + registrationTax + insurance + otherCharges);
  
  const amountPaid = isPaid ? grandTotal : (status === 'Partially Paid' ? Math.floor(grandTotal * 0.4) : (status === 'Sent' ? getRandomNum(10000, 50000) : 0));
  const outstandingAmount = grandTotal - amountPaid;

  const payments = amountPaid > 0 ? [
    {
      id: generateId('pay'),
      date: invoiceDate.toISOString(),
      amount: amountPaid,
      method: getRandom(['Bank Transfer', 'UPI', 'Cheque', 'Finance']),
      referenceId: `TXN${getRandomNum(100000, 999999)}`,
      status: 'Completed' as const
    }
  ] : [];

  const timeline: InvoiceTimelineEvent[] = [
    {
      id: generateId('tl'),
      date: invoiceDate.toISOString(),
      type: 'Generated' as const,
      title: 'Invoice Generated',
      description: 'System generated the final tax invoice.',
      user: getRandom(executives)
    },
    {
      id: generateId('tl'),
      date: invoiceDate.toISOString(),
      type: 'Sent' as const,
      title: 'Invoice Sent',
      description: 'Emailed to customer.',
      user: 'System'
    }
  ];

  if (amountPaid > 0) {
    timeline.push({
      id: generateId('tl'),
      date: addDays(invoiceDate, getRandomNum(1, 5)).toISOString(),
      type: 'Payment Recorded' as const,
      title: 'Payment Received',
      description: `Payment of ₹${amountPaid} was successfully recorded.`,
      user: 'System'
    });
  }

  return {
    id: `inv_${1000 + i}`,
    invoiceNumber: `INV-${new Date().getFullYear()}-${8000 + i}`,
    invoiceDate: invoiceDate.toISOString(),
    dueDate: dueDate.toISOString(),
    status,
    
    saleId: `sale_${getRandomNum(1000, 9999)}`,
    customerId: `cust_${getRandomNum(1000, 9999)}`,
    customerName: getRandom(customerNames),
    customerPhone: `+91 9${getRandomNum(100000000, 999999999)}`,
    customerAddress: `${getRandomNum(10, 999)} MG Road, Bangalore, Karnataka - 560001`,
    
    inventoryId: generateId('inv'),
    vehicleMake: bike.make,
    vehicleModel: bike.model,
    vehicleVariant: bike.variant,
    vehicleColor: getRandom(['Matte Black', 'Racing Blue', 'Pearl White', 'Candy Red']),
    vin: `ME3${getRandomNum(10000000000000, 99999999999999)}`,
    engineNumber: `EN${getRandomNum(10000000, 99999999)}`,
    motorNumber: `MOT${getRandomNum(1000000, 9999999)}`,
    chargeNumber: `CHG-${getRandomNum(1000, 9999)}`,
    controllerNumber: `CTRL-${getRandomNum(10000, 99999)}`,
    batterySerialNumber: `BAT-${getRandomNum(10000000, 99999999)}`,
    
    salesExecutive: getRandom(executives),
    branch: getRandom(branches),
    
    basePrice,
    accessoriesPrice,
    registrationTax,
    insurance,
    otherCharges,
    discount,
    
    taxableAmount,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    totalGst,
    
    grandTotal,
    
    amountPaid,
    outstandingAmount,
    payments,
    
    timeline
  };
});

export const mockInvoiceMetrics: InvoiceMetrics = {
  totalInvoices: mockInvoices.length,
  invoicesThisMonth: 34,
  paidAmount: mockInvoices.reduce((sum, i) => sum + i.amountPaid, 0),
  outstandingAmount: mockInvoices.reduce((sum, i) => sum + i.outstandingAmount, 0),
  overdueInvoices: mockInvoices.filter(i => i.status === 'Overdue').length,
  averageInvoiceValue: Math.floor(mockInvoices.reduce((sum, i) => sum + i.grandTotal, 0) / mockInvoices.length),
  gstCollected: mockInvoices.reduce((sum, i) => sum + i.totalGst, 0),
  todaysBilling: 450000
};
