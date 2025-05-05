import React, { createContext, useContext, useState } from "react";

export interface Comment {
  id?: string;
  text: string;
  author?: string;
  timestamp?: string;
}

export interface Insight {
  id: string;
  title: string;
  narrative: string;
  evidence: string[];
  saved?: boolean;
  comments?: Comment[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type?: string;
  approved: boolean;
  rejected: boolean;
}

export interface Loan {
  id: string;
  businessName: string;
  loanType: string;
  propertyType: string;
  loanAmount: number;
  loanTerm: number;
  interestRate: number;
  originationDate: string;
  maturityDate: string;
  status: string;
  documents: Document[];
  insights: Insight[];
  savedInsights: Insight[];
}

interface LoanContextType {
  loans: Loan[];
  getLoanById: (id: string) => Loan | undefined;
  addLoan: (loan: Omit<Loan, 'id' | 'documents' | 'insights' | 'savedInsights'>) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  addDocument: (loanId: string, document: Omit<Document, 'id'>) => void;
  updateDocument: (loanId: string, documentId: string, updates: Partial<Document>) => void;
  deleteDocument: (loanId: string, documentId: string) => void;
  saveInsight: (loanId: string, insightId: string) => void;
  unsaveInsight: (loanId: string, insightId: string) => void;
  addInsight: (loanId: string, insight: Omit<Insight, 'id' | 'saved'>) => void;
  addComment: (loanId: string, insightId: string, comment: Comment) => void;
}

const mockLoans: Loan[] = [
  {
    id: "1",
    businessName: "Acme Corp",
    loanType: "Commercial Real Estate",
    propertyType: "Office",
    loanAmount: 5000000,
    loanTerm: 36,
    interestRate: 0.05,
    originationDate: "2023-01-01",
    maturityDate: "2026-01-01",
    status: "Active",
    documents: [
      {
        id: "101",
        name: "Appraisal Report",
        url: "https://example.com/appraisal.pdf",
        type: "Appraisal",
        approved: true,
        rejected: false,
      },
      {
        id: "102",
        name: "Title Insurance",
        url: "https://example.com/title.pdf",
        type: "Insurance",
        approved: true,
        rejected: false,
      },
    ],
    insights: [
      {
        id: "insight-1",
        title: "High Occupancy Rate",
        narrative: "The property has a consistently high occupancy rate, indicating strong demand.",
        evidence: ["Appraisal Report"],
        saved: true,
        comments: [
          {
            id: "comment-1",
            text: "This is great news!",
            author: "John Doe",
            timestamp: "2024-03-15T10:00:00.000Z",
          },
        ],
      },
      {
        id: "insight-2",
        title: "Positive Market Trends",
        narrative: "The local market shows positive trends with increasing property values.",
        evidence: ["Market Analysis"],
        saved: false,
        comments: [],
      },
    ],
    savedInsights: [
      {
        id: "insight-1",
        title: "High Occupancy Rate",
        narrative: "The property has a consistently high occupancy rate, indicating strong demand.",
        evidence: ["Appraisal Report"],
        saved: true,
        comments: [
          {
            id: "comment-1",
            text: "This is great news!",
            author: "John Doe",
            timestamp: "2024-03-15T10:00:00.000Z",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    businessName: "Beta Industries",
    loanType: "SBA Loan",
    propertyType: "Industrial",
    loanAmount: 2500000,
    loanTerm: 60,
    interestRate: 0.06,
    originationDate: "2022-07-15",
    maturityDate: "2027-07-15",
    status: "Pending",
    documents: [
      {
        id: "201",
        name: "Business Plan",
        url: "https://example.com/plan.pdf",
        type: "Plan",
        approved: false,
        rejected: false,
      },
      {
        id: "202",
        name: "Financial Statements",
        url: "https://example.com/financials.pdf",
        type: "Financial",
        approved: false,
        rejected: false,
      },
    ],
    insights: [],
    savedInsights: [],
  },
];

export const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: React.ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);

  const getLoanById = (id: string): Loan | undefined => {
    return loans.find((loan) => loan.id === id);
  };

  const addLoan = (loan: Omit<Loan, 'id' | 'documents' | 'insights' | 'savedInsights'>) => {
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      ...loan,
      documents: [],
      insights: [],
      savedInsights: [],
    };
    setLoans((prevLoans) => [...prevLoans, newLoan]);
  };

  const updateLoan = (id: string, updates: Partial<Loan>) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => (loan.id === id ? { ...loan, ...updates } : loan))
    );
  };

  const deleteLoan = (id: string) => {
    setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
  };

  const addDocument = (loanId: string, document: Omit<Document, 'id'>) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      ...document,
      approved: false,
      rejected: false,
    };

    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === loanId ? { ...loan, documents: [...loan.documents, newDocument] } : loan
      )
    );
  };

  const updateDocument = (loanId: string, documentId: string, updates: Partial<Document>) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id === loanId) {
          const updatedDocuments = loan.documents.map((doc) =>
            doc.id === documentId ? { ...doc, ...updates } : doc
          );
          return { ...loan, documents: updatedDocuments };
        }
        return loan;
      })
    );
  };

  const deleteDocument = (loanId: string, documentId: string) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === loanId
          ? { ...loan, documents: loan.documents.filter((doc) => doc.id !== documentId) }
          : loan
      )
    );
  };

  const saveInsight = (loanId: string, insightId: string) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id === loanId) {
          const insightToSave = loan.insights.find((insight) => insight.id === insightId);
          if (insightToSave) {
            const updatedInsights = loan.insights.map((insight) =>
              insight.id === insightId ? { ...insight, saved: true } : insight
            );
            const updatedSavedInsights = [...loan.savedInsights, { ...insightToSave, saved: true }];
            return { ...loan, insights: updatedInsights, savedInsights: updatedSavedInsights };
          }
        }
        return loan;
      })
    );
  };

  const unsaveInsight = (loanId: string, insightId: string) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id === loanId) {
          const updatedSavedInsights = loan.savedInsights.filter((insight) => insight.id !== insightId);
          return { ...loan, savedInsights: updatedSavedInsights };
        }
        return loan;
      })
    );
  };

  const addInsight = (loanId: string, insight: Omit<Insight, 'id' | 'saved'>) => {
    const newInsight: Insight = {
      id: `insight-${Date.now()}`,
      ...insight,
      saved: false,
      comments: [],
    };

    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === loanId ? { ...loan, insights: [...loan.insights, newInsight] } : loan
      )
    );
  };

  const addComment = (loanId: string, insightId: string, comment: Comment) => {
    setLoans(prevLoans => 
      prevLoans.map(loan => {
        if (loan.id !== loanId) return loan;
        
        // Add comment to regular insights
        const updatedInsights = loan.insights.map(insight => {
          if (insight.id !== insightId) return insight;
          
          const comments = insight.comments || [];
          return {
            ...insight,
            comments: [
              ...comments,
              {
                id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                ...comment
              }
            ]
          };
        });
        
        // Also add comment to saved insights if the insight is saved
        const updatedSavedInsights = loan.savedInsights.map(insight => {
          if (insight.id !== insightId) return insight;
          
          const comments = insight.comments || [];
          return {
            ...insight,
            comments: [
              ...comments,
              {
                id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                ...comment
              }
            ]
          };
        });
        
        return {
          ...loan,
          insights: updatedInsights,
          savedInsights: updatedSavedInsights
        };
      })
    );
  };

  return (
    <LoanContext.Provider value={{
      loans,
      getLoanById,
      addLoan,
      updateLoan,
      deleteLoan,
      addDocument,
      updateDocument,
      deleteDocument,
      saveInsight,
      unsaveInsight,
      addInsight,
      addComment
    }}>
      {children}
    </LoanContext.Provider>
  );
}

export const useLoanContext = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
};
