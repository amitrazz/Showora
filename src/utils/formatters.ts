import { format } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Use this when the value comes directly from the API/DB and is stored in paise (minor units) */
export function formatPaise(amountInPaise: number): string {
  return formatCurrency(amountInPaise / 100);
}

export function formatDate(date: string | Date, formatStr: string = 'dd MMM, yyyy'): string {
  if (!date) return '';
  return format(new Date(date), formatStr);
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
}

export function generateInvoiceNumber(): string {
  const prefix = 'INV';
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}
