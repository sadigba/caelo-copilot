
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
    const docName = document.name.toLowerCase();
    
    // Business Tax Returns
    if (docName.includes('tax returns') || docName.includes('tax return')) {
      return (
        <>
          <h2>Business Tax Returns - Form 1120S</h2>
          <p className="text-sm text-muted-foreground mb-4">S Corporation Income Tax Return for Tax Year 2023</p>
          
          <div className="my-4 p-4 border rounded bg-gray-50">
            <h3 className="font-medium mb-3">Income Statement Summary</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Gross Receipts or Sales</td>
                  <td className="py-2 text-right">$387,450</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Returns and Allowances</td>
                  <td className="py-2 text-right">($12,340)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Cost of Goods Sold</td>
                  <td className="py-2 text-right">($156,800)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Gross Profit</td>
                  <td className="py-2 text-right font-medium">$218,310</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Total Deductions</td>
                  <td className="py-2 text-right">($165,220)</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold">Ordinary Business Income</td>
                  <td className="py-2 text-right font-bold">$53,090</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Key Deductions</h3>
            <ul className="text-sm space-y-1">
              <li>• Officer compensation: $45,000</li>
              <li>• Rent expenses: $36,000</li>
              <li>• Repairs and maintenance: $8,750</li>
              <li>• Insurance: $12,600</li>
              <li>• Utilities: $15,400</li>
            </ul>
          </div>
        </>
      );
    }
    
    // Restaurant Lease Agreement
    if (docName.includes('lease agreement') || docName.includes('lease')) {
      return (
        <>
          <h2>Commercial Lease Agreement</h2>
          <p className="text-sm text-muted-foreground mb-4">Restaurant Space - 456 Main Street, Springfield, IL</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Lease Terms</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 font-medium">Tenant:</td>
                    <td className="py-1">Maria's Family Restaurant, LLC</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Landlord:</td>
                    <td className="py-1">Springfield Commercial Properties</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Lease Term:</td>
                    <td className="py-1">5 years (January 1, 2023 - December 31, 2027)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Square Footage:</td>
                    <td className="py-1">2,400 sq ft</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Monthly Rent:</td>
                    <td className="py-1">$3,600 (Triple Net)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Security Deposit:</td>
                    <td className="py-1">$7,200 (2 months rent)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Additional Terms</h3>
              <ul className="text-sm space-y-1">
                <li>• Permitted use: Restaurant and food service operations</li>
                <li>• Option to renew for additional 5-year term</li>
                <li>• Tenant responsible for utilities, taxes, and insurance</li>
                <li>• Kitchen equipment included in lease</li>
                <li>• 20 parking spaces allocated</li>
              </ul>
            </div>
          </div>
        </>
      );
    }
    
    // Profit & Loss Statement
    if (docName.includes('profit') && docName.includes('loss')) {
      return (
        <>
          <h2>Profit & Loss Statement</h2>
          <p className="text-sm text-muted-foreground mb-4">Year-to-Date through October 31, 2024</p>
          
          <div className="my-4 border rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Account</th>
                  <th className="text-right p-3 font-medium">YTD 2024</th>
                  <th className="text-right p-3 font-medium">YTD 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Revenue</td>
                  <td className="p-3 text-right"></td>
                  <td className="p-3 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 pl-6">Food Sales</td>
                  <td className="p-3 text-right">$312,400</td>
                  <td className="p-3 text-right">$298,650</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 pl-6">Beverage Sales</td>
                  <td className="p-3 text-right">$89,200</td>
                  <td className="p-3 text-right">$84,100</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">Total Revenue</td>
                  <td className="p-3 text-right font-medium">$401,600</td>
                  <td className="p-3 text-right font-medium">$382,750</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cost of Goods Sold</td>
                  <td className="p-3 text-right">$140,560</td>
                  <td className="p-3 text-right">$134,962</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">Gross Profit</td>
                  <td className="p-3 text-right font-medium">$261,040</td>
                  <td className="p-3 text-right font-medium">$247,788</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Operating Expenses</td>
                  <td className="p-3 text-right">$198,450</td>
                  <td className="p-3 text-right">$189,200</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="p-3 font-bold">Net Income</td>
                  <td className="p-3 text-right font-bold">$62,590</td>
                  <td className="p-3 text-right font-bold">$58,588</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      );
    }
    
    // Financial Statements (Auto Shop)
    if (docName.includes('financial statements')) {
      return (
        <>
          <h2>Financial Statements</h2>
          <p className="text-sm text-muted-foreground mb-4">Mike's Auto Repair - Quarterly Report Q3 2024</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-3">Balance Sheet Summary</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-1 font-medium">Assets</td>
                    <td className="py-1 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Cash</td>
                    <td className="py-1 text-right">$48,500</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Accounts Receivable</td>
                    <td className="py-1 text-right">$23,800</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Inventory</td>
                    <td className="py-1 text-right">$67,200</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Equipment (net)</td>
                    <td className="py-1 text-right">$125,000</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-medium">Total Assets</td>
                    <td className="py-1 text-right font-medium">$264,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-3">Income Statement</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-1">Labor Revenue</td>
                    <td className="py-1 text-right">$145,600</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">Parts Sales</td>
                    <td className="py-1 text-right">$89,400</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1 font-medium">Total Revenue</td>
                    <td className="py-1 text-right font-medium">$235,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">Cost of Parts</td>
                    <td className="py-1 text-right">$53,640</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">Operating Expenses</td>
                    <td className="py-1 text-right">$98,500</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Net Income</td>
                    <td className="py-1 text-right font-medium">$82,860</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
    
    // Equipment Purchase Quotes
    if (docName.includes('equipment') && (docName.includes('quotes') || docName.includes('purchase'))) {
      return (
        <>
          <h2>Equipment Purchase Quotes</h2>
          <p className="text-sm text-muted-foreground mb-4">Hydraulic Lifts and Diagnostic Equipment - Mike's Auto Repair</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Quote #1 - AutoLift Pro Systems</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">2-Post Hydraulic Lift (10,000 lb capacity)</td>
                    <td className="py-1 text-right">$4,850</td>
                  </tr>
                  <tr>
                    <td className="py-1">4-Post Alignment Lift (12,000 lb capacity)</td>
                    <td className="py-1 text-right">$7,200</td>
                  </tr>
                  <tr>
                    <td className="py-1">Installation & Setup</td>
                    <td className="py-1 text-right">$1,500</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-medium">Subtotal</td>
                    <td className="py-1 text-right font-medium">$13,550</td>
                  </tr>
                  <tr>
                    <td className="py-1">Tax</td>
                    <td className="py-1 text-right">$949</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-bold">Total</td>
                    <td className="py-1 text-right font-bold">$14,499</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Quote #2 - Diagnostic Equipment Systems</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">Professional OBD Scanner</td>
                    <td className="py-1 text-right">$3,200</td>
                  </tr>
                  <tr>
                    <td className="py-1">Brake Lathe System</td>
                    <td className="py-1 text-right">$8,500</td>
                  </tr>
                  <tr>
                    <td className="py-1">Tire Balancer</td>
                    <td className="py-1 text-right">$2,800</td>
                  </tr>
                  <tr>
                    <td className="py-1">Training & Warranty (2 years)</td>
                    <td className="py-1 text-right">$850</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-bold">Total</td>
                    <td className="py-1 text-right font-bold">$15,350</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
    
    // Business License
    if (docName.includes('business license') || docName.includes('license')) {
      return (
        <>
          <h2>Business License</h2>
          <p className="text-sm text-muted-foreground mb-4">City of Springfield Business Operations License</p>
          
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-medium mb-3">License Information</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 font-medium">Business Name:</td>
                  <td className="py-1">Bella's Beauty Salon</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">License Number:</td>
                  <td className="py-1">BL-2024-0847</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Business Type:</td>
                  <td className="py-1">Personal Care Services - Beauty Salon</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Owner:</td>
                  <td className="py-1">Isabella Chen</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Address:</td>
                  <td className="py-1">123 Oak Avenue, Springfield, IL 62702</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Issue Date:</td>
                  <td className="py-1">January 15, 2024</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Expiration Date:</td>
                  <td className="py-1">January 15, 2025</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Status:</td>
                  <td className="py-1 text-green-600 font-medium">Active - Good Standing</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-medium mb-2">Permitted Activities</h3>
            <ul className="text-sm space-y-1">
              <li>• Hair cutting, styling, and coloring services</li>
              <li>• Manicure and pedicure services</li>
              <li>• Facial treatments and skin care</li>
              <li>• Retail sale of beauty products</li>
              <li>• Up to 6 styling stations</li>
            </ul>
          </div>
        </>
      );
    }
    
    // Renovation Estimates
    if (docName.includes('renovation') && docName.includes('estimates')) {
      return (
        <>
          <h2>Renovation Estimates</h2>
          <p className="text-sm text-muted-foreground mb-4">Bella's Beauty Salon - Interior Renovation Project</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Springfield Contractors LLC</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">Flooring (luxury vinyl plank)</td>
                    <td className="py-1 text-right">$4,200</td>
                  </tr>
                  <tr>
                    <td className="py-1">Interior painting (2 coats)</td>
                    <td className="py-1 text-right">$2,800</td>
                  </tr>
                  <tr>
                    <td className="py-1">Salon station installation (6 units)</td>
                    <td className="py-1 text-right">$8,400</td>
                  </tr>
                  <tr>
                    <td className="py-1">Lighting upgrade (LED fixtures)</td>
                    <td className="py-1 text-right">$3,200</td>
                  </tr>
                  <tr>
                    <td className="py-1">Plumbing (2 shampoo bowls)</td>
                    <td className="py-1 text-right">$2,400</td>
                  </tr>
                  <tr>
                    <td className="py-1">Electrical work</td>
                    <td className="py-1 text-right">$1,800</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-medium">Labor & Materials</td>
                    <td className="py-1 text-right font-medium">$22,800</td>
                  </tr>
                  <tr>
                    <td className="py-1">Permits & Fees</td>
                    <td className="py-1 text-right">$450</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-bold">Total Estimate</td>
                    <td className="py-1 text-right font-bold">$23,250</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-muted-foreground mt-2">Timeline: 3-4 weeks | Warranty: 2 years</p>
            </div>
          </div>
        </>
      );
    }
    
    // Bank Statements
    if (docName.includes('bank statements') || docName.includes('bank statement')) {
      return (
        <>
          <h2>Business Bank Statements</h2>
          <p className="text-sm text-muted-foreground mb-4">Springfield Community Bank - Business Checking Account</p>
          
          <div className="my-4 p-4 border rounded">
            <h3 className="font-medium mb-3">Account Summary - October 2024</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 font-medium">Account Number:</td>
                  <td className="py-1">****-****-****-4738</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Beginning Balance:</td>
                  <td className="py-1 text-right">$12,450.33</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Total Deposits:</td>
                  <td className="py-1 text-right">$38,725.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Total Withdrawals:</td>
                  <td className="py-1 text-right">($35,890.67)</td>
                </tr>
                <tr className="border-t">
                  <td className="py-1 font-bold">Ending Balance:</td>
                  <td className="py-1 text-right font-bold">$15,284.66</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Recent Transactions</h3>
            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">10/28</td>
                    <td className="p-2">Daily Sales Deposit</td>
                    <td className="p-2 text-right text-green-600">+$1,247.50</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">10/27</td>
                    <td className="p-2">Supply Invoice #2847</td>
                    <td className="p-2 text-right text-red-600">-$845.33</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">10/26</td>
                    <td className="p-2">Rent Payment</td>
                    <td className="p-2 text-right text-red-600">-$3,600.00</td>
                  </tr>
                  <tr>
                    <td className="p-2">10/25</td>
                    <td className="p-2">Weekend Sales Deposit</td>
                    <td className="p-2 text-right text-green-600">+$2,134.75</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
    
    // Insurance Documents
    if (docName.includes('insurance')) {
      return (
        <>
          <h2>Business Insurance Policy</h2>
          <p className="text-sm text-muted-foreground mb-4">General Liability & Property Insurance - Sweet Dreams Bakery</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded bg-gray-50">
              <h3 className="font-medium mb-3">Policy Information</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 font-medium">Policy Number:</td>
                    <td className="py-1">GL-2024-887432</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Insured:</td>
                    <td className="py-1">Sweet Dreams Bakery LLC</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Policy Period:</td>
                    <td className="py-1">01/01/2024 - 01/01/2025</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Premium:</td>
                    <td className="py-1">$2,845 annually</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-3">Coverage Details</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">General Liability</td>
                    <td className="py-1 text-right">$1,000,000 per occurrence</td>
                  </tr>
                  <tr>
                    <td className="py-1">Product Liability</td>
                    <td className="py-1 text-right">$1,000,000 per occurrence</td>
                  </tr>
                  <tr>
                    <td className="py-1">Property Coverage</td>
                    <td className="py-1 text-right">$250,000</td>
                  </tr>
                  <tr>
                    <td className="py-1">Equipment Breakdown</td>
                    <td className="py-1 text-right">$100,000</td>
                  </tr>
                  <tr>
                    <td className="py-1">Business Interruption</td>
                    <td className="py-1 text-right">$150,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
    
    // Equipment Appraisal
    if (docName.includes('equipment appraisal') || docName.includes('appraisal')) {
      return (
        <>
          <h2>Equipment Appraisal Report</h2>
          <p className="text-sm text-muted-foreground mb-4">Professional Bakery Equipment Valuation</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-3">Appraisal Summary</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 font-medium">Appraisal Date:</td>
                    <td className="py-1">October 15, 2024</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Appraiser:</td>
                    <td className="py-1">Midwest Equipment Appraisers, LLC</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Purpose:</td>
                    <td className="py-1">Loan Collateral Valuation</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-1 font-bold">Total Appraised Value:</td>
                    <td className="py-1 text-right font-bold">$47,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="border rounded overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Equipment</th>
                    <th className="text-center p-3">Year</th>
                    <th className="text-center p-3">Condition</th>
                    <th className="text-right p-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Hobart 60qt Spiral Mixer</td>
                    <td className="p-3 text-center">2019</td>
                    <td className="p-3 text-center">Excellent</td>
                    <td className="p-3 text-right">$12,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Blodgett Double Deck Oven</td>
                    <td className="p-3 text-center">2020</td>
                    <td className="p-3 text-center">Very Good</td>
                    <td className="p-3 text-right">$18,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Refrigerated Display Case</td>
                    <td className="p-3 text-center">2021</td>
                    <td className="p-3 text-center">Good</td>
                    <td className="p-3 text-right">$8,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Proof Cabinet (2 units)</td>
                    <td className="p-3 text-center">2022</td>
                    <td className="p-3 text-center">Excellent</td>
                    <td className="p-3 text-right">$6,000</td>
                  </tr>
                  <tr>
                    <td className="p-3">Misc. Small Equipment</td>
                    <td className="p-3 text-center">Various</td>
                    <td className="p-3 text-center">Good</td>
                    <td className="p-3 text-right">$2,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
    
    // Business Plan
    if (docName.includes('business plan')) {
      return (
        <>
          <h2>Business Plan</h2>
          <p className="text-sm text-muted-foreground mb-4">Sweet Dreams Bakery - Expansion Plan 2024-2026</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Executive Summary</h3>
              <p className="text-sm">
                Sweet Dreams Bakery has been serving the Springfield community for 5 years, 
                specializing in custom cakes, artisan breads, and pastries. This business plan 
                outlines our strategy for equipment upgrades and market expansion to increase 
                production capacity by 40% and revenue by 35% over the next two years.
              </p>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-3">Financial Projections</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Year</th>
                    <th className="border p-2 text-right">Revenue</th>
                    <th className="border p-2 text-right">Expenses</th>
                    <th className="border p-2 text-right">Net Income</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">2024 (Current)</td>
                    <td className="border p-2 text-right">$285,000</td>
                    <td className="border p-2 text-right">$210,000</td>
                    <td className="border p-2 text-right">$75,000</td>
                  </tr>
                  <tr>
                    <td className="border p-2">2025 (Projected)</td>
                    <td className="border p-2 text-right">$340,000</td>
                    <td className="border p-2 text-right">$245,000</td>
                    <td className="border p-2 text-right">$95,000</td>
                  </tr>
                  <tr>
                    <td className="border p-2">2026 (Projected)</td>
                    <td className="border p-2 text-right">$385,000</td>
                    <td className="border p-2 text-right">$270,000</td>
                    <td className="border p-2 text-right">$115,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Use of Loan Proceeds</h3>
              <ul className="text-sm space-y-1">
                <li>• Commercial oven upgrade: $20,000</li>
                <li>• Additional display cases: $8,000</li>
                <li>• Storefront improvements: $5,000</li>
                <li>• Working capital: $2,000</li>
              </ul>
            </div>
          </div>
        </>
      );
    }
    
    // Default fallback for any other documents
    return (
      <>
        <h2>{document.name.replace('.pdf', '').replace('.xlsx', '')} - Sample Content</h2>
        <p>This document contains information related to the small business loan application.</p>
        <p>Page {currentPage} contains relevant details for the underwriting process.</p>
        <div className="my-4 p-4 border rounded bg-gray-50">
          <p className="text-sm">
            This is a sample display of a document that would typically be reviewed as part of 
            the small business loan application process. The actual content would include 
            detailed information specific to the business operations and financial status.
          </p>
        </div>
        <p>The complete document consists of {totalPages} pages with comprehensive information needed for loan evaluation.</p>
      </>
    );
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
