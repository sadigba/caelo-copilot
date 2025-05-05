
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/context/LoanContext";
import { FileText, ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { toast } from "sonner";

interface DocumentViewerProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, open, onClose }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Mock number of pages

  if (!document) return null;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownload = () => {
    toast.success(`${document.name} downloaded`);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <style>{`
          [data-dialog-close] {
            display: none;
          }
        `}</style>
        <div className="flex flex-col h-full">
          {/* Header with controls - updated to match the modern UI */}
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-modern-dark-gray" />
              <DialogTitle>{document.name}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="border-modern-border-gray text-modern-dark-gray hover:bg-modern-light-gray"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0 text-modern-dark-gray hover:bg-modern-light-gray"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>

          {/* Document content */}
          <div className="flex-1 overflow-auto bg-modern-light-gray p-8 flex justify-center">
            <div className="bg-white shadow-sm w-full max-w-4xl min-h-[800px] p-8 rounded-lg">
              {/* Mock document content */}
              <div className="prose max-w-none">
                <h1>{document.name.replace('.pdf', '')}</h1>
                <p className="text-muted-foreground mb-6">Page {currentPage} of {totalPages}</p>
                
                {document.type?.toLowerCase().includes('rent roll') ? (
                  <>
                    <h2>Property Rent Roll - Sample Content</h2>
                    <p>This document contains information about the rental properties, including unit details, tenant information, lease terms, and rental rates.</p>
                    <table className="w-full border-collapse my-4">
                      <thead>
                        <tr className="bg-modern-light-gray">
                          <th className="border border-modern-border-gray p-2 text-left">Unit</th>
                          <th className="border border-modern-border-gray p-2 text-left">Tenant</th>
                          <th className="border border-modern-border-gray p-2 text-right">Rent</th>
                          <th className="border border-modern-border-gray p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-modern-border-gray p-2">101</td>
                          <td className="border border-modern-border-gray p-2">John Smith</td>
                          <td className="border border-modern-border-gray p-2 text-right">$1,500</td>
                          <td className="border border-modern-border-gray p-2 text-center">Occupied</td>
                        </tr>
                        <tr>
                          <td className="border border-modern-border-gray p-2">102</td>
                          <td className="border border-modern-border-gray p-2">Jane Doe</td>
                          <td className="border border-modern-border-gray p-2 text-right">$1,700</td>
                          <td className="border border-modern-border-gray p-2 text-center">Occupied</td>
                        </tr>
                        <tr>
                          <td className="border border-modern-border-gray p-2">202</td>
                          <td className="border border-modern-border-gray p-2">Vacant</td>
                          <td className="border border-modern-border-gray p-2 text-right">$2,100</td>
                          <td className="border border-modern-border-gray p-2 text-center">Vacant</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>The above information represents the current occupancy and rental rates for the property as of the date of this report.</p>
                  </>
                ) : (
                  <>
                    <h2>Financial Document - Sample Content</h2>
                    <p>This document contains financial information related to the property, including income statements, balance sheets, and cash flow projections.</p>
                    <p>Page {currentPage} contains the following information:</p>
                    <ul>
                      <li>Annual revenue projections</li>
                      <li>Operating expenses breakdown</li>
                      <li>Net operating income calculation</li>
                      <li>Debt service coverage ratio analysis</li>
                    </ul>
                    <p>The financial analysis indicates a stable cash flow with a positive trend in rental income over the past three years.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer with page controls - updated to match modern UI */}
          <div className="px-6 py-4 border-t flex justify-between items-center bg-white">
            <div className="text-sm text-modern-dark-gray">
              Document uploaded on {new Date(document.dateUploaded).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="border-modern-border-gray text-modern-dark-gray hover:bg-modern-light-gray"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm mx-2 text-modern-dark-gray">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="border-modern-border-gray text-modern-dark-gray hover:bg-modern-light-gray"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
