"use client";

import React, { RefObject } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { FileX, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



interface ExportButtonProps {
  /** A ref to the HTML element that should be printed */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Optionally customize the button text */
  excelData?: Record<string, any>[];
  excelFilename?: string;
  label?: string;
}

export default function ExportButton({ contentRef, label, excelData,
  excelFilename = "export.xlsx", }: ExportButtonProps) {
  const { t } = useTranslation(); // "export" key from JSON

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Export Data",
    bodyClass: "p-4",
    onPrintError: (errorLocation: "onBeforePrint" | "print", error: Error) =>
      toast.error(errorLocation + "" + error),
  });

  const handleExcelDownload = () => {
    if (!Array.isArray(excelData) || excelData.length === 0) {
      toast.error(t("noDataToExport") ?? "No data to export.");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, excelFilename);
      toast.success(t("excelDownloadSuccess") ?? "Excel downloaded.");
    } catch (err) {
      console.error("Excel export error:", err);
      toast.error(t("excelDownloadError") ?? "Failed to download Excel.");
    }
  };


  return (
    <div className="flex gap-2">
      <Button variant="ghost" onClick={() => reactToPrintFn()}>
        <FileX />
        {label ?? t("exportt")}    </Button>
      <Button variant="ghost" onClick={handleExcelDownload}>
        <FileDown className="mr-2" />
        {t("exportExcel") ?? "Export Excel"}
      </Button>
    </div>

  );
}
