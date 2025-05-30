
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

    // Generate business-specific insights based on the company profile
    switch (loan.businessName) {
      case "Maria's Family Restaurant":
        if (documentTypes.has("Financial")) {
          insights.push({
            id: uuidv4(),
            title: "Strong Food Cost Management",
            description: "Restaurant maintains excellent food cost ratios",
            category: "Financial",
            score: 88,
            dateCreated: currentDate,
            narrative: "Tax returns show food costs at 28% of revenue, well below the industry average of 32%. This indicates strong kitchen management and supplier relationships.",
            evidence: ["Food costs: 28% of revenue", "Industry average: 32%", "Consistent margins over 3 years"],
            comments: []
          });

          insights.push({
            id: uuidv4(),
            title: "Seasonal Revenue Patterns",
            description: "Restaurant shows predictable seasonal fluctuations",
            category: "Financial",
            score: 82,
            dateCreated: currentDate,
            narrative: "Financial statements reveal 20% higher revenue during holiday seasons (Nov-Dec) and summer months, with stable baseline performance.",
            evidence: ["Q4 revenue increase: 20%", "Summer peak: 15% above average", "Predictable cash flow patterns"],
            comments: []
          });
        }

        if (documentTypes.has("Legal")) {
          insights.push({
            id: uuidv4(),
            title: "Favorable Lease Terms",
            description: "Restaurant lease provides operational flexibility",
            category: "Legal",
            score: 90,
            dateCreated: currentDate,
            narrative: "The lease agreement includes a 5-year renewal option at current market rates and allows for extended operating hours during peak seasons.",
            evidence: ["5-year renewal option", "Extended hours permitted", "Base rent locked for 2 more years"],
            comments: []
          });
        }
        break;

      case "Mike's Auto Repair":
        if (documentTypes.has("Financial")) {
          insights.push({
            id: uuidv4(),
            title: "Diversified Revenue Streams",
            description: "Auto shop has multiple income sources",
            category: "Financial",
            score: 91,
            dateCreated: currentDate,
            narrative: "Revenue breakdown shows 45% from repairs, 30% from maintenance, 15% from parts sales, and 10% from inspections, reducing dependency risk.",
            evidence: ["Repairs: 45%", "Maintenance contracts: 30%", "Parts sales: 15%", "Inspections: 10%"],
            comments: []
          });

          insights.push({
            id: uuidv4(),
            title: "Strong Customer Retention",
            description: "High percentage of repeat customers",
            category: "Business",
            score: 89,
            dateCreated: currentDate,
            narrative: "Customer analysis shows 75% repeat business rate, indicating strong service quality and customer loyalty in the automotive repair sector.",
            evidence: ["Repeat customers: 75%", "Average customer lifetime: 8 years", "Referral rate: 35%"],
            comments: []
          });
        }

        if (documentTypes.has("Equipment")) {
          insights.push({
            id: uuidv4(),
            title: "Modern Equipment Investment",
            description: "Recent equipment upgrades enhance service capabilities",
            category: "Equipment",
            score: 85,
            dateCreated: currentDate,
            narrative: "Investment in diagnostic equipment and hydraulic lifts positions the shop to handle modern vehicles and increase efficiency.",
            evidence: ["New diagnostic systems", "2 additional service bays", "Capability for hybrid/electric vehicles"],
            comments: []
          });
        }
        break;

      case "Bella's Beauty Salon":
        if (documentTypes.has("Financial")) {
          insights.push({
            id: uuidv4(),
            title: "Growing Service Menu",
            description: "Salon expanding into high-margin services",
            category: "Financial",
            score: 87,
            dateCreated: currentDate,
            narrative: "Recent addition of spa services and specialized treatments has increased average ticket size by 25% over the past year.",
            evidence: ["Average ticket increase: 25%", "Spa services: 40% margin", "New treatment bookings: +35%"],
            comments: []
          });

          insights.push({
            id: uuidv4(),
            title: "Strong Appointment Booking",
            description: "Consistent booking rates indicate demand",
            category: "Business",
            score: 84,
            dateCreated: currentDate,
            narrative: "Booking system shows 85% capacity utilization with strong weekend and evening demand, indicating healthy market position.",
            evidence: ["Capacity utilization: 85%", "Weekend bookings: 95%", "Advance bookings: 3 weeks average"],
            comments: []
          });
        }

        if (documentTypes.has("Legal")) {
          insights.push({
            id: uuidv4(),
            title: "Compliance and Licensing",
            description: "All required licenses and permits current",
            category: "Legal",
            score: 95,
            dateCreated: currentDate,
            narrative: "Business maintains all required cosmetology licenses, health permits, and local business licenses in good standing.",
            evidence: ["State cosmetology license current", "Health permit renewed", "Business license compliant"],
            comments: []
          });
        }
        break;

      case "Sweet Dreams Bakery":
        if (documentTypes.has("Financial")) {
          insights.push({
            id: uuidv4(),
            title: "Custom Order Growth",
            description: "Bakery seeing strong demand for custom orders",
            category: "Financial",
            score: 89,
            dateCreated: currentDate,
            narrative: "Custom cake and catering orders now represent 40% of revenue with higher margins than retail sales, showing business evolution.",
            evidence: ["Custom orders: 40% of revenue", "Margin improvement: 15%", "Catering contracts increasing"],
            comments: []
          });

          insights.push({
            id: uuidv4(),
            title: "Early Morning Revenue",
            description: "Strong breakfast and coffee sales",
            category: "Financial",
            score: 86,
            dateCreated: currentDate,
            narrative: "Morning sales (6-10 AM) account for 55% of daily revenue, with coffee and pastry combinations driving consistent traffic.",
            evidence: ["Morning sales: 55% of daily revenue", "Coffee attachment rate: 70%", "Regular morning customers: 150+"],
            comments: []
          });
        }

        if (documentTypes.has("Business Plan")) {
          insights.push({
            id: uuidv4(),
            title: "Expansion Strategy",
            description: "Well-planned growth into wholesale market",
            category: "Business",
            score: 83,
            dateCreated: currentDate,
            narrative: "Business plan outlines strategic expansion into supplying local cafes and restaurants with baked goods, leveraging existing production capacity.",
            evidence: ["3 wholesale partnerships identified", "Production capacity: 40% unused", "Projected revenue increase: 25%"],
            comments: []
          });
        }

        if (documentTypes.has("Insurance")) {
          insights.push({
            id: uuidv4(),
            title: "Comprehensive Coverage",
            description: "Bakery maintains appropriate insurance coverage",
            category: "Risk Management",
            score: 92,
            dateCreated: currentDate,
            narrative: "Insurance portfolio includes general liability, product liability, and business interruption coverage appropriate for food service business.",
            evidence: ["Product liability: $2M coverage", "Business interruption included", "Workers compensation current"],
            comments: []
          });
        }
        break;

      default:
        // Generic insights for other businesses
        if (documentTypes.has("Financial")) {
          insights.push({
            id: uuidv4(),
            title: "Financial Stability",
            description: "Business shows consistent financial performance",
            category: "Financial",
            score: 85,
            dateCreated: currentDate,
            narrative: "Financial statements demonstrate stable revenue growth and controlled expenses over the review period.",
            evidence: ["Consistent revenue growth", "Controlled operating expenses", "Positive cash flow"],
            comments: []
          });
        }
        break;
    }

    // Add some common insights that apply regardless of business type
    if (documentTypes.has("Rent Roll")) {
      insights.push({
        id: uuidv4(),
        title: "Property Income Analysis",
        description: "Rent roll shows stable tenant relationships",
        category: "Property",
        score: 88,
        dateCreated: currentDate,
        narrative: "Analysis of rent roll indicates strong tenant retention and market-rate pricing for the property type and location.",
        evidence: ["Average tenancy: 3+ years", "Market-rate pricing", "Low vacancy risk"],
        comments: []
      });
    }
    
    // If we have insights to add, update the loan
    if (insights.length > 0) {
      updateLoan(loanId, { insights });
      toast.success("Business-specific insights generated");
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
