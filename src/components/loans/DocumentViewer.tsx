
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

  const getDocumentContent = () => {
    // Check if document name contains a specific keyword to show appropriate mock content
    if (document.type?.toLowerCase().includes('rent roll')) {
      return (
        <>
          <h2>Property Rent Roll - Sample Content</h2>
          <p>This document contains information about the rental properties, including unit details, tenant information, lease terms, and rental rates.</p>
          <table className="w-full border-collapse my-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Unit</th>
                <th className="border p-2 text-left">Tenant</th>
                <th className="border p-2 text-right">Rent</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">101</td>
                <td className="border p-2">John Smith</td>
                <td className="border p-2 text-right">$1,500</td>
                <td className="border p-2 text-center">Occupied</td>
              </tr>
              <tr>
                <td className="border p-2">102</td>
                <td className="border p-2">Jane Doe</td>
                <td className="border p-2 text-right">$1,700</td>
                <td className="border p-2 text-center">Occupied</td>
              </tr>
              <tr>
                <td className="border p-2">202</td>
                <td className="border p-2">Vacant</td>
                <td className="border p-2 text-right">$2,100</td>
                <td className="border p-2 text-center">Vacant</td>
              </tr>
            </tbody>
          </table>
          <p>The above information represents the current occupancy and rental rates for the property as of the date of this report.</p>
        </>
      );
    } else if (document.type?.toLowerCase().includes('tax return') || document.name.toLowerCase().includes('tax return')) {
      return (
        <>
          <h2>Tax Returns - Sample Content</h2>
          <p>This document contains tax return information for the property owner, including income, expenses, and tax liability for the most recent fiscal year.</p>
          <div className="my-4 p-4 border rounded bg-gray-50">
            <h3 className="font-medium">Income Summary</h3>
            <table className="w-full my-2">
              <tbody>
                <tr>
                  <td className="py-1">Gross Rental Income</td>
                  <td className="py-1 text-right">$345,000</td>
                </tr>
                <tr>
                  <td className="py-1">Other Income</td>
                  <td className="py-1 text-right">$18,500</td>
                </tr>
                <tr className="border-t">
                  <td className="py-1 font-medium">Total Income</td>
                  <td className="py-1 text-right font-medium">$363,500</td>
                </tr>
              </tbody>
            </table>
            
            <h3 className="font-medium mt-4">Expenses Summary</h3>
            <table className="w-full my-2">
              <tbody>
                <tr>
                  <td className="py-1">Property Management</td>
                  <td className="py-1 text-right">$32,700</td>
                </tr>
                <tr>
                  <td className="py-1">Repairs and Maintenance</td>
                  <td className="py-1 text-right">$41,200</td>
                </tr>
                <tr>
                  <td className="py-1">Insurance</td>
                  <td className="py-1 text-right">$18,900</td>
                </tr>
                <tr>
                  <td className="py-1">Property Taxes</td>
                  <td className="py-1 text-right">$29,000</td>
                </tr>
                <tr className="border-t">
                  <td className="py-1 font-medium">Total Expenses</td>
                  <td className="py-1 text-right font-medium">$121,800</td>
                </tr>
              </tbody>
            </table>
            
            <h3 className="font-medium mt-4">Net Income</h3>
            <table className="w-full my-2">
              <tbody>
                <tr className="border-t border-b">
                  <td className="py-1 font-medium">Net Taxable Income</td>
                  <td className="py-1 text-right font-medium">$241,700</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      );
    } else if (document.type?.toLowerCase().includes('construction')) {
      return (
        <>
          <h2>Construction Documentation - Sample Content</h2>
          <p>This document contains plans, specifications, and budgets related to the construction project.</p>
          
          <h3 className="font-medium mt-4">Construction Schedule</h3>
          <table className="w-full border-collapse my-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Phase</th>
                <th className="border p-2 text-left">Start Date</th>
                <th className="border p-2 text-left">End Date</th>
                <th className="border p-2 text-right">Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Site Preparation</td>
                <td className="border p-2">June 1, 2025</td>
                <td className="border p-2">July 15, 2025</td>
                <td className="border p-2 text-right">$450,000</td>
              </tr>
              <tr>
                <td className="border p-2">Foundation</td>
                <td className="border p-2">July 20, 2025</td>
                <td className="border p-2">August 30, 2025</td>
                <td className="border p-2 text-right">$850,000</td>
              </tr>
              <tr>
                <td className="border p-2">Framing</td>
                <td className="border p-2">September 5, 2025</td>
                <td className="border p-2">November 15, 2025</td>
                <td className="border p-2 text-right">$1,200,000</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-4 border rounded p-4">
            <h3 className="font-medium">Construction Notes</h3>
            <p className="mt-2">The project is scheduled for completion in Q4 2026, with an estimated total budget of $5,000,000. All necessary permits have been obtained and contractors have been selected through a competitive bidding process.</p>
          </div>
        </>
      );
    } else if (document.type?.toLowerCase().includes('appraisal')) {
      return (
        <>
          <h2>Property Appraisal - Sample Content</h2>
          <p>This document contains a professional appraisal of the property value based on location, condition, and comparable properties.</p>
          
          <div className="my-4 p-4 border rounded bg-gray-50">
            <h3 className="font-medium">Appraisal Summary</h3>
            <table className="w-full my-4">
              <tbody>
                <tr>
                  <td className="py-1 font-medium">Property Address:</td>
                  <td className="py-1">123 Main St, Anytown, USA</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Property Type:</td>
                  <td className="py-1">Multifamily Residential</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Total Units:</td>
                  <td className="py-1">24</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Building Size:</td>
                  <td className="py-1">28,500 sq ft</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Lot Size:</td>
                  <td className="py-1">1.2 acres</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Year Built:</td>
                  <td className="py-1">2010</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Condition:</td>
                  <td className="py-1">Good</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Appraised Value:</td>
                  <td className="py-2 font-bold">$3,750,000</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-sm text-muted-foreground mt-4">
              This appraisal was conducted by Smith & Associates on April 15, 2025. The value estimate is based on recent comparable sales, income approach, and replacement cost analysis.
            </p>
          </div>
        </>
      );
    } else if (document.name.toLowerCase().includes('financial') || document.type?.toLowerCase().includes('financial')) {
      return (
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
          
          <div className="my-4 border-t pt-4">
            <h3 className="font-medium">Key Financial Metrics</h3>
            <table className="w-full border-collapse my-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Metric</th>
                  <th className="border p-2 text-right">2023</th>
                  <th className="border p-2 text-right">2024</th>
                  <th className="border p-2 text-right">2025 (Projected)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Gross Revenue</td>
                  <td className="border p-2 text-right">$450,000</td>
                  <td className="border p-2 text-right">$487,000</td>
                  <td className="border p-2 text-right">$525,000</td>
                </tr>
                <tr>
                  <td className="border p-2">Operating Expenses</td>
                  <td className="border p-2 text-right">$180,000</td>
                  <td className="border p-2 text-right">$195,000</td>
                  <td className="border p-2 text-right">$210,000</td>
                </tr>
                <tr>
                  <td className="border p-2">NOI</td>
                  <td className="border p-2 text-right">$270,000</td>
                  <td className="border p-2 text-right">$292,000</td>
                  <td className="border p-2 text-right">$315,000</td>
                </tr>
                <tr>
                  <td className="border p-2">DSCR</td>
                  <td className="border p-2 text-right">1.35</td>
                  <td className="border p-2 text-right">1.46</td>
                  <td className="border p-2 text-right">1.58</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      );
    } else {
      // Generic document content for other document types
      return (
        <>
          <h2>{document.name.replace('.pdf', '').replace('.xlsx', '')} - Sample Content</h2>
          <p>This document contains information related to the commercial real estate loan application.</p>
          <p>Page {currentPage} contains relevant details for the underwriting process.</p>
          <div className="my-4 p-4 border rounded bg-gray-50">
            <p className="text-sm">
              This is a sample display of a document that would typically be reviewed as part of 
              the commercial real estate loan application process. The actual content would include 
              detailed information specific to the property, business operations, and financial status.
            </p>
          </div>
          <p>The complete document consists of {totalPages} pages with comprehensive information needed for loan evaluation.</p>
        </>
      );
    }
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
          {/* Header with controls */}
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle>{document.name}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>

          {/* Document content */}
          <div className="flex-1 overflow-auto bg-secondary p-8 flex justify-center">
            <div className="bg-white shadow-sm w-full max-w-4xl min-h-[800px] p-8 rounded">
              {/* Mock document content */}
              <div className="prose max-w-none">
                <h1>{document.name.replace('.pdf', '').replace('.xlsx', '')}</h1>
                <p className="text-muted-foreground mb-6">Page {currentPage} of {totalPages}</p>
                {getDocumentContent()}
              </div>
            </div>
          </div>

          {/* Footer with page controls */}
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Document uploaded on {document.dateUploaded ? new Date(document.dateUploaded).toLocaleDateString() : "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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
