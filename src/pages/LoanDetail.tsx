
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useLoanContext } from "@/context/LoanContext";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Download, PlusCircle, RefreshCw } from "lucide-react";
import { DocumentTable } from "@/components/loans/DocumentTable";
import { DocumentUpload } from "@/components/loans/DocumentUpload";
import { LoanSummary } from "@/components/loans/LoanSummary";
import { LoanInsights } from "@/components/loans/LoanInsights";
import { SavedInsights } from "@/components/loans/SavedInsights";
import { AskCaelo } from "@/components/loans/AskCaelo";
import { toast } from "sonner";

export default function LoanDetail() {
  const { loanId } = useParams<{ loanId: string }>();
  const { getLoanById } = useLoanContext();
  const navigate = useNavigate();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loan = getLoanById(loanId || "");

  if (!loan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Loan Not Found</h2>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const hasApprovedDocuments = loan.documents.some((doc) => doc.approved);

  const handleRefresh = () => {
    if (!hasApprovedDocuments) {
      toast.error("No approved documents to analyze");
      return;
    }

    setRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Loan analysis refreshed");
    }, 2000);
  };

  const handleDownload = (type: "model" | "memo") => {
    if (!hasApprovedDocuments) {
      toast.error("Approve documents to enable downloads");
      return;
    }
    
    const fileName = type === "model" 
      ? `${loan.businessName.replace(/\s+/g, "_")}_Financial_Model.xlsx` 
      : `${loan.businessName.replace(/\s+/g, "_")}_Credit_Memo.docx`;
    
    toast.success(`${fileName} downloaded`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">{loan.businessName}</h1>
            <p className="text-muted-foreground">
              {loan.loanType} · {loan.propertyType}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={!hasApprovedDocuments || refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? "Analyzing..." : "Refresh Analysis"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleDownload("model")}
                disabled={!hasApprovedDocuments}
              >
                <Download className="mr-2 h-4 w-4" />
                Financial Model
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownload("memo")}
                disabled={!hasApprovedDocuments}
              >
                <Download className="mr-2 h-4 w-4" />
                Credit Memo
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="data-room" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="data-room">Data Room</TabsTrigger>
            <TabsTrigger 
              value="insights" 
              disabled={!hasApprovedDocuments}
            >
              Insights Tracker
            </TabsTrigger>
            <TabsTrigger value="saved-insights">Saved Insights</TabsTrigger>
            <TabsTrigger value="summary">Application Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-room" className="space-y-6">
            <DocumentTable loanId={loan.id} documents={loan.documents} />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            {hasApprovedDocuments ? (
              <>
                <AskCaelo />
                <div className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Analysis Insights</h2>
                  <LoanInsights loanId={loan.id} insights={loan.insights} />
                </div>
              </>
            ) : (
              <Card className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No approved documents</p>
                  <p className="text-sm text-muted-foreground">
                    Approve documents in the Data Room to view insights
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="saved-insights">
            <SavedInsights loanId={loan.id} savedInsights={loan.savedInsights} />
          </TabsContent>
          
          <TabsContent value="summary">
            <LoanSummary loan={loan} />
          </TabsContent>
        </Tabs>
      </div>
      
      <DocumentUpload 
        loanId={loan.id} 
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
      />
    </>
  );
}
