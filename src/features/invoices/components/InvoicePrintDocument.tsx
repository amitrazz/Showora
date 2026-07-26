import React from "react";
import { format } from "date-fns";
import { InvoiceRecord } from "../types";

interface InvoicePrintDocumentProps {
  invoice: InvoiceRecord;
}

export const InvoicePrintDocument: React.FC<InvoicePrintDocumentProps> = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="bg-white w-[800px] min-h-[1131px] text-black font-sans shrink-0 p-8 flex flex-col justify-between border border-gray-200" style={{ color: '#000000', backgroundColor: '#ffffff' }}>
      <div>
        <div className="text-center font-bold text-sm mb-2 uppercase tracking-wide">
          Tax Invoice
        </div>

        <div className="border border-black border-b-0 flex">
          <div className="w-[200px] bg-[#f26522] text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold tracking-tighter">KOMAKI<sup className="text-sm">®</sup></h1>
            <p className="text-[8px] mt-1 text-center font-medium tracking-wider">ELECTRIC VEHICLE DIVISION</p>
          </div>
          <div className="flex-1 p-3">
            <h2 className="text-xl font-semibold mb-2">Riya Enterprises</h2>
            <p className="text-xs mb-2">Kurtha Kinjar Road Nirjanbigha Kurtha</p>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <p><span className="font-semibold">Phone:</span> 8804934029</p>
              <p><span className="font-semibold">Email:</span> dkharmoney08@gmail.com</p>
              <p><span className="font-semibold">GSTIN:</span> 10ILGPK9201Q1ZT</p>
              <p><span className="font-semibold">State:</span> 10-Bihar</p>
            </div>
          </div>
        </div>

        <div className="border border-black border-b-0 flex text-xs">
          <div className="flex-1 border-r border-black">
            <div className="bg-gray-100 p-1 border-b border-black font-semibold">Bill To:</div>
            <div className="p-2 space-y-1">
              <p className="font-semibold">{invoice.customerName}</p>
              <div className="grid grid-cols-[70px_1fr] gap-1">
                <p>Address :</p>
                <p className="uppercase">{invoice.customerAddress}</p>

                <p>Pin Code :</p>
                <p>804426</p>

                <p>Contact :</p>
                <p>{invoice.customerPhone.replace('+91 ', '')}</p>
              </div>
            </div>
          </div>
          <div className="w-[350px]">
            <div className="bg-gray-100 p-1 border-b border-black font-semibold">Invoice Details:</div>
            <div className="p-2">
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <p>Invoice ID :</p>
                <p>{invoice.invoiceNumber}</p>

                <p>Date :</p>
                <p>{format(new Date(invoice.invoiceDate), 'EEEE, MMMM d, yyyy')}</p>

                <p>Time :</p>
                <p>07:28:53 PM</p>

                <p>Place of Supply :</p>
                <p>10-Bihar</p>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-xs text-center mb-0">
          <thead className="bg-gray-50">
            <tr className="border-b border-black">
              <th className="border-r border-black p-1 font-semibold w-8">#</th>
              <th className="border-r border-black p-1 font-semibold text-left pl-2">Item Name</th>
              <th className="border-r border-black p-1 font-semibold w-24">HSN/ SAC</th>
              <th className="border-r border-black p-1 font-semibold w-16">Quantity</th>
              <th className="border-r border-black p-1 font-semibold w-24">Price/ Unit (₹)</th>
              <th className="border-r border-black p-1 font-semibold w-24">GST(₹)</th>
              <th className="p-1 font-semibold w-24">Amount(₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black align-top h-16">
              <td className="border-r border-black p-1">1</td>
              <td className="border-r border-black p-1 text-left pl-2">WS MOBILITY {invoice.vehicleMake} {invoice.vehicleModel}</td>
              <td className="border-r border-black p-1">85116020</td>
              <td className="border-r border-black p-1">1</td>
              <td className="border-r border-black p-1">₹{invoice.taxableAmount.toFixed(2)}</td>
              <td className="border-r border-black p-1">₹{invoice.totalGst.toFixed(2)}</td>
              <td className="p-1">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</td>
            </tr>
            <tr className="font-semibold bg-gray-50">
              <td colSpan={4} className="border-r border-black p-1 text-right pr-2">Total</td>
              <td className="border-r border-black p-1">₹{invoice.taxableAmount.toFixed(2)}</td>
              <td className="border-r border-black p-1">₹{invoice.totalGst.toFixed(2)}</td>
              <td className="p-1">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Tax Summary Complex Table */}
        <table className="w-full table-fixed border-collapse border border-t-0 border-black text-[11px]">
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[7%]" />
            <col className="w-[9%]" />
            <col className="w-[7%]" />
            <col className="w-[9%]" />
            <col className="w-[8%]" />
            <col className="w-[24%]" />
            <col className="w-[18%]" />
          </colgroup>
          <tbody>
            <tr className="border-b border-black">
              <td colSpan={7} className="p-1 bg-gray-100 font-semibold border-r border-black">Tax Summary:</td>
              <td className="p-1 bg-gray-50 border-r border-black">Sub Total :</td>
              <td className="p-1 font-semibold text-right">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</td>
            </tr>

            {/* Header row 1 */}
            <tr className="text-center bg-gray-50 border-b border-black">
              <td rowSpan={2} className="border-r border-black p-1 align-middle">HSN/ SAC</td>
              <td rowSpan={2} className="border-r border-black p-1 align-middle">Taxable Amount (₹)</td>
              <td colSpan={2} className="border-r border-black p-0.5 border-b border-black">CGST</td>
              <td colSpan={2} className="border-r border-black p-0.5 border-b border-black">SGST</td>
              <td rowSpan={2} className="border-r border-black p-1 align-middle">Total Tax(₹)</td>
              <td rowSpan={2} className="p-1 font-semibold border-r border-black align-middle">Total :</td>
              <td rowSpan={2} className="p-1 text-right font-semibold align-middle">₹{invoice.grandTotal.toFixed(2)}</td>
            </tr>
            {/* Header row 2 (rate/amt sub-labels) */}
            <tr className="text-center bg-gray-50 border-b border-black">
              <td className="border-r border-black p-0.5">Rate (%)</td>
              <td className="border-r border-black p-0.5">Amt (₹)</td>
              <td className="border-r border-black p-0.5">Rate (%)</td>
              <td className="border-r border-black p-0.5">Amt (₹)</td>
            </tr>

            {/* Values + Amount in words */}
            <tr className="text-center border-b border-black">
              <td className="border-r border-black p-1 align-middle">85116020</td>
              <td className="border-r border-black p-1 align-middle">₹{invoice.taxableAmount.toFixed(2)}</td>
              <td className="border-r border-black p-1 align-middle">{invoice.cgstRate.toFixed(2)}%</td>
              <td className="border-r border-black p-1 align-middle">₹{invoice.cgstAmount.toFixed(2)}</td>
              <td className="border-r border-black p-1 align-middle">{invoice.sgstRate.toFixed(2)}%</td>
              <td className="border-r border-black p-1 align-middle">₹{invoice.sgstAmount.toFixed(2)}</td>
              <td className="border-r border-black p-1 align-middle">₹{invoice.totalGst.toFixed(2)}</td>
              <td colSpan={2} className="p-1 text-left align-top">
                <span className="font-semibold">Invoice Amount In Words :</span><br />
                <span className="font-bold">{numberToWords(invoice.grandTotal)}</span>
              </td>
            </tr>

            {/* Total + Received */}
            <tr className="font-semibold text-center border-b border-black">
              <td rowSpan={2} className="border-r border-black p-1 text-left align-middle">TOTAL</td>
              <td rowSpan={2} className="border-r border-black p-1 align-middle">₹{invoice.taxableAmount.toFixed(2)}</td>
              <td rowSpan={2} className="border-r border-black p-1"></td>
              <td rowSpan={2} className="border-r border-black p-1 align-middle">₹{invoice.cgstAmount.toFixed(2)}</td>
              <td rowSpan={2} className="border-r border-black p-1"></td>
              <td rowSpan={2} className="border-r border-black p-1 align-middle">₹{invoice.sgstAmount.toFixed(2)}</td>
              <td rowSpan={2} className="border-r border-black p-1 align-middle">₹{invoice.totalGst.toFixed(2)}</td>
              <td className="p-1 font-semibold border-r border-black text-left">Received</td>
              <td className="p-1 text-right">₹{invoice.amountPaid.toFixed(2)}</td>
            </tr>
            {/* Balance */}
            <tr className="font-semibold">
              <td className="p-1 font-semibold border-r border-black text-left">Balance</td>
              <td className="p-1 text-right">₹{invoice.outstandingAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer Boxes */}
        <div className="border border-t-0 border-black flex text-[11px] min-h-[140px]">
          <div className="flex-1 border-r border-black">
            <div className="bg-gray-100 p-1 font-semibold border-b border-black">Description:</div>
            <div className="p-2 space-y-1">
              <p><span className="font-semibold">Motor No :</span> {invoice.motorNumber || 'N/A'}</p>
              <p><span className="font-semibold">Charge No:</span> {invoice.chargeNumber || 'N/A'}</p>
              <p><span className="font-semibold">Controller No :</span> {invoice.controllerNumber || 'N/A'}</p>
              <p><span className="font-semibold">Chassis No :</span> {invoice.vin}</p>
              <p><span className="font-semibold">Battery Serial No:</span> {invoice.batterySerialNumber || 'N/A'}</p>
              <br />
              <p className="font-semibold">NOTES:</p>
              <p>Battery motor controller warranty =3year charger</p>
              <p>warranty =1year</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 p-1 font-semibold border-b border-black">Terms & Conditions:</div>
            <div className="p-2 font-semibold space-y-0.5">
              <p>Outer Damage Policy :</p>
              <p>1.All Disputes are subject to Jurisdiction of<br />Arwal</p>
              <p>2.battery,motor,controller,charger warranty is not<br />covered on water damage</p>
              <p>3.battery,motor,controller,charger courier charge<br />pay by customer</p>
              <p>4.goods once sold shall not be taken back</p>
            </div>
          </div>
        </div>

        <div className="border border-t-0 border-black flex text-[11px] min-h-[120px]">
          <div className="flex-1 border-r border-black">
            <div className="bg-gray-100 p-1 font-semibold border-b border-black">Bank Details:</div>
            <div className="p-2 grid grid-cols-[120px_1fr] gap-y-2">
              <p>Name:</p>
              <p className="uppercase">UNION BANK OF INDIA MOTIPUR</p>

              <p>Account No.:</p>
              <p>456801010001247</p>

              <p>IFSC code:</p>
              <p>UBIN0545686</p>

              <p>Account Holder's Name:</p>
              <p>Riya Enterprises</p>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="bg-gray-100 p-1 font-semibold border-b border-black">For Riya Enterprises:</div>
            {/* Empty space for signature */}
          </div>
        </div>
      </div>
    </div>
  );
};

export function numberToWords(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const convertBelowThousand = (num: number): string => {
    let str = "";

    if (num >= 100) {
      str += `${ones[Math.floor(num / 100)]} Hundred `;
      num %= 100;
    }

    if (num >= 20) {
      str += `${tens[Math.floor(num / 10)]} `;
      num %= 10;
    }

    if (num > 0) {
      str += `${ones[num]} `;
    }

    return str.trim();
  };

  const convert = (num: number): string => {
    if (num === 0) return "Zero";

    const crore = Math.floor(num / 10000000);
    num %= 10000000;

    const lakh = Math.floor(num / 100000);
    num %= 100000;

    const thousand = Math.floor(num / 1000);
    num %= 1000;

    const hundred = num;

    let result = "";

    if (crore) result += `${convertBelowThousand(crore)} Crore `;
    if (lakh) result += `${convertBelowThousand(lakh)} Lakh `;
    if (thousand) result += `${convertBelowThousand(thousand)} Thousand `;
    if (hundred) result += `${convertBelowThousand(hundred)}`;

    return result.trim();
  };

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = `${convert(rupees)} Rupees`;

  if (paise > 0) {
    words += ` and ${convert(paise)} Paise`;
  }

  words += " Only";

  return words;
}