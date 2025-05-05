
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Document {
  id: string;
  name: string;
  type?: string;
  dateUploaded: string;
  size: number;
  approved?: boolean;
  rejected?: boolean;
  url?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  source: string;
  type: "risk" | "opportunity" | "information";
  severity?: "low" | "medium" | "high";
  impact?: "low" | "medium" | "high";
  comments: Comment[];
  saved: boolean;
}

export interface Loan {
  id: string;
  businessName: string;
  loanType: string;
  propertyType: string;
  loanAmount: number;
  purpose: string;
  industry: string;
  yearsInOperation: number;
  sponsorName: string;
  sponsorTitle: string;
  sponsorEmail: string;
  sponsorPhone: string;
  propertyAddress: string;
  submissionDate: string;
  lastUpdated: string;
  status: string;
  documents?: Document[];
  insights?: Insight[];
  savedInsights?: Insight[];
}

interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, "id" | "submissionDate" | "lastUpdated" | "status">) => void;
  getLoan: (id: string) => Loan | undefined;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  getLoanById?: (id: string) => Loan | undefined;
  updateDocument?: (loanId: string, documentId: string, updates: Partial<Document>) => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const useLoanContext = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
};

export function useLoan() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoan must be used within a LoanProvider");
  }
  return context;
}

interface LoanProviderProps {
  children: ReactNode;
}

export function LoanProvider({ children }: LoanProviderProps) {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: "1",
      businessName: "Skyline Apartments",
      loanType: "Investment Property",
      propertyType: "Multifamily",
      loanAmount: 5000000,
      purpose: "Acquisition",
      industry: "Real Estate",
      yearsInOperation: 5,
      sponsorName: "John Smith",
      sponsorTitle: "CEO",
      sponsorEmail: "john@skylineapts.com",
      sponsorPhone: "(555) 123-4567",
      propertyAddress: "123 Main St, Anytown, USA",
      submissionDate: "2023-06-15T10:30:00Z",
      lastUpdated: "2023-06-15T10:30:00Z",
      status: "In Review",
      documents: [],
      insights: [],
      savedInsights: []
    },
    {
      id: "2",
      businessName: "Downtown Retail Plaza",
      loanType: "Owner-Occupied CRE",
      propertyType: "Retail",
      loanAmount: 3500000,
      purpose: "Refinance",
      industry: "Retail",
      yearsInOperation: 8,
      sponsorName: "Sarah Johnson",
      sponsorTitle: "Owner",
      sponsorEmail: "sarah@retailplaza.com",
      sponsorPhone: "(555) 987-6543",
      propertyAddress: "456 Market St, Metropolis, USA",
      submissionDate: "2023-06-10T14:45:00Z",
      lastUpdated: "2023-06-12T09:15:00Z",
      status: "Approved",
      documents: [],
      insights: [],
      savedInsights: []
    },
    {
      id: "3",
      businessName: "Riverside Hotel Development",
      loanType: "Construction",
      propertyType: "Hotel",
      loanAmount: 7500000,
      purpose: "New Construction",
      industry: "Hospitality",
      yearsInOperation: 12,
      sponsorName: "Michael Brown",
      sponsorTitle: "Managing Partner",
      sponsorEmail: "michael@riversidehotel.com",
      sponsorPhone: "(555) 456-7890",
      propertyAddress: "789 River Rd, Laketown, USA",
      submissionDate: "2023-06-05T11:20:00Z",
      lastUpdated: "2023-06-14T16:30:00Z",
      status: "Under Review",
      documents: [],
      insights: [],
      savedInsights: []
    },
    {
      id: "4",
      businessName: "Tech Office Park",
      loanType: "Owner-Occupied CRE",
      propertyType: "Office",
      loanAmount: 4200000,
      purpose: "Acquisition",
      industry: "Technology",
      yearsInOperation: 6,
      sponsorName: "Jennifer Lee",
      sponsorTitle: "CFO",
      sponsorEmail: "jennifer@techoffice.com",
      sponsorPhone: "(555) 222-3333",
      propertyAddress: "101 Innovation Way, Tech City, USA",
      submissionDate: "2023-05-25T09:15:00Z",
      lastUpdated: "2023-06-01T14:20:00Z",
      status: "In Progress",
      documents: [],
      insights: [],
      savedInsights: []
    },
    {
      id: "5",
      businessName: "Sunset Strip Mall",
      loanType: "Bridge",
      propertyType: "Retail",
      loanAmount: 2800000,
      purpose: "Renovation",
      industry: "Retail",
      yearsInOperation: 15,
      sponsorName: "Robert Garcia",
      sponsorTitle: "Owner",
      sponsorEmail: "robert@sunsetmall.com",
      sponsorPhone: "(555) 777-8888",
      propertyAddress: "500 Sunset Blvd, West Town, USA",
      submissionDate: "2023-06-18T13:40:00Z",
      lastUpdated: "2023-06-19T10:05:00Z",
      status: "New Application",
      documents: [],
      insights: [],
      savedInsights: []
    }
  ]);

  const addLoan = (loan: Omit<Loan, "id" | "submissionDate" | "lastUpdated" | "status">) => {
    const now = new Date().toISOString();
    const newLoan: Loan = {
      ...loan,
      id: Math.random().toString(36).substring(2, 9),
      submissionDate: now,
      lastUpdated: now,
      status: "New Application",
      // Provide defaults for any missing required fields
      businessName: loan.businessName || "Untitled Business",
      loanType: loan.loanType || "Investment Property",
      propertyType: loan.propertyType || "Multifamily",
      loanAmount: loan.loanAmount || 0,
      purpose: loan.purpose || "",
      industry: loan.industry || "",
      yearsInOperation: loan.yearsInOperation || 0,
      sponsorName: loan.sponsorName || "",
      sponsorTitle: loan.sponsorTitle || "",
      sponsorEmail: loan.sponsorEmail || "",
      sponsorPhone: loan.sponsorPhone || "",
      propertyAddress: loan.propertyAddress || "",
      documents: [],
      insights: [],
      savedInsights: []
    };
    setLoans([...loans, newLoan]);
  };

  const getLoan = (id: string) => {
    return loans.find(loan => loan.id === id);
  };
  
  const getLoanById = (id: string) => {
    return loans.find(loan => loan.id === id);
  };

  const updateLoan = (id: string, updatedLoan: Partial<Loan>) => {
    setLoans(loans.map(loan => 
      loan.id === id 
        ? { ...loan, ...updatedLoan, lastUpdated: new Date().toISOString() } 
        : loan
    ));
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };
  
  const updateDocument = (loanId: string, documentId: string, updates: Partial<Document>) => {
    setLoans(loans.map(loan => {
      if (loan.id !== loanId) return loan;
      
      return {
        ...loan,
        documents: loan.documents?.map(doc => {
          if (doc.id !== documentId) return doc;
          return { ...doc, ...updates };
        }) || []
      };
    }));
  };

  return (
    <LoanContext.Provider value={{ 
      loans, 
      addLoan, 
      getLoan, 
      updateLoan, 
      deleteLoan,
      getLoanById,
      updateDocument
    }}>
      {children}
    </LoanContext.Provider>
  );
}
