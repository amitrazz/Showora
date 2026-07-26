import React, { createContext, useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";
import { PrintableDocument } from "./PrintableDocument";
import { toast } from "sonner";

interface PrintContextType {
  printDocument: (type: string, data: any) => Promise<void>;
  exportPdf: (type: string, data: any, filename?: string) => Promise<void>;
  isPrinting: boolean;
  isExporting: boolean;
}

export const PrintContext = createContext<PrintContextType | undefined>(undefined);

interface ActiveJob {
  type: string;
  data: any;
  action: "print" | "pdf";
  filename?: string;
  resolve: () => void;
  reject: (err: any) => void;
}

const generatePdfFromElement = async (
  element: HTMLElement,
  filename: string
) => {
  const canvas = await toCanvas(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = canvas.height * imgWidth / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
};

export const PrintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [isReady, setIsReady] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const isPrinting = activeJob?.action === "print";
  const isExporting = activeJob?.action === "pdf";

  const triggerReactToPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeJob?.filename?.replace(/\.pdf$/, "") || "Document",

    pageStyle: `
    @page {
      size: A4 portrait;
      margin: 8mm;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 210mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  `,
  });

  // Effect to wait for render frame before triggering action
  useEffect(() => {
    if (activeJob && !isReady) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 150); // Small delay to guarantee DOM painted
      return () => clearTimeout(timer);
    }
  }, [activeJob, isReady]);

  // Effect to execute the action when ready
  useEffect(() => {
    if (activeJob && isReady) {
      const executeJob = async () => {
        const toastId = toast.loading(
          activeJob.action === "print"
            ? "Preparing print job..."
            : "Generating PDF document..."
        );

        try {
          if (activeJob.action === "print") {
            triggerReactToPrint();
            toast.dismiss(toastId);
            toast.success("Document sent to printer");
            activeJob.resolve();
          } else if (activeJob.action === "pdf") {
            const element = printRef.current;
            if (!element) {
              throw new Error("Printable element not found in DOM");
            }
            await generatePdfFromElement(element, activeJob.filename || `${activeJob.type}.pdf`);
            toast.dismiss(toastId);
            toast.success("PDF downloaded successfully");
            activeJob.resolve();
          }
        } catch (error: any) {
          toast.dismiss(toastId);
          toast.error(`Error: ${error?.message || "Failed to process document"}`);
          activeJob.reject(error);
        } finally {
          setActiveJob(null);
          setIsReady(false);
        }
      };

      executeJob();
    }
  }, [activeJob, isReady, triggerReactToPrint]);

  const printDocument = (type: string, data: any) => {
    return new Promise<void>((resolve, reject) => {
      if (activeJob) {
        toast.error("Another document is currently being processed.");
        reject(new Error("Job in progress"));
        return;
      }
      setActiveJob({
        type,
        data,
        action: "print",
        resolve,
        reject,
      });
    });
  };

  const exportPdf = (type: string, data: any, filename?: string) => {
    return new Promise<void>((resolve, reject) => {
      if (activeJob) {
        toast.error("Another document is currently being processed.");
        reject(new Error("Job in progress"));
        return;
      }
      setActiveJob({
        type,
        data,
        action: "pdf",
        filename: filename || `${type}.pdf`,
        resolve,
        reject,
      });
    });
  };

  return (
    <PrintContext.Provider value={{ printDocument, exportPdf, isPrinting, isExporting }}>
      {children}

      {/* Hidden container for printing/PDF capture */}
      {activeJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "-10000px",
            pointerEvents: "none",
            width: "210mm",
            background: "#fff",
            zIndex: -1,
          }}
        >
          <div ref={printRef}>
            <PrintableDocument type={activeJob.type} data={activeJob.data} />
          </div>
        </div>
      )}
    </PrintContext.Provider>
  );
};
