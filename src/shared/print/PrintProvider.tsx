import React, { createContext, useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
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

const generatePdfFromElement = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution
    useCORS: true, // Allow cross-origin images (e.g. logos)
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: 800, // Lock window width to ensure consistent layout
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  
  // A4 dimensions: 210mm x 297mm
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Calculate height in mm based on canvas aspect ratio
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;

  // Page 1
  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Multi-page support
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
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

  // Initialize react-to-print
  const triggerReactToPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeJob?.filename?.replace(/\.pdf$/, "") || "Document",
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
            position: "absolute", 
            left: "-9999px", 
            top: "-9999px", 
            width: "800px", 
            opacity: 1, 
            pointerEvents: "none",
            zIndex: -9999
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
