
import React from "react";
import {
  Building,
  CreditCard,
  Calendar,
  MapPin,
  Clock,
  File,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { Loan } from "@/context/LoanContext";
import { TableRow, TableCell } from "@/components/ui/table";

interface LoanListItemProps {
  loan: Loan;
}

export function LoanListItem({ loan }: LoanListItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            Declined
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Pending
          </Badge>
        );
      case "in_review":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            In Review
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getDocumentStatus = () => {
    const totalDocs = loan.documents.length;
    const approvedDocs = loan.documents.filter((doc) => doc.approved).length;
    const rejectedDocs = loan.documents.filter((doc) => doc.rejected).length;
    const pendingDocs = totalDocs - approvedDocs - rejectedDocs;

    return { totalDocs, approvedDocs, rejectedDocs, pendingDocs };
  };

  const { totalDocs, approvedDocs, rejectedDocs, pendingDocs } = getDocumentStatus();
  const submissionDate = new Date(loan.submissionDate).toLocaleDateString();
  const lastUpdated = new Date(loan.lastUpdated).toLocaleDateString();

  return (
    <TableRow className="hover:bg-accent/20 transition-colors duration-200">
      <TableCell className="font-medium">
        <Link to={`/loans/${loan.id}`} className="hover:underline">
          {loan.id}
        </Link>
      </TableCell>
      
      <TableCell>
        <Link to={`/loans/${loan.id}`} className="hover:underline">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-1.5">
              <Building className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{loan.businessName}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>{loan.propertyType}</span>
              </div>
            </div>
          </div>
        </Link>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <span>{loan.loanType}</span>
          <span className="text-sm font-medium">{formatCurrency(loan.loanAmount)}</span>
        </div>
      </TableCell>
      
      <TableCell>
        {formatCurrency(loan.loanAmount)}
      </TableCell>
      
      <TableCell>
        {getStatusBadge(loan.status)}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{submissionDate}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{lastUpdated}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <div className="flex items-center" title="Total documents">
            <File className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{totalDocs}</span>
          </div>
          
          {approvedDocs > 0 && (
            <div className="flex items-center ml-2" title="Approved documents">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
              <span>{approvedDocs}</span>
            </div>
          )}
          
          {rejectedDocs > 0 && (
            <div className="flex items-center ml-2" title="Rejected documents">
              <XCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
              <span>{rejectedDocs}</span>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
