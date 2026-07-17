import { SalesRecord, SalesMetrics } from './types';
import { mockSales, mockSalesMetrics } from './data';
import { CreateSaleWizardForm } from './schemas';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const salesService = {
  getSales: async (): Promise<SalesRecord[]> => {
    await delay(800);
    return mockSales;
  },

  getSale: async (id: string): Promise<SalesRecord | undefined> => {
    await delay(500);
    return mockSales.find(s => s.id === id);
  },

  getMetrics: async (): Promise<SalesMetrics> => {
    await delay(600);
    return mockSalesMetrics;
  },

  createSale: async (data: CreateSaleWizardForm): Promise<SalesRecord> => {
    await delay(1200);
    
    // Compute totals from the pricing form step
    const { basePrice, accessoriesPrice, registrationTax, roadTax, insurance, gstAmount, discount, exchangeBonus } = data.pricing;
    const grandTotal = basePrice + accessoriesPrice + registrationTax + roadTax + insurance + gstAmount - discount - exchangeBonus;
    
    const initialPayment = data.payment.initialPaymentAmount;
    const outstandingBalance = grandTotal - initialPayment;

    const newSale: SalesRecord = {
      id: `sale_new_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      saleDate: new Date().toISOString(),
      status: outstandingBalance > 0 ? (data.finance.required ? 'Finance Processing' : 'Payment Pending') : 'Ready For Delivery',
      
      customerId: data.customer.customerId,
      customerName: 'Mock Customer (New Sale)',
      customerPhone: '+91 9999999999',
      
      inventoryId: data.vehicle.inventoryId,
      vehicleMake: 'Selected',
      vehicleModel: 'Vehicle',
      vehicleVariant: 'Variant',
      vehicleColor: 'Color',
      vin: `ME3NEW${Math.floor(Math.random() * 100000000)}`,
      
      salesExecutive: 'Current User',
      branch: 'Main Showroom',
      
      basePrice,
      accessoriesPrice,
      registrationTax,
      roadTax,
      insurance,
      gstAmount,
      discount,
      exchangeBonus,
      grandTotal,
      
      totalPaid: initialPayment,
      outstandingBalance,
      profitMargin: basePrice * 0.15, // Mock computation
      
      payments: initialPayment > 0 ? [{
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount: initialPayment,
        method: data.payment.method,
        status: 'Completed',
        referenceId: data.payment.referenceId
      }] : [],
      
      finance: {
        required: data.finance.required,
        partner: data.finance.partner,
        loanAmount: data.finance.loanAmount,
        status: data.finance.required ? 'Pending Approval' : undefined
      },
      
      delivery: {
        expectedDate: data.delivery.expectedDate,
        executive: data.delivery.executive,
        status: 'Pending',
        checklistCompleted: false,
        notes: data.delivery.notes
      },
      
      timeline: [
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Created',
          title: 'Sale Created',
          description: 'Deal generated and terms agreed.',
          user: 'Current User'
        }
      ]
    };

    mockSales.unshift(newSale);
    return newSale;
  }
};
