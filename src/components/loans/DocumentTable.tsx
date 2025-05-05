import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Document, useLoanContext } from "@/context/LoanContext";
import { Check, FileText, Plus, Tag, X, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DocumentViewer } from "./DocumentViewer";

interface DocumentTableProps {
  loanId: string;
  documents: Document[];
  onRequestDocs?: () => void;
  showRequestButton?: boolean;
}

export function DocumentTable({ 
  loanId, 
  documents, 
  onRequestDocs, 
  showRequestButton = true 
}: DocumentTableProps) {
  const { updateDocument } = useLoanContext();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [documentTags, setDocumentTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No documents have been uploaded yet</p>
            <p className="text-sm text-muted-foreground">
              Upload documents or request documentation to begin the analysis process
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" onClick={onRequestDocs || (() => setIsRequestDialogOpen(true))}>
                <FileText className="mr-2 h-4 w-4" />
                Request Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleApproveDoc = (docId: string) => {
    updateDocument(loanId, docId, { approved: true, rejected: false });
    toast.success("Document approved");
  };

  const handleRejectDoc = (docId: string) => {
    updateDocument(loanId, docId, { rejected: true, approved: false });
    toast.error("Document rejected");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent, docId: string) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag(docId);
    }
  };

  const addTag = (docId: string) => {
    if (currentTag.trim()) {
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        const currentTags = doc.type 
          ? doc.type.split(',').map(tag => tag.trim()).filter(Boolean) 
          : [];
          
        if (!currentTags.includes(currentTag.trim())) {
          const updatedTags = [...currentTags, currentTag.trim()];
          updateDocument(loanId, docId, { type: updatedTags.join(', ') });
          toast.success(`Tag "${currentTag.trim()}" added`);
        }
        setCurrentTag("");
      }
    }
  };

  const removeTag = (docId: string, tagToRemove: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      const currentTags = doc.type 
        ? doc.type.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];
        
      const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
      updateDocument(loanId, docId, { type: updatedTags.join(', ') });
      toast.success(`Tag "${tagToRemove}" removed`);
    }
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

  const togglePopover = (docId: string) => {
    if (openPopoverId === docId) {
      setOpenPopoverId(null);
    } else {
      setOpenPopoverId(docId);
      setCurrentTag("");
    }
  };

  const handleViewDocument = (doc: Document) => {
    console.log("Viewing document:", doc);
    setSelectedDocument(doc);
    setDocumentViewerOpen(true);
    toast.info(`Opening ${doc.name}`);
  };

  return (
    <>
      {showRequestButton && (
        <div className="mb-4 flex justify-end items-center gap-2">
          <Button variant="outline" onClick={onRequestDocs || (() => setIsRequestDialogOpen(true))}>
            <FileText className="mr-2 h-4 w-4" />
            Request Documentation
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full loan-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date Uploaded</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewDocument(doc);
                    }}
                    className="text-primary hover:underline"
                  >
                    {doc.name}
                  </a>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1 items-center">
                    {doc.type ? (
                      doc.type.split(',').map(tag => (
                        <Badge key={tag} variant="secondary" className="px-2 py-0.5 flex items-center gap-1">
                          {tag.trim()}
                          <button
                            onClick={() => removeTag(doc.id, tag.trim())}
                            className="h-3.5 w-3.5 rounded-full focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove tag</span>
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No tags</span>
                    )}
                    <Popover open={openPopoverId === doc.id} onOpenChange={() => togglePopover(doc.id)}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 ml-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span className="sr-only">Add tag</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="flex p-2 items-center">
                          <Input
                            placeholder="Add tag (e.g., Rent Roll)"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={(e) => handleTagKeyDown(e, doc.id)}
                            className="h-8 flex-1"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => addTag(doc.id)}
                            disabled={!currentTag.trim()}
                            className="ml-2 h-8"
                          >
                            Add
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </td>
                <td>{doc.dateUploaded ? formatDate(doc.dateUploaded) : "N/A"}</td>
                <td>
                  {doc.approved && <Badge variant="default">Approved</Badge>}
                  {doc.rejected && <Badge variant="destructive">Rejected</Badge>}
                  {!doc.approved && !doc.rejected && <Badge variant="outline">In Review</Badge>}
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDocument(doc)}
                      className="h-8 w-8 p-0"
                    >
                      <Search className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    
                    {!doc.approved && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleApproveDoc(doc.id)} 
                        className="h-8 w-8 p-0 text-green-600"
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                    )}
                    {!doc.rejected && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRejectDoc(doc.id)} 
                        className="h-8 w-8 p-0 text-red-600"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Request Documentation</AlertDialogTitle>
            <AlertDialogDescription>
              Specify what types of documents you need from the borrower.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
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

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRequestSubmit}>
              Send Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Replace RentRollViewer with DocumentViewer */}
      <DocumentViewer 
        document={selectedDocument}
        open={documentViewerOpen}
        onClose={() => {
          setDocumentViewerOpen(false);
          setSelectedDocument(null);
        }}
      />
    </>
  );
}
