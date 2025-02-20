"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfView(props: { pdfUrl: string }) {
  const [numPages, setNumPages] = useState(0);
  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
    setNumPages(nextNumPages);
  }
  return (
    <div className="overflow-hidden  flex justify-center items-center p-4">
      <Document file={props.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Carousel className="w-full h-[90vh] max-h-[90vh] max-w-xl  ">
          <CarouselContent>
            {Array.from({ length: numPages }, (_, index) => (
              <CarouselItem key={`page_${index + 1}`} className="border ">
                <Page
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className={"  "}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Document>
    </div>
  );
}
