import { mockCustomers, mockCustomerMetrics } from "./data";
import { Customer, CustomerMetrics } from "./types";
import { CreateCustomerWizardForm } from "./schemas";

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    await delay(600);
    return [...mockCustomers];
  },
  
  getCustomerById: async (id: string): Promise<Customer> => {
    await delay(400);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) throw new Error("Customer not found");
    return customer;
  },

  getMetrics: async (): Promise<CustomerMetrics> => {
    await delay(500);
    return mockCustomerMetrics;
  },

  createCustomer: async (data: CreateCustomerWizardForm): Promise<Customer> => {
    await delay(1000);
    // In a real app, this would hit the API
    // Here we just mock the returned newly created object
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      firstName: data.basic.firstName,
      lastName: data.basic.lastName,
      email: data.basic.email || '',
      phone: data.basic.phone,
      dob: data.basic.dob,
      gender: data.basic.gender,
      address: data.address,
      panNumber: data.identity.panNumber,
      aadharNumber: data.identity.aadharNumber,
      drivingLicense: data.identity.drivingLicense,
      gstNumber: data.identity.gstNumber,
      finance: {
        required: data.finance.required,
        company: data.finance.company,
        loanAmount: data.finance.loanAmount,
        emi: data.finance.emi,
        tenureMonths: data.finance.tenureMonths,
        downPayment: data.finance.downPayment,
      },
      status: 'lead',
      customerSince: new Date().toISOString(),
      salesExecutive: data.additional.salesExecutive,
      leadSource: data.additional.leadSource,
      tags: data.additional.tags,
      purchases: [],
      payments: [],
      documents: [],
      notes: data.additional.internalNotes ? [
        { id: `note_${Date.now()}`, content: data.additional.internalNotes, author: data.additional.salesExecutive, createdAt: new Date().toISOString(), isPinned: false }
      ] : [],
      timeline: [
        { id: `tl_${Date.now()}`, type: 'created', title: 'Customer Profile Created', description: 'System via wizard', timestamp: new Date().toISOString() }
      ],
      totalPurchases: 0,
      lifetimeValue: 0,
      outstandingAmount: 0,
    };
    // Mutate mock data array in memory so it persists during the session
    mockCustomers.unshift(newCustomer);
    return newCustomer;
  },
  
  updateCustomer: async (id: string, data: any): Promise<Customer> => {
    await delay(800);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Customer not found");
    mockCustomers[index] = { ...mockCustomers[index], ...data };
    return mockCustomers[index];
  }
};
