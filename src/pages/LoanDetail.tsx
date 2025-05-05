
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useLoanContext } from "@/context/LoanContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Upload, AlertTriangle } from "lucide-react";
import { DocumentTable } from "@/components/loans/DocumentTable";
import { DocumentUpload } from "@/components/loans/DocumentUpload";
import { LoanSummary } from "@/components/loans/LoanSummary";
import { LoanInsights } from "@/components/loans/LoanInsights";
import { SavedInsights } from "@/components/loans/SavedInsights";
import { CommentsSidebar } from "@/components/loans/CommentsSidebar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Insight } from "@/context/LoanContext";
import { v4 as uuidv4 } from "uuid";

export default function LoanDetail() {
  const { loanId } = useParams<{ loanId: string }>();
  const { getLoanById, updateDocument, updateLoan } = useLoanContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  // States for the request documentation dialog
  const [documentTags, setDocumentTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [requestNote, setRequestNote] = useState("");
  
  // States for the comments sidebar
  const [commentsSidebarOpen, setCommentsSidebarOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  
  // Get the default tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') === 'summary' ? 'summary' : 'data-room';
  
  // Effect to update tabs when URL changes
  useEffect(() => {
    // This will force the tabs to re-render when the URL query params change
    const newQueryParams = new URLSearchParams(location.search);
    const newTab = newQueryParams.get('tab') === 'summary' ? 'summary' : 'data-room';
    
    const tabsElement = document.querySelector(`[data-state="active"][role="tab"][data-value="${newTab}"]`);
    if (!tabsElement) {
      // If tab doesn't exist yet or isn't active, trigger a click on it
      const tabTrigger = document.querySelector(`[role="tab"][data-value="${newTab}"]`) as HTMLElement;
      if (tabTrigger) {
        tabTrigger.click();
      }
    }
  }, [location.search]);

  const loan = getLoanById(loanId || "");

  // Add a useEffect to tag the first document as a rent roll for demo purposes
  useEffect(() => {
    if (loan && loan.documents.length > 0) {
      const firstDoc = loan.documents[0];
      if (firstDoc && !firstDoc.type?.includes("Rent Roll")) {
        console.log("Tagging first document as Rent Roll");
        updateDocument(loan.id, firstDoc.id, { 
          type: firstDoc.type ? `${firstDoc.type}, Rent Roll` : "Rent Roll" 
        });
      }
    }
  }, [loan?.id]);

  // Add an effect to auto-generate insights when all documents have been reviewed
  useEffect(() => {
    if (!loan) return;
    
    // Check if all documents have been reviewed and at least one is approved
    const allDocumentsReviewed = loan.documents.length > 0 && 
      loan.documents.every((doc) => doc.approved || doc.rejected);
    const hasApprovedDocuments = loan.documents.some((doc) => doc.approved);
    
    // If insights are empty and all documents are reviewed with at least one approval, generate insights
    if (allDocumentsReviewed && hasApprovedDocuments && loan.insights.length === 0) {
      generateInsightsForLoan(loan.id);
    }
  }, [loan?.documents]);

  // Function to generate insights based on document types
  const generateInsightsForLoan = (loanId: string) => {
    const loan = getLoanById(loanId);
    if (!loan) return;
    
    // Map to group documents by their types
    const documentTypes = new Map<string, number>();
    
    // Count documents by type
    loan.documents.forEach(doc => {
      if (doc.approved && doc.type) {
        doc.type.split(',').forEach(type => {
          const trimmedType = type.trim();
          documentTypes.set(trimmedType, (documentTypes.get(trimmedType) || 0) + 1);
        });
      }
    });
    
    const insights: Insight[] = [];
    const currentDate = new Date().toISOString();

    // Generate insights based on document types
    if (documentTypes.has("Rent Roll")) {
      insights.push({
        id: uuidv4(),
        title: "Positive Cash Flow",
        description: "The property shows strong positive cash flow based on rent roll",
        category: "Financial",
        score: 92,
        dateCreated: currentDate,
        narrative: "The rent roll shows a stable tenant base with low vacancy rates, resulting in consistent monthly income that exceeds operating expenses by approximately 25%.",
        evidence: ["Average monthly rental income: $45,000", "Monthly operating expenses: $35,000", "Positive cash flow: $10,000/month"],
        comments: []
      });
      
      insights.push({
        id: uuidv4(),
        title: "Below Market Rents",
        description: "Current rents are 15% below market rate",
        category: "Financial",
        score: 85,
        dateCreated: currentDate,
        narrative: "Analysis of the rent roll compared to market rates indicates potential for rental income growth through strategic increases.",
        evidence: ["Current average rent: $1,250/unit", "Market average rent: $1,450/unit", "Potential increase: 15%"],
        comments: []
      });
      
      insights.push({
        id: uuidv4(),
        title: "High Occupancy Rate",
        description: "Property maintains 95% occupancy rate",
        category: "Property",
        score: 90,
        dateCreated: currentDate,
        narrative: "The property has maintained consistently high occupancy rates over the past 24 months, indicating strong demand and effective property management.",
        evidence: ["Current occupancy: 95%", "Market average: 89%", "Tenant retention rate: 78%"],
        comments: []
      });
    }
    
    if (documentTypes.has("Financial")) {
      insights.push({
        id: uuidv4(),
        title: "Strong Financial Performance",
        description: "The business shows consistent financial growth",
        category: "Financial",
        score: 88,
        dateCreated: currentDate,
        narrative: "The financial statements demonstrate year-over-year revenue growth of 8%, with improving profit margins and controlled operating expenses.",
        evidence: ["Annual revenue growth: 8%", "Profit margin increase: 3.5%", "Expense ratio reduction: 2.1%"],
        comments: []
      });
      
      if (loan.loanType === "Bridge") {
        insights.push({
          id: uuidv4(),
          title: "Favorable Loan Terms",
          description: "Bridge loan terms are competitive for market segment",
          category: "Financial",
          score: 78,
          dateCreated: currentDate,
          narrative: "The proposed bridge loan terms align well with current market conditions for properties undergoing renovation.",
          evidence: ["Interest rate 50bps below average for similar loans", "Flexible draw schedule accommodates renovation timeline", "No prepayment penalty after 12 months"],
          comments: []
        });
      }
    }
    
    if (documentTypes.has("Property")) {
      insights.push({
        id: uuidv4(),
        title: "Prime Location Assessment",
        description: `Property situated in high-traffic ${loan.propertyType.toLowerCase()} corridor`,
        category: "Property",
        score: 95,
        dateCreated: currentDate,
        narrative: `Analysis of the property data confirms the ${loan.propertyType.toLowerCase()} is situated in a prime corridor with strong traffic and excellent visibility.`,
        evidence: ["Daily foot/vehicle traffic: 20,000+", "Walking distance to public transit", "Corner lot with street frontage on two major roads"],
        comments: []
      });
    }
    
    if (documentTypes.has("Appraisal")) {
      insights.push({
        id: uuidv4(),
        title: "Strong Appraisal Value",
        description: "Property appraised 8% above purchase price",
        category: "Property",
        score: 92,
        dateCreated: currentDate,
        narrative: "The appraisal report indicates a value higher than the acquisition cost, providing a favorable loan-to-value ratio.",
        evidence: ["Appraisal: $2,700,000", "Purchase price: $2,500,000", "8% built-in equity"],
        comments: []
      });
    }
    
    if (documentTypes.has("Legal")) {
      insights.push({
        id: uuidv4(),
        title: "Clean Title Report",
        description: "No title issues or encumbrances identified",
        category: "Legal",
        score: 95,
        dateCreated: currentDate,
        narrative: "Title examination reveals clean ownership history with no liens, encumbrances, or legal disputes that would affect property transfer.",
        evidence: ["Clear title dating back 40+ years", "No outstanding liens", "Proper easements documented"],
        comments: []
      });
    }
    
    if (documentTypes.has("Construction")) {
      insights.push({
        id: uuidv4(),
        title: "Construction Budget Analysis",
        description: "Construction budget appears comprehensive and realistic",
        category: "Construction",
        score: 85,
        dateCreated: currentDate,
        narrative: "The construction budget includes appropriate contingencies and is in line with industry standards for similar projects.",
        evidence: ["15% contingency allocation", "Material costs within 5% of current market rates", "Timeline accounts for potential supply chain delays"],
        comments: []
      });
    }
    
    if (documentTypes.has("Environmental")) {
      insights.push({
        id: uuidv4(),
        title: "Environmental Risk Assessment",
        description: "No significant environmental concerns identified",
        category: "Environmental",
        score: 90,
        dateCreated: currentDate,
        narrative: "The environmental report indicates no significant contamination issues or environmental liabilities associated with the property.",
        evidence: ["Phase I assessment complete", "No recognized environmental conditions", "Site meets current environmental standards"],
        comments: []
      });
    }

    if (documentTypes.has("Inspection")) {
      insights.push({
        id: uuidv4(),
        title: "Property Condition Assessment",
        description: "Inspection reveals good overall condition with minor repairs needed",
        category: "Property",
        score: 82,
        dateCreated: currentDate,
        narrative: "The property inspection report indicates the building is in good condition overall, with some minor maintenance items that should be addressed.",
        evidence: ["HVAC system 8 years old (15-year lifespan)", "Roof in good condition (5 years old)", "Electrical systems up to code"],
        comments: []
      });
    }
    
    // If we have insights to add, update the loan
    if (insights.length > 0) {
      updateLoan(loanId, { insights });
      toast.success("Insights generated based on document analysis");
    }
  };

  if (!loan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Loan Not Found</h2>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const hasApprovedDocuments = loan.documents.some((doc) => doc.approved);
  const allDocumentsReviewed = loan.documents.length > 0 && 
    loan.documents.every((doc) => doc.approved || doc.rejected);
    
  const handleViewComments = (insight: Insight) => {
    setSelectedInsight(insight);
    setCommentsSidebarOpen(true);
  };

  const handleRequestSubmit = () => {
    if (documentTags.length === 0) {
      toast.error("Please specify at least one document type");
      return;
    }

    // In a real application, this would send a request to the backend
    toast.success(`Documentation requested: ${documentTags.join(", ")}`);
    setIsRequestDialogOpen(false);
    setDocumentTags([]);
    setRequestNote("");
    setCurrentTag("");
  };

  // Regular Loan Detail View
  return (
    <div className="relative flex flex-col h-full">
      {/* Header with sidebar trigger, title and navigation */}
      <div>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="h-8"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-medium leading-tight">{loan.businessName}</h1>
                <p className="text-sm text-muted-foreground">
                  {loan.loanType} · {loan.propertyType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative">
        <div className={`p-6 flex-1 ${commentsSidebarOpen ? 'pr-[320px]' : ''}`}>
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="summary">Application Summary</TabsTrigger>
              <TabsTrigger value="data-room">Data Room</TabsTrigger>
              <TabsTrigger 
                value="insights" 
                disabled={!allDocumentsReviewed}
                title={allDocumentsReviewed ? "View insights" : "All documents must be approved or rejected to view insights"}
              >
                Insights Tracker
              </TabsTrigger>
              <TabsTrigger 
                value="saved-insights"
                disabled={!allDocumentsReviewed}
                title={allDocumentsReviewed ? "View saved insights" : "All documents must be approved or rejected to view saved insights"}
              >
                Saved Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <LoanSummary loan={loan} />
            </TabsContent>
            
            <TabsContent value="data-room" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" onClick={() => setIsRequestDialogOpen(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Request Documentation
                  </Button>
                </div>
              </div>
              <DocumentTable 
                loanId={loan.id} 
                documents={loan.documents} 
                onRequestDocs={() => setIsRequestDialogOpen(true)}
                showRequestButton={false}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6">
              {allDocumentsReviewed ? (
                hasApprovedDocuments ? (
                  <LoanInsights 
                    loanId={loan.id} 
                    insights={loan.insights} 
                    onViewComments={handleViewComments}
                  />
                ) : (
                  <Card className="p-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-2">No approved documents</p>
                      <p className="text-sm text-muted-foreground">
                        You've reviewed all documents, but none were approved. At least one document needs to be approved to view insights.
                      </p>
                    </div>
                  </Card>
                )
              ) : (
                <Card className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">Document review required</p>
                    <p className="text-sm text-muted-foreground">
                      All documents must be approved or rejected before insights can be viewed
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="saved-insights">
              {allDocumentsReviewed && hasApprovedDocuments ? (
                <SavedInsights 
                  loanId={loan.id} 
                  savedInsights={loan.savedInsights} 
                  onViewComments={handleViewComments}
                />
              ) : (
                <Card className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">Document review required</p>
                    <p className="text-sm text-muted-foreground">
                      {!allDocumentsReviewed 
                        ? "All documents must be approved or rejected before saved insights can be viewed"
                        : "You've reviewed all documents, but none were approved. At least one document needs to be approved to view saved insights."
                      }
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Comments sidebar */}
        {commentsSidebarOpen && (
          <CommentsSidebar
            isOpen={commentsSidebarOpen}
            onClose={() => setCommentsSidebarOpen(false)}
            insight={selectedInsight}
            loanId={loan.id}
          />
        )}
      </div>
      
      <DocumentUpload 
        loanId={loan.id} 
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
      />

      {/* Add Request Documentation Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Documentation</DialogTitle>
            <DialogDescription>
              Specify what types of documents you need from the borrower.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="document-type" className="text-right col-span-1">
                Document Type
              </label>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="document-type"
                    placeholder="e.g., Rent Roll, Tax Returns"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentTag.trim()) {
                        e.preventDefault();
                        if (currentTag.trim() && !documentTags.includes(currentTag.trim())) {
                          setDocumentTags([...documentTags, currentTag.trim()]);
                          setCurrentTag("");
                        }
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      if (currentTag.trim() && !documentTags.includes(currentTag.trim())) {
                        setDocumentTags([...documentTags, currentTag.trim()]);
                        setCurrentTag("");
                      }
                    }}
                    disabled={!currentTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {documentTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {documentTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => setDocumentTags(documentTags.filter(t => t !== tag))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="note" className="text-right col-span-1">
                Note
              </label>
              <Textarea
                id="note"
                placeholder="Add any specific requirements or instructions"
                className="col-span-3"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestSubmit}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
