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
import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Upload, AlertTriangle, BarChart2 } from "lucide-react";
import { DocumentTable } from "@/components/loans/DocumentTable";
import { DocumentUpload } from "@/components/loans/DocumentUpload";
import { LoanSummary } from "@/components/loans/LoanSummary";
import { LoanInsights } from "@/components/loans/LoanInsights";
import { SavedInsights } from "@/components/loans/SavedInsights";
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
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function LoanDetail() {
  const { loanId } = useParams<{ loanId: string }>();
  const { getLoanById, updateDocument } = useLoanContext();
  const navigate = useNavigate();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [showDealSummary, setShowDealSummary] = useState(false);
  
  // States for the request documentation dialog
  const [documentTags, setDocumentTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [requestNote, setRequestNote] = useState("");

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
  
  // Listen for toggle deal summary event from TopBar
  useEffect(() => {
    const handleToggleDealSummary = () => {
      setShowDealSummary(prevState => !prevState);
    };
    
    window.addEventListener('toggle-deal-summary', handleToggleDealSummary);
    
    return () => {
      window.removeEventListener('toggle-deal-summary', handleToggleDealSummary);
    };
  }, []);

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

  // Deal Summary View
  if (showDealSummary) {
    return (
      <>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDealSummary(false)}
                className="h-8"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Loan
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-8">DEAL SUMMARY</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column: Key Deal Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Borrower</div>
                  <div className="font-medium">{loan.businessName}</div>
                  
                  <div className="text-gray-600">Loan Type</div>
                  <div className="font-medium">{loan.loanType}</div>
                  
                  <div className="text-gray-600">Requested</div>
                  <div className="font-medium">${Number(loan.loanAmount).toLocaleString()}</div>
                  
                  <div className="text-gray-600">Status</div>
                  <div>
                    <Badge className="bg-[#9b87f5] hover:bg-[#9b87f5]/80">In Progress</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-4">DOCUMENTS OVERVIEW</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Financial Statements</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Financial Statements</TableCell>
                        <TableCell>Uploaded</TableCell>
                        <TableCell>Mar 15, 2025</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax Returns</TableCell>
                        <TableCell className="text-amber-500 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" /> Missing
                        </TableCell>
                        <TableCell>—</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Personal Financial Statement</TableCell>
                        <TableCell className="text-red-500">Outdated</TableCell>
                        <TableCell>Jan 10, 2023</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span>Completion</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>
                </div>
              </div>
              
              {/* Right Column: Flagged Issues & Audit Trail */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">FLAGGED ISSUES</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span>Tax return not uploaded</span>
                        <div className="text-sm text-gray-500">Mar 15, 2025</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span>Personal financial statement is over 12 months old</span>
                        <div className="text-sm text-gray-500">Jan 10, 2025</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span>Business plan contains mismatched revenue* values</span>
                        <div className="text-sm text-gray-500">Mar 12, 2025</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-4">AUDIT TRAIL</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Mar 15, 2025 10:23 AM</div>
                      <div>John Smith uploaded Financial Statements</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Mar 15, 2025 10:21 AM</div>
                      <div>Jane Doe commented on Business Plan</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Jan 10, 2025 03:45 PM</div>
                      <div>John Smith uploaded outdated doc</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
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

      <div className="p-6">
        <Tabs defaultValue="data-room" className="space-y-6">
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
                <LoanInsights loanId={loan.id} insights={loan.insights} />
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
              <SavedInsights loanId={loan.id} savedInsights={loan.savedInsights} />
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
    </>
  );
}
