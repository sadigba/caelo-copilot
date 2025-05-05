
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Clock, User, FileText } from "lucide-react";
import { Document } from "@/context/LoanContext";

// Define a type for audit entry
export type AuditEntry = {
  id: string;
  action: string;
  documentName?: string;
  documentType?: string;
  user: string;
  timestamp: string;
  details?: string;
};

// Generate audit entries from documents
export const generateAuditEntries = (documents: Document[]): AuditEntry[] => {
  return documents.map(doc => ({
    id: doc.id,
    action: "Document Upload",
    documentName: doc.name,
    documentType: doc.type,
    user: "Jane Doe", // In a real app, this would come from auth context
    timestamp: doc.dateUploaded,
    details: `${doc.name} was uploaded`
  }));
};

interface AuditTrailProps {
  entries: AuditEntry[];
}

export function AuditTrail({ entries }: AuditTrailProps) {
  // Sort entries by timestamp (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Audit Trail</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.length > 0 ? (
              sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDate(entry.timestamp)}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {entry.action}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {entry.user}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {entry.documentName && (
                      <span className="inline-flex items-center">
                        <span className="font-medium">{entry.documentName}</span>
                        {entry.documentType && (
                          <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                            {entry.documentType}
                          </span>
                        )}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No audit entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
