import React, { createContext, useContext, useReducer, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Define the Document interface
export interface Document {
  id: string;
  name: string;
  type?: string;
  url?: string;
  dateUploaded: string;
  approved?: boolean;
  rejected?: boolean;
}

// Define the Insight interface
export interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  score?: number;
  saved?: boolean;
  dateCreated: string;
  narrative?: string;
  evidence?: string;
  comments?: Comment[];
}

// Define the Comment interface
export interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

// Define the Loan interface
export interface Loan {
  id: string;
  businessName: string;
  loanType: string;
  propertyType: string;
  loanAmount: number;
  purpose: string;
  industry?: string;
  yearsInOperation?: number;
  sponsorName?: string;
  sponsorTitle?: string;
  sponsorEmail?: string;
  sponsorPhone?: string;
  propertyAddress?: string;
  submissionDate: string;
  lastUpdated: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  documents: Document[];
  insights: Insight[];
  savedInsights: Insight[];
  // Additional fields
  interestRate?: number;
  loanTerm?: number;
  originationDate?: string;
}

// Define the state interface
interface LoanState {
  loans: Loan[];
}

// Define action types
type LoanAction =
  | { type: "ADD_LOAN"; payload: Omit<Loan, "id" | "submissionDate" | "lastUpdated" | "status">}
  | { type: "UPDATE_LOAN"; payload: { id: string; updates: Partial<Loan> } }
  | { type: "DELETE_LOAN"; payload: string }
  | { type: "ADD_DOCUMENT"; payload: { loanId: string; document: Omit<Document, "id"> } }
  | { type: "UPDATE_DOCUMENT"; payload: { loanId: string; docId: string; updates: Partial<Document> } }
  | { type: "DELETE_DOCUMENT"; payload: { loanId: string; docId: string } }
  | { type: "ADD_INSIGHT"; payload: { loanId: string; insight: Insight } }
  | { type: "SAVE_INSIGHT"; payload: { loanId: string; insightId: string } }
  | { type: "UNSAVE_INSIGHT"; payload: { loanId: string; insightId: string } }
  | { type: "ADD_COMMENT"; payload: { loanId: string; insightId: string; comment: Omit<Comment, "id" | "timestamp"> } };

// Define the context type
export interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, "id" | "submissionDate" | "lastUpdated" | "status">) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  getLoanById: (id: string) => Loan | undefined;
  addDocument: (loanId: string, document: Omit<Document, "id">) => void;
  updateDocument: (loanId: string, docId: string, updates: Partial<Document>) => void;
  deleteDocument: (loanId: string, docId: string) => void;
  addInsight: (loanId: string, insight: Insight) => void;
  saveInsight: (loanId: string, insightId: string) => void;
  unsaveInsight: (loanId: string, insightId: string) => void;
  addComment: (loanId: string, insightId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
}

// Create the context
const LoanContext = createContext<LoanContextType | undefined>(undefined);

// Mock data
const currentDate = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString();
const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString();

const mockDocuments1: Document[] = [
  {
    id: uuidv4(),
    name: "Rent Roll.pdf",
    type: "Property, Rent Roll",
    dateUploaded: lastWeek,
    approved: true,
    rejected: false,
  },
  {
    id: uuidv4(),
    name: "Tax Returns.pdf",
    type: "Financial",
    dateUploaded: lastWeek,
    approved: false,
    rejected: true,
  },
  {
    id: uuidv4(),
    name: "Property Appraisal.pdf",
    type: "Appraisal",
    dateUploaded: currentDate,
    approved: false,
    rejected: false,
  }
];

const mockDocuments2: Document[] = [
  {
    id: uuidv4(),
    name: "Financial Statements.pdf",
    type: "Financial",
    dateUploaded: lastMonth,
    approved: true,
    rejected: false,
  },
  {
    id: uuidv4(),
    name: "Property Photos.pdf",
    type: "Property",
    dateUploaded: lastWeek,
    approved: true,
    rejected: false,
  },
];

const mockDocuments3: Document[] = [
  {
    id: uuidv4(),
    name: "Construction Budget.xlsx",
    type: "Construction, Financial",
    dateUploaded: yesterday,
    approved: false,
    rejected: false,
  },
  {
    id: uuidv4(),
    name: "Site Plans.pdf",
    type: "Construction",
    dateUploaded: yesterday,
    approved: false,
    rejected: false,
  },
  {
    id: uuidv4(),
    name: "Environmental Report.pdf",
    type: "Environmental",
    dateUploaded: currentDate,
    approved: false,
    rejected: false,
  },
];

const mockDocuments4: Document[] = [
  {
    id: uuidv4(),
    name: "Bridge Loan Terms.pdf",
    type: "Financial",
    dateUploaded: lastMonth,
    approved: true,
    rejected: false,
  },
  {
    id: uuidv4(),
    name: "Property Inspection.pdf",
    type: "Property, Inspection",
    dateUploaded: lastWeek,
    approved: false,
    rejected: false,
  },
  {
    id: uuidv4(),
    name: "Tenant Leases.pdf",
    type: "Legal",
    dateUploaded: yesterday,
    approved: false,
    rejected: false,
  },
];

// Initial state with mock data
const initialState: LoanState = {
  loans: [
    {
      id: "1",
      businessName: "Skyline Apartments",
      loanType: "Investment Property",
      propertyType: "Multifamily",
      loanAmount: 2500000,
      purpose: "Refinance",
      industry: "Real Estate",
      yearsInOperation: 5,
      sponsorName: "John Smith",
      sponsorTitle: "Owner",
      sponsorEmail: "john@skylineapts.com",
      sponsorPhone: "(555) 123-4567",
      propertyAddress: "123 Main St, Anytown, USA",
      submissionDate: lastMonth,
      lastUpdated: lastWeek,
      status: "in_review",
      documents: mockDocuments1,
      insights: [],
      savedInsights: [],
      interestRate: 4.5,
      loanTerm: 30,
      originationDate: lastMonth,
    },
    {
      id: "2",
      businessName: "Downtown Retail Plaza",
      loanType: "Owner-Occupied CRE",
      propertyType: "Retail",
      loanAmount: 1800000,
      purpose: "Acquisition",
      industry: "Retail",
      yearsInOperation: 10,
      sponsorName: "Sarah Johnson",
      sponsorTitle: "CEO",
      sponsorEmail: "sarah@retailplaza.com",
      sponsorPhone: "(555) 987-6543",
      propertyAddress: "456 Commerce Ave, Cityville, USA",
      submissionDate: lastMonth,
      lastUpdated: yesterday,
      status: "approved",
      documents: mockDocuments2,
      insights: [],
      savedInsights: [],
      interestRate: 4.2,
      loanTerm: 25,
      originationDate: lastMonth,
    },
    {
      id: "3",
      businessName: "Tech Park Development",
      loanType: "Construction",
      propertyType: "Office",
      loanAmount: 5000000,
      purpose: "New Construction",
      industry: "Technology",
      yearsInOperation: 3,
      sponsorName: "Michael Chen",
      sponsorTitle: "Managing Partner",
      sponsorEmail: "michael@techpark.com",
      sponsorPhone: "(555) 555-5555",
      propertyAddress: "789 Innovation Dr, Techville, USA",
      submissionDate: yesterday,
      lastUpdated: currentDate,
      status: "pending",
      documents: mockDocuments3,
      insights: [],
      savedInsights: [],
      interestRate: 5.1,
      loanTerm: 20,
      originationDate: yesterday,
    },
    {
      id: "4",
      businessName: "Harbor View Hotel",
      loanType: "Bridge",
      propertyType: "Hotel",
      loanAmount: 3200000,
      purpose: "Renovation",
      industry: "Hospitality",
      yearsInOperation: 15,
      sponsorName: "Amanda Lee",
      sponsorTitle: "Director",
      sponsorEmail: "amanda@harborview.com",
      sponsorPhone: "(555) 444-3333",
      propertyAddress: "101 Waterfront Blvd, Harbortown, USA",
      submissionDate: lastMonth,
      lastUpdated: yesterday,
      status: "in_review",
      documents: mockDocuments4,
      insights: [],
      savedInsights: [],
      interestRate: 6.0,
      loanTerm: 10,
      originationDate: lastMonth,
    },
  ],
};

// Reducer function
const loanReducer = (state: LoanState, action: LoanAction): LoanState => {
  switch (action.type) {
    case "ADD_LOAN":
      const newLoan: Loan = {
        ...action.payload,
        id: uuidv4(),
        submissionDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: "pending",
        documents: [],
        insights: [],
        savedInsights: [],
      };
      return {
        ...state,
        loans: [...state.loans, newLoan],
      };

    case "UPDATE_LOAN":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.id
            ? { ...loan, ...action.payload.updates, lastUpdated: new Date().toISOString() }
            : loan
        ),
      };

    case "DELETE_LOAN":
      return {
        ...state,
        loans: state.loans.filter((loan) => loan.id !== action.payload),
      };

    case "ADD_DOCUMENT":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.loanId
            ? {
                ...loan,
                documents: [
                  ...loan.documents,
                  { ...action.payload.document, id: uuidv4() },
                ],
                lastUpdated: new Date().toISOString(),
              }
            : loan
        ),
      };

    case "UPDATE_DOCUMENT":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.loanId
            ? {
                ...loan,
                documents: loan.documents.map((doc) =>
                  doc.id === action.payload.docId
                    ? { ...doc, ...action.payload.updates }
                    : doc
                ),
                lastUpdated: new Date().toISOString(),
              }
            : loan
        ),
      };

    case "DELETE_DOCUMENT":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.loanId
            ? {
                ...loan,
                documents: loan.documents.filter(
                  (doc) => doc.id !== action.payload.docId
                ),
                lastUpdated: new Date().toISOString(),
              }
            : loan
        ),
      };
      
    case "ADD_INSIGHT":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.loanId
            ? {
                ...loan,
                insights: [...loan.insights, action.payload.insight],
                lastUpdated: new Date().toISOString(),
              }
            : loan
        ),
      };
      
    case "SAVE_INSIGHT":
      return {
        ...state,
        loans: state.loans.map((loan) => {
          if (loan.id === action.payload.loanId) {
            const insight = loan.insights.find(i => i.id === action.payload.insightId);
            if (insight) {
              return {
                ...loan,
                savedInsights: [...loan.savedInsights, {...insight, saved: true}],
                lastUpdated: new Date().toISOString(),
              };
            }
          }
          return loan;
        }),
      };
      
    case "UNSAVE_INSIGHT":
      return {
        ...state,
        loans: state.loans.map((loan) => {
          if (loan.id === action.payload.loanId) {
            return {
              ...loan,
              savedInsights: loan.savedInsights.filter(
                (insight) => insight.id !== action.payload.insightId
              ),
              lastUpdated: new Date().toISOString(),
            };
          }
          return loan;
        }),
      };

    case "ADD_COMMENT":
      return {
        ...state,
        loans: state.loans.map((loan) => {
          if (loan.id === action.payload.loanId) {
            return {
              ...loan,
              insights: loan.insights.map((insight) => {
                if (insight.id === action.payload.insightId) {
                  const comments = insight.comments || [];
                  return {
                    ...insight,
                    comments: [
                      ...comments,
                      {
                        ...action.payload.comment,
                        id: uuidv4(),
                        timestamp: new Date().toISOString(),
                      },
                    ],
                  };
                }
                return insight;
              }),
              savedInsights: loan.savedInsights.map((insight) => {
                if (insight.id === action.payload.insightId) {
                  const comments = insight.comments || [];
                  return {
                    ...insight,
                    comments: [
                      ...comments,
                      {
                        ...action.payload.comment,
                        id: uuidv4(),
                        timestamp: new Date().toISOString(),
                      },
                    ],
                  };
                }
                return insight;
              }),
              lastUpdated: new Date().toISOString(),
            };
          }
          return loan;
        }),
      };

    default:
      return state;
  }
};

// Create the provider component
export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  const addLoan = useCallback((loan: Omit<Loan, "id" | "submissionDate" | "lastUpdated" | "status">) => {
    dispatch({ type: "ADD_LOAN", payload: loan });
  }, []);

  const updateLoan = useCallback((id: string, updates: Partial<Loan>) => {
    dispatch({ type: "UPDATE_LOAN", payload: { id, updates } });
  }, []);

  const deleteLoan = useCallback((id: string) => {
    dispatch({ type: "DELETE_LOAN", payload: id });
  }, []);

  const getLoanById = useCallback(
    (id: string) => {
      return state.loans.find((loan) => loan.id === id);
    },
    [state.loans]
  );
  
  const addDocument = useCallback((loanId: string, document: Omit<Document, "id">) => {
    dispatch({ type: "ADD_DOCUMENT", payload: { loanId, document } });
  }, []);

  const updateDocument = useCallback((loanId: string, docId: string, updates: Partial<Document>) => {
    dispatch({ type: "UPDATE_DOCUMENT", payload: { loanId, docId, updates } });
  }, []);

  const deleteDocument = useCallback((loanId: string, docId: string) => {
    dispatch({ type: "DELETE_DOCUMENT", payload: { loanId, docId } });
  }, []);

  const addInsight = useCallback((loanId: string, insight: Insight) => {
    dispatch({ type: "ADD_INSIGHT", payload: { loanId, insight } });
  }, []);

  const saveInsight = useCallback((loanId: string, insightId: string) => {
    dispatch({ type: "SAVE_INSIGHT", payload: { loanId, insightId } });
  }, []);

  const unsaveInsight = useCallback((loanId: string, insightId: string) => {
    dispatch({ type: "UNSAVE_INSIGHT", payload: { loanId, insightId } });
  }, []);

  const addComment = useCallback(
    (loanId: string, insightId: string, comment: Omit<Comment, "id" | "timestamp">) => {
      dispatch({
        type: "ADD_COMMENT",
        payload: { loanId, insightId, comment },
      });
    },
    []
  );

  const value = {
    loans: state.loans,
    addLoan,
    updateLoan,
    deleteLoan,
    getLoanById,
    addDocument,
    updateDocument,
    deleteDocument,
    addInsight,
    saveInsight,
    unsaveInsight,
    addComment
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

// Create the custom hook
export const useLoanContext = (): LoanContextType => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
};
