"use client";

import React, { RefObject } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  /** A ref to the HTML element that should be printed */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Optionally customize the button text */
  label?: string;
}

export default function ExportButton({ contentRef, label }: ExportButtonProps) {
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Export Data",
    bodyClass: "p-4",
    onPrintError: (errorLocation: "onBeforePrint" | "print", error: Error) =>
      toast.error(errorLocation + "" + error),
  });

  return (
    <Button variant="ghost" onClick={() => reactToPrintFn()}>
      <FileX />
      {label ?? "Export PDF"}
    </Button>
  );
}
