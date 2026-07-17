import { InvoiceRecord, InvoiceMetrics } from './types';
import { mockInvoices, mockInvoiceMetrics } from './data';
import { CreateInvoiceWizardForm } from './schemas';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const invoiceService = {
  getInvoices: async (): Promise<InvoiceRecord[]> => {
    await delay(800);
    return mockInvoices;
  },

  getInvoice: async (id: string): Promise<InvoiceRecord | undefined> => {
    await delay(500);
    return mockInvoices.find(i => i.id === id);
  },

  getMetrics: async (): Promise<InvoiceMetrics> => {
    await delay(600);
    return mockInvoiceMetrics;
  },

  createInvoice: async (data: CreateInvoiceWizardForm): Promise<InvoiceRecord> => {
    await delay(1200);
    
    const { basePrice, accessoriesPrice, registrationTax, insurance, otherCharges, discount, gstRate } = data.pricing;
    
    const taxableAmount = basePrice + accessoriesPrice - discount;
    const cgstRate = gstRate / 2;
    const sgstRate = gstRate / 2;
    const cgstAmount = taxableAmount * (cgstRate / 100);
    const sgstAmount = taxableAmount * (sgstRate / 100);
    const totalGst = cgstAmount + sgstAmount;
    
    const grandTotal = Math.round(taxableAmount + totalGst + registrationTax + insurance + otherCharges);
    
    const amountPaid = data.payment.amountPaid || 0;
    const outstandingAmount = grandTotal - amountPaid;

    const newInvoice: InvoiceRecord = {
      id: `inv_new_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      invoiceDate: data.metadata.invoiceDate,
      dueDate: data.metadata.dueDate,
      status: outstandingAmount <= 0 ? 'Paid' : (amountPaid > 0 ? 'Partially Paid' : 'Generated'),
      
      saleId: data.sale.saleId,
      customerId: 'cust_new',
      customerName: 'Mock Linked Customer',
      customerPhone: '+91 9999999999',
      customerAddress: 'Mock Address',
      
      inventoryId: 'inv_new',
      vehicleMake: 'Selected',
      vehicleModel: 'Vehicle',
      vehicleVariant: 'Variant',
      vehicleColor: 'Color',
      vin: `ME3NEW${Math.floor(Math.random() * 100000000)}`,
      engineNumber: `ENNEW${Math.floor(Math.random() * 100000)}`,
      
      salesExecutive: data.metadata.salesExecutive,
      branch: data.metadata.branch,
      
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
      payments: amountPaid > 0 ? [{
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount: amountPaid,
        method: data.payment.method,
        status: 'Completed',
        referenceId: data.payment.referenceId || ''
      }] : [],
      
      timeline: [
        {
          id: `tl_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          type: 'Generated',
          title: 'Invoice Generated',
          description: 'System generated the final tax invoice.',
          user: data.metadata.salesExecutive
        }
      ]
    };

    mockInvoices.unshift(newInvoice);
    return newInvoice;
  }
};
