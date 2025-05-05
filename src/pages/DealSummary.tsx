
import { useParams } from "react-router-dom";
import { useLoanContext } from "@/context/LoanContext";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { AuditTrail, generateAuditEntries } from "@/components/loans/AuditTrail";

export default function DealSummary() {
  const { loanId } = useParams<{ loanId: string }>();
  const { getLoanById } = useLoanContext();
  const navigate = useNavigate();
  
  const loan = getLoanById(loanId || "");
  
  if (!loan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Loan Not Found</h2>
        <Button onClick={() => navigate("/loans")}>Return to Loan Dashboard</Button>
      </div>
    );
  }
  
  // Check for issues with the deal
  const issues: string[] = [];
  
  // Check for required documents
  const rentRollDoc = loan.documents.find(doc => doc.type?.includes("Rent Roll"));
  const financialStatementsDoc = loan.documents.find(doc => doc.type?.includes("Financial"));
  const taxReturnsDoc = loan.documents.find(doc => doc.type?.includes("Tax"));
  const personalFinancialDoc = loan.documents.find(doc => doc.type?.includes("Personal"));
  
  if (!rentRollDoc) {
    issues.push("Rent Roll missing");
  }
  
  if (!financialStatementsDoc) {
    issues.push("Financial statements missing");
  }
  
  if (!taxReturnsDoc) {
    issues.push("Tax returns missing");
  }
  
  if (personalFinancialDoc && personalFinancialDoc.dateUploaded) {
    let docDate: Date;
    
    try {
      // Fix the instance of check by comparing string or Date
      docDate = typeof personalFinancialDoc.dateUploaded === 'string'
        ? new Date(personalFinancialDoc.dateUploaded)
        : personalFinancialDoc.dateUploaded;
        
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (!isNaN(docDate.getTime()) && docDate < oneYearAgo) {
        issues.push("Personal financial statement is over 12 months old");
      }
    } catch (error) {
      console.error("Error processing document date:", error);
      issues.push("Personal financial statement date is invalid");
    }
  }

  // Generate audit entries from documents
  const auditEntries = generateAuditEntries(loan.documents);

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/loans/${loanId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Loan
        </Button>
        <h1 className="text-2xl font-semibold">Deal Summary</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Deal Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                <p className="font-medium">{loan.propertyType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Type</p>
                <p className="font-medium">{loan.loanType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                <p className="font-medium">${loan.loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                <p className="font-medium">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Term</p>
                <p className="font-medium">{loan.loanTerm} months</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium">{loan.status}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Documentation Status</h2>
            <div className="space-y-2">
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Document Type</div>
                <div className="font-medium">Status</div>
                <div className="font-medium">Date Received</div>
              </div>
              
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Rent Roll</div>
                <div>
                  {!rentRollDoc && (
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <AlertTriangle className="h-4 w-4" /> Missing
                    </span>
                  )}
                  <span>{rentRollDoc ? "Uploaded" : ""}</span>
                </div>
                <div>{formatDate(rentRollDoc?.dateUploaded)}</div>
              </div>
              
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Financial Statements</div>
                <div>{financialStatementsDoc ? "Uploaded" : "Missing"}</div>
                <div>{formatDate(financialStatementsDoc?.dateUploaded)}</div>
              </div>
              
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Tax Returns</div>
                <div>
                  {!taxReturnsDoc && (
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <AlertTriangle className="h-4 w-4" /> Missing
                    </span>
                  )}
                  <span>{taxReturnsDoc ? "Uploaded" : "Missing"}</span>
                </div>
                <div>{formatDate(taxReturnsDoc?.dateUploaded)}</div>
              </div>
              
              <div className="grid grid-cols-3 py-4 border-b border-gray-200">
                <div className="font-medium">Personal Financial Statement</div>
                <div>{personalFinancialDoc ? "Uploaded" : "Missing"}</div>
                <div>{formatDate(personalFinancialDoc?.dateUploaded)}</div>
              </div>
            </div>
          </Card>
          
          {/* Add the Audit Trail component */}
          <div className="mb-6">
            <AuditTrail entries={auditEntries} />
          </div>
        </div>
        
        <div className="md:col-span-1">
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Issues</h2>
            {issues.length > 0 ? (
              <div className="space-y-3">
                {issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No issues found with this deal.</p>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Deal Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="relative">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                    <span className="text-xs text-white">1</span>
                  </div>
                  <div className="absolute top-6 bottom-0 left-3 w-px bg-muted"></div>
                </div>
                <div>
                  <p className="font-medium">Application Received</p>
                  <p className="text-sm text-muted-foreground">{formatDate(loan.originationDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="relative">
                  <div className="flex items-center justify-center w-6 h-6 bg-secondary rounded-full">
                    <span className="text-xs">2</span>
                  </div>
                  <div className="absolute top-6 bottom-0 left-3 w-px bg-muted"></div>
                </div>
                <div>
                  <p className="font-medium">Document Collection</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="relative">
                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full">
                    <span className="text-xs text-muted-foreground">3</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Underwriting</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
