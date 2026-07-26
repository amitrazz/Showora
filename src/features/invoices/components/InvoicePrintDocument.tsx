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
        <div className="border border-t-0 border-black flex flex-col text-[11px]">
          <div className="flex border-b border-black">
            <div className="flex-[3] p-1 bg-gray-100 font-semibold border-r border-black">Tax Summary:</div>
            <div className="flex-[2] flex">
              <div className="flex-1 p-1 bg-gray-50 border-r border-black">Sub Total :</div>
              <div className="w-24 p-1 font-semibold text-right">₹{(invoice.taxableAmount + invoice.totalGst).toFixed(2)}</div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-[3] border-r border-black flex flex-col">
              {/* Headers */}
              <div className="flex border-b border-black text-center bg-gray-50">
                <div className="w-20 border-r border-black p-1 flex items-center justify-center">HSN/ SAC</div>
                <div className="w-24 border-r border-black p-1 flex items-center justify-center">Taxable Amount<br />(₹)</div>
                <div className="flex-1 border-r border-black">
                  <div className="border-b border-black p-0.5">CGST</div>
                  <div className="flex">
                    <div className="flex-1 border-r border-black p-0.5">Rate (%)</div>
                    <div className="flex-1 p-0.5">Amt (₹)</div>
                  </div>
                </div>
                <div className="flex-1 border-r border-black">
                  <div className="border-b border-black p-0.5">SGST</div>
                  <div className="flex">
                    <div className="flex-1 border-r border-black p-0.5">Rate (%)</div>
                    <div className="flex-1 p-0.5">Amt (₹)</div>
                  </div>
                </div>
                <div className="w-20 p-1 flex items-center justify-center">Total Tax(₹)</div>
              </div>

              {/* Values */}
              <div className="flex border-b border-black text-center">
                <div className="w-20 border-r border-black p-1">85116020</div>
                <div className="w-24 border-r border-black p-1">₹{invoice.taxableAmount.toFixed(2)}</div>

                <div className="flex-1 border-r border-black flex">
                  <div className="flex-1 border-r border-black p-1">{invoice.cgstRate.toFixed(2)}%</div>
                  <div className="flex-1 p-1">₹{invoice.cgstAmount.toFixed(2)}</div>
                </div>

                <div className="flex-1 border-r border-black flex">
                  <div className="flex-1 border-r border-black p-1">{invoice.sgstRate.toFixed(2)}%</div>
                  <div className="flex-1 p-1">₹{invoice.sgstAmount.toFixed(2)}</div>
                </div>

                <div className="w-20 p-1">₹{invoice.totalGst.toFixed(2)}</div>
              </div>

              {/* Total */}
              <div className="flex font-semibold">
                <div className="w-20 border-r border-black p-1 text-left">TOTAL</div>
                <div className="w-24 border-r border-black p-1 text-center">₹{invoice.taxableAmount.toFixed(2)}</div>

                <div className="flex-1 border-r border-black flex">
                  <div className="flex-1 border-r border-black p-1"></div>
                  <div className="flex-1 p-1 text-center">₹{invoice.cgstAmount.toFixed(2)}</div>
                </div>

                <div className="flex-1 border-r border-black flex">
                  <div className="flex-1 border-r border-black p-1"></div>
                  <div className="flex-1 p-1 text-center">₹{invoice.sgstAmount.toFixed(2)}</div>
                </div>

                <div className="w-20 p-1 text-center">₹{invoice.totalGst.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex-[2] flex flex-col">
              <div className="flex border-b border-black">
                <div className="flex-1 p-1 font-semibold border-r border-black">Total :</div>
                <div className="w-24 p-1 text-right font-semibold">₹{invoice.grandTotal.toFixed(2)}</div>
              </div>
              <div className="border-b border-black p-1">
                <span className="font-semibold">Invoice Amount In Words :</span><br />
                <span className="font-bold">{numberToWords(invoice.grandTotal)}</span>
              </div>
              <div className="flex border-b border-black">
                <div className="flex-1 p-1 font-semibold border-r border-black">Received</div>
                <div className="w-24 p-1 text-right">₹{invoice.amountPaid.toFixed(2)}</div>
              </div>
              <div className="flex">
                <div className="flex-1 p-1 font-semibold border-r border-black">Balance</div>
                <div className="w-24 p-1 text-right">₹{invoice.outstandingAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

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