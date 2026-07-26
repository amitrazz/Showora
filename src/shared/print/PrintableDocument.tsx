import React from "react";
import { InvoicePrintDocument } from "@/features/invoices/components/InvoicePrintDocument";

interface PrintableDocumentProps {
  type: string;
  data: any;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({ type, data }) => {
  if (!data) return null;

  switch (type) {
    case "invoice":
      return <InvoicePrintDocument invoice={data} />;
    default:
      return (
        <div className="p-8 text-center text-destructive font-medium bg-white rounded-lg border">
          Unsupported document type for print/PDF export: {type}
        </div>
      );
  }
};
