import { useContext } from "react";
import { PrintContext } from "./PrintProvider";

export const usePrintDocument = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error("usePrintDocument must be used within a PrintProvider");
  }
  return {
    printDocument: context.printDocument,
    isPrinting: context.isPrinting,
  };
};

export const usePdfExport = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error("usePdfExport must be used within a PrintProvider");
  }
  return {
    exportPdf: context.exportPdf,
    isExporting: context.isExporting,
  };
};
