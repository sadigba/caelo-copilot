import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our loan data
export type LoanType = 
  | 'Owner-Occupied CRE' 
  | 'Investment Property' 
  | 'Construction' 
  | 'Land Loans' 
  | 'Bridge' 
  | 'Refinance/Cash Out';

export type PropertyType = 
  | 'Multifamily' 
  | 'Retail' 
  | 'Office' 
  | 'Warehouse' 
  | 'Industrial' 
  | 'Mixed-Use' 
  | 'Other';

export type LoanStatus = 
  | 'In Progress' 
  | 'Ready for Review' 
  | 'Awaiting Docs' 
  | 'Approved' 
  | 'Declined';

export type Document = {
  id: string;
  name: string;
  type: string;
  dateUploaded: Date;
  approved: boolean;
  rejected: boolean;
  url: string;
};

export type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
};

export type Insight = {
  id: string;
  title: string;
  evidence: string[];
  narrative: string;
  saved: boolean;
  comments: Comment[];
};

export interface Loan {
  id: string;
  // Loan Basics
  loanType: LoanType;
  loanAmount: number;
  purpose: string;
  
  // Business Info
  businessName: string;
  industry?: string;
  yearsInOperation?: number;
  sponsorName: string;
  sponsorTitle?: string;
  sponsorEmail: string;
  sponsorPhone: string;
  
  // Property Details
  propertyAddress: string;
  propertyType: PropertyType;
  
  // Meta info
  status: LoanStatus;
  submissionDate: Date;
  lastUpdated: Date;
  
  // Additional data
  documents: Document[];
  insights: Insight[];
  savedInsights: Insight[];
}

// Create initial dummy data
const initialLoans: Loan[] = [
  {
    id: '1',
    loanType: 'Owner-Occupied CRE',
    loanAmount: 750000,
    purpose: 'Purchase of office building for expanding tech company',
    businessName: 'TechGrowth Solutions',
    industry: 'Technology',
    yearsInOperation: 5,
    sponsorName: 'Sarah Johnson',
    sponsorTitle: 'CEO',
    sponsorEmail: 'sarah@techgrowth.com',
    sponsorPhone: '(555) 123-4567',
    propertyAddress: '123 Tech Blvd, Innovation City, CA 94103',
    propertyType: 'Office',
    status: 'Ready for Review',
    submissionDate: new Date('2025-04-15'),
    lastUpdated: new Date('2025-04-28'),
    documents: [
      {
        id: 'doc1',
        name: 'Financial Statements.pdf',
        type: 'Financial',
        dateUploaded: new Date('2025-04-16'),
        approved: true,
        rejected: false,
        url: '#'
      },
      {
        id: 'doc2',
        name: 'Business Plan.pdf',
        type: 'Business',
        dateUploaded: new Date('2025-04-17'),
        approved: true,
        rejected: false,
        url: '#'
      },
      {
        id: 'doc3',
        name: 'Property Appraisal.pdf',
        type: 'Property',
        dateUploaded: new Date('2025-04-18'),
        approved: false,
        rejected: false,
        url: '#'
      }
    ],
    insights: [
      {
        id: 'insight1',
        title: 'Stable Cash Flow',
        evidence: ['Financial Statements.pdf'],
        narrative: 'The cash flow hovers around $40k/month, as obtained from the bank statement.',
        saved: false,
        comments: [
          {
            id: 'comment1',
            text: 'Verify against industry averages',
            author: 'David Kim',
            timestamp: new Date('2025-04-20')
          }
        ]
      },
      {
        id: 'insight2',
        title: 'Local Vacancy Rates are much lower than assumed property vacancy rate',
        evidence: ['Property Appraisal.pdf', 'Market Analysis.pdf'],
        narrative: 'Local Vacancy rates hover around 85%. The borrower claims a vacancy rate of 95%. Ask about this.',
        saved: false,
        comments: []
      },
      {
        id: 'insight3',
        title: 'Annual Revenue Growth Exceeds Projections',
        evidence: ['Financial Statements.pdf', 'Business Plan.pdf'],
        narrative: 'Revenue has grown at 18% YoY, exceeding the 15% projection in the business plan.',
        saved: false,
        comments: [
          {
            id: 'comment2',
            text: 'Check if growth is sustainable given current market conditions',
            author: 'Jennifer Lee',
            timestamp: new Date('2025-04-22')
          }
        ]
      },
      {
        id: 'insight4',
        title: 'Property Valuation Higher Than Comparable Properties',
        evidence: ['Property Appraisal.pdf'],
        narrative: 'The property is valued 12% higher than similar properties in the area.',
        saved: false,
        comments: []
      },
      {
        id: 'insight5',
        title: 'Strong Debt Coverage Ratio',
        evidence: ['Financial Statements.pdf'],
        narrative: 'DCR of 1.5 exceeds our minimum requirement of 1.25.',
        saved: false,
        comments: [
          {
            id: 'comment3',
            text: 'This is a positive indicator for loan approval',
            author: 'Michael Rodriguez',
            timestamp: new Date('2025-04-21')
          }
        ]
      }
    ],
    savedInsights: []
  },
  {
    id: '2',
    loanType: 'Investment Property',
    loanAmount: 1200000,
    purpose: 'Acquisition of apartment building for rental income',
    businessName: 'Urban Living Investments',
    industry: 'Real Estate',
    yearsInOperation: 8,
    sponsorName: 'Michael Rodriguez',
    sponsorTitle: 'Managing Partner',
    sponsorEmail: 'michael@urbanlivinginv.com',
    sponsorPhone: '(555) 987-6543',
    propertyAddress: '456 Residential Ave, Metropolitan City, NY 10023',
    propertyType: 'Multifamily',
    status: 'In Progress',
    submissionDate: new Date('2025-04-20'),
    lastUpdated: new Date('2025-04-29'),
    documents: [
      {
        id: 'doc4',
        name: 'Rent Roll.pdf',
        type: 'Property',
        dateUploaded: new Date('2025-04-21'),
        approved: true,
        rejected: false,
        url: '#'
      },
      {
        id: 'doc5',
        name: 'Tax Returns.pdf',
        type: 'Financial',
        dateUploaded: new Date('2025-04-22'),
        approved: false,
        rejected: true,
        url: '#'
      }
    ],
    insights: [
      {
        id: 'insight6',
        title: 'Missing Partner Tax Returns',
        evidence: ['Tax Returns.pdf'],
        narrative: 'The submitted tax returns only include the main sponsor, but not the other partners mentioned in the operating agreement.',
        saved: false,
        comments: []
      },
      {
        id: 'insight7',
        title: 'Rent Roll Shows 15% Vacancy',
        evidence: ['Rent Roll.pdf'],
        narrative: 'Current vacancy rate is higher than market average of 8% for this area.',
        saved: false,
        comments: [
          {
            id: 'comment4',
            text: 'Request property management plan to address vacancy',
            author: 'Sarah Johnson',
            timestamp: new Date('2025-04-25')
          }
        ]
      },
      {
        id: 'insight8',
        title: 'Property Location in Developing Area',
        evidence: ['Property Appraisal.pdf'],
        narrative: 'Property is located in an area with planned infrastructure improvements that could increase value.',
        saved: false,
        comments: [
          {
            id: 'comment5',
            text: 'Verify timeline of infrastructure projects',
            author: 'David Chen',
            timestamp: new Date('2025-04-26')
          }
        ]
      },
      {
        id: 'insight9',
        title: 'Sponsor Has Multiple Late Payments',
        evidence: ['Credit Report.pdf'],
        narrative: 'Credit report shows 3 late payments in the last 12 months.',
        saved: false,
        comments: []
      }
    ],
    savedInsights: []
  },
  {
    id: '3',
    loanType: 'Construction',
    loanAmount: 3500000,
    purpose: 'Development of mixed-use retail and residential building',
    businessName: 'New Horizon Developers',
    industry: 'Construction',
    yearsInOperation: 12,
    sponsorName: 'David Chen',
    sponsorTitle: 'President',
    sponsorEmail: 'david@newhorizon.com',
    sponsorPhone: '(555) 456-7890',
    propertyAddress: '789 Development Dr, Growth City, TX 75001',
    propertyType: 'Mixed-Use',
    status: 'Awaiting Docs',
    submissionDate: new Date('2025-04-10'),
    lastUpdated: new Date('2025-04-25'),
    documents: [
      {
        id: 'doc6',
        name: 'Construction Plans.pdf',
        type: 'Property',
        dateUploaded: new Date('2025-04-11'),
        approved: true,
        rejected: false,
        url: '#'
      },
      {
        id: 'doc7',
        name: 'Contractor Bids.pdf',
        type: 'Business',
        dateUploaded: new Date('2025-04-12'),
        approved: true,
        rejected: false,
        url: '#'
      }
    ],
    insights: [
      {
        id: 'insight10',
        title: 'Construction Timeline Risk',
        evidence: ['Construction Plans.pdf', 'Contractor Bids.pdf'],
        narrative: 'The proposed timeline is 30% shorter than similar projects in the area, indicating potential overoptimism.',
        saved: false,
        comments: [
          {
            id: 'comment6',
            text: 'Request detailed project timeline with milestones',
            author: 'Lisa Williams',
            timestamp: new Date('2025-04-15')
          }
        ]
      },
      {
        id: 'insight11',
        title: 'Budget Includes Limited Contingency',
        evidence: ['Contractor Bids.pdf'],
        narrative: 'Contingency is only 5% of total budget, below our recommended 10% for similar projects.',
        saved: false,
        comments: []
      },
      {
        id: 'insight12',
        title: 'Pre-leasing Agreements Secured',
        evidence: ['Leasing Contracts.pdf'],
        narrative: '65% of retail space already has pre-leasing agreements, reducing occupancy risk.',
        saved: false,
        comments: [
          {
            id: 'comment7',
            text: 'Verify credit quality of pre-lease tenants',
            author: 'Michael Rodriguez',
            timestamp: new Date('2025-04-18')
          }
        ]
      }
    ],
    savedInsights: []
  }
];

interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'submissionDate' | 'lastUpdated' | 'documents' | 'insights' | 'savedInsights'>) => void;
  updateLoan: (id: string, loanData: Partial<Loan>) => void;
  getLoanById: (id: string) => Loan | undefined;
  addDocument: (loanId: string, document: Omit<Document, 'id' | 'dateUploaded'>) => void;
  updateDocument: (loanId: string, documentId: string, documentData: Partial<Document>) => void;
  saveInsight: (loanId: string, insightId: string) => void;
  unsaveInsight: (loanId: string, insightId: string) => void;
  addComment: (loanId: string, insightId: string, commentText: string) => void;
  addInsight: (loanId: string, insightData: { title: string; narrative: string; evidence: string[] }) => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);

  const addLoan = (newLoan: Omit<Loan, 'id' | 'submissionDate' | 'lastUpdated' | 'documents' | 'insights' | 'savedInsights'>) => {
    const now = new Date();
    const loan: Loan = {
      ...newLoan,
      id: `loan-${Date.now()}`,
      submissionDate: now,
      lastUpdated: now,
      documents: [],
      insights: [],
      savedInsights: [],
    };
    setLoans(prev => [...prev, loan]);
    return loan.id;
  };

  const updateLoan = (id: string, loanData: Partial<Loan>) => {
    setLoans(prev => 
      prev.map(loan => 
        loan.id === id 
          ? { ...loan, ...loanData, lastUpdated: new Date() } 
          : loan
      )
    );
  };

  const getLoanById = (id: string) => {
    return loans.find(loan => loan.id === id);
  };

  const addDocument = (loanId: string, document: Omit<Document, 'id' | 'dateUploaded'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      dateUploaded: new Date(),
    };
    
    setLoans(prev => 
      prev.map(loan => 
        loan.id === loanId 
          ? { 
              ...loan, 
              documents: [...loan.documents, newDocument],
              lastUpdated: new Date()
            } 
          : loan
      )
    );
  };

  const updateDocument = (loanId: string, documentId: string, documentData: Partial<Document>) => {
    setLoans(prev => 
      prev.map(loan => 
        loan.id === loanId 
          ? { 
              ...loan, 
              documents: loan.documents.map(doc => 
                doc.id === documentId 
                  ? { ...doc, ...documentData } 
                  : doc
              ),
              lastUpdated: new Date()
            } 
          : loan
      )
    );
  };

  const saveInsight = (loanId: string, insightId: string) => {
    setLoans(prev => 
      prev.map(loan => {
        if (loan.id !== loanId) return loan;
        
        const insightToSave = loan.insights.find(insight => insight.id === insightId);
        if (!insightToSave) return loan;
        
        const updatedInsight = { ...insightToSave, saved: true };
        
        return {
          ...loan,
          insights: loan.insights.map(insight => 
            insight.id === insightId ? updatedInsight : insight
          ),
          savedInsights: [...loan.savedInsights, updatedInsight],
          lastUpdated: new Date()
        };
      })
    );
  };

  const unsaveInsight = (loanId: string, insightId: string) => {
    setLoans(prev => 
      prev.map(loan => {
        if (loan.id !== loanId) return loan;
        
        return {
          ...loan,
          insights: loan.insights.map(insight => 
            insight.id === insightId ? { ...insight, saved: false } : insight
          ),
          savedInsights: loan.savedInsights.filter(insight => insight.id !== insightId),
          lastUpdated: new Date()
        };
      })
    );
  };

  const addComment = (loanId: string, insightId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      author: 'You', // In a real app, this would be the current user
      timestamp: new Date()
    };

    setLoans(prev => 
      prev.map(loan => {
        if (loan.id !== loanId) return loan;
        
        return {
          ...loan,
          insights: loan.insights.map(insight => 
            insight.id === insightId 
              ? { ...insight, comments: [...insight.comments, newComment] } 
              : insight
          ),
          savedInsights: loan.savedInsights.map(insight => 
            insight.id === insightId 
              ? { ...insight, comments: [...insight.comments, newComment] } 
              : insight
          ),
          lastUpdated: new Date()
        };
      })
    );
  };

  const addInsight = (loanId: string, insightData: { title: string; narrative: string; evidence: string[] }) => {
    const newInsight: Insight = {
      id: `insight-${Date.now()}`,
      title: insightData.title,
      narrative: insightData.narrative,
      evidence: insightData.evidence,
      saved: true,
      comments: []
    };

    setLoans(prev => 
      prev.map(loan => {
        if (loan.id !== loanId) return loan;
        
        return {
          ...loan,
          insights: [...loan.insights, { ...newInsight, saved: true }],
          savedInsights: [...loan.savedInsights, newInsight],
          lastUpdated: new Date()
        };
      })
    );

    return newInsight.id;
  };

  return (
    <LoanContext.Provider value={{ 
      loans, 
      addLoan, 
      updateLoan, 
      getLoanById,
      addDocument,
      updateDocument,
      saveInsight,
      unsaveInsight,
      addComment,
      addInsight
    }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoanContext = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoanContext must be used within a LoanProvider');
  }
  return context;
};
