import React, { createContext, useContext, useState, ReactNode } from "react";

interface Loan {
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
  status?: string;
}

interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, "id" | "submissionDate" | "lastUpdated" | "status">) => void;
  getLoan: (id: string) => Loan | undefined;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

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
      status: "In Review"
    },
    {
      id: "2",
      businessName: "Downtown Retail Plaza",
      loanType: "Commercial Real Estate",
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
      status: "Approved"
    },
    {
      id: "3",
      businessName: "Riverside Hotel",
      loanType: "Hospitality",
      propertyType: "Hotel",
      loanAmount: 7500000,
      purpose: "Renovation",
      industry: "Hospitality",
      yearsInOperation: 12,
      sponsorName: "Michael Brown",
      sponsorTitle: "Managing Partner",
      sponsorEmail: "michael@riversidehotel.com",
      sponsorPhone: "(555) 456-7890",
      propertyAddress: "789 River Rd, Laketown, USA",
      submissionDate: "2023-06-05T11:20:00Z",
      lastUpdated: "2023-06-14T16:30:00Z",
      status: "Under Review"
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
      propertyAddress: loan.propertyAddress || ""
    };
    setLoans([...loans, newLoan]);
  };

  const getLoan = (id: string) => {
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

  return (
    <LoanContext.Provider value={{ loans, addLoan, getLoan, updateLoan, deleteLoan }}>
      {children}
    </LoanContext.Provider>
  );
}
