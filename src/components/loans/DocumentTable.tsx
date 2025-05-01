
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Document, Loan, useLoanContext } from "@/context/LoanContext";
import { Check, FileText, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
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

interface DocumentTableProps {
  loanId: string;
  documents: Document[];
}

export function DocumentTable({ loanId, documents }: DocumentTableProps) {
  const { updateDocument } = useLoanContext();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [requestNote, setRequestNote] = useState("");

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
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(true)}>
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

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRequestSubmit = () => {
    if (tags.length === 0) {
      toast.error("Please specify at least one document type");
      return;
    }

    // In a real application, this would send a request to the backend
    toast.success(`Documentation requested: ${tags.join(", ")}`);
    setIsRequestDialogOpen(false);
    setTags([]);
    setRequestNote("");
    setCurrentTag("");
  };

  return (
    <>
      <div className="mb-4 flex justify-end items-center gap-2">
        <Button variant="outline" onClick={() => setIsRequestDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Request Documentation
        </Button>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

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
                    href={doc.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {doc.name}
                  </a>
                </td>
                <td>{doc.type}</td>
                <td>{formatDate(doc.dateUploaded)}</td>
                <td>
                  {doc.approved && <Badge variant="default">Approved</Badge>}
                  {doc.rejected && <Badge variant="destructive">Rejected</Badge>}
                  {!doc.approved && !doc.rejected && <Badge variant="outline">In Review</Badge>}
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    {!doc.approved && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleApproveDoc(doc.id)} 
                        className="h-8 w-8 p-0 text-green-600"
                      >
                        <Check className="h-4 w-4" />
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
                    onKeyDown={handleTagKeyDown}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={addTag}
                    disabled={!currentTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
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
    </>
  );
}
