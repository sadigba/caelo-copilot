
import { useParams } from "react-router-dom";
import { useLoanContext } from "@/context/LoanContext";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

export default function DealSummary() {
  const { loanId } = useParams<{ loanId: string }>();
  const { getLoanById } = useLoanContext();
  const navigate = useNavigate();
  
  const loan = getLoanById(loanId || "");
  
  if (!loan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Loan Not Found</h2>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }
  
  // Calculate completion percentage based on documents
  const totalDocuments = 3; // Expected documents (financial statements, tax returns, personal financial statement)
  const uploadedDocuments = loan.documents.filter(doc => doc.approved).length;
  const completionPercentage = Math.min(100, Math.round((uploadedDocuments / totalDocuments) * 100));
  
  // Determine document statuses
  const financialStatementsDoc = loan.documents.find(doc => doc.type?.includes("Financial Statement"));
  const taxReturnsDoc = loan.documents.find(doc => doc.type?.includes("Tax"));
  const personalFinancialDoc = loan.documents.find(doc => doc.type?.includes("Personal"));
  
  // Check for flagged issues
  const issues = [];
  
  if (!taxReturnsDoc) {
    issues.push("Tax return not uploaded");
  }
  
  if (personalFinancialDoc) {
    const docDate = new Date(personalFinancialDoc.uploadDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (docDate < oneYearAgo) {
      issues.push("Personal financial statement is over 12 months old");
    }
  }
  
  if (financialStatementsDoc) {
    issues.push("Business plan contains mismatched revenue* values");
  }
  
  // Audit trail entries
  const auditTrail = [
    {
      date: new Date("2025-03-15T10:23:00"),
      user: "John Smith",
      action: "uploaded Financial Statements"
    },
    {
      date: new Date("2025-03-15T10:21:00"),
      user: "Jane Doe",
      action: "commented on Business Plan"
    },
    {
      date: new Date("2025-01-10T15:45:00"),
      user: "John Smith",
      action: "uploaded outdated doc"
    }
  ];
  
  return (
    <div className="container py-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-8">DEAL SUMMARY</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deal Information */}
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-muted-foreground mb-1">Borrower</p>
              <p className="font-medium">{loan.businessName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Loan Type</p>
              <p className="font-medium">{loan.loanType}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Requested</p>
              <p className="font-medium">${loan.loanAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <div className="inline-block bg-blue-500 text-white px-4 py-1 rounded-md">
                In Progress
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">DOCUMENTS OVERVIEW</h3>
            
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Financial Statements</div>
                <div>{financialStatementsDoc ? "Uploaded" : "Missing"}</div>
                <div>{financialStatementsDoc ? formatDate(new Date(financialStatementsDoc.uploadDate)) : "—"}</div>
              </div>
              
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Tax Returns</div>
                <div className="flex items-center">
                  {!taxReturnsDoc && (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  )}
                  <span>{taxReturnsDoc ? "Uploaded" : "Missing"}</span>
                </div>
                <div>{taxReturnsDoc ? formatDate(new Date(taxReturnsDoc.uploadDate)) : "—"}</div>
              </div>
              
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Personal Financial Statement</div>
                <div className="text-red-500">
                  {personalFinancialDoc ? "Outdated" : "Missing"}
                </div>
                <div>{personalFinancialDoc ? "Jan 10, 2023" : "—"}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>
        </Card>
        
        {/* Flagged Issues and Audit Trail */}
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">FLAGGED ISSUES</h3>
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                  <p>{issue}</p>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">AUDIT TRAIL</h3>
            <div className="space-y-4">
              {auditTrail.map((entry, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-muted-foreground">{formatDate(entry.date, true)}</p>
                  <p>{entry.user} {entry.action}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
