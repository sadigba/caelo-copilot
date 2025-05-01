
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Document, Loan, useLoanContext } from "@/context/LoanContext";
import { Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DocumentTableProps {
  loanId: string;
  documents: Document[];
}

export function DocumentTable({ loanId, documents }: DocumentTableProps) {
  const { updateDocument } = useLoanContext();

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No documents have been uploaded yet</p>
            <p className="text-sm text-muted-foreground">
              Upload documents to begin the analysis process
            </p>
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

  return (
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
                {!doc.approved && !doc.rejected && <Badge variant="outline">Pending</Badge>}
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
  );
}
