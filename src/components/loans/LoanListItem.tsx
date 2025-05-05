
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { Loan } from "@/context/LoanContext";

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

  return (
    <Link to={`/loans/${loan.id}`} className="block">
      <Card className="hover:bg-accent/20 transition-colors duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-primary/10 p-2">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{loan.businessName}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        {loan.loanType} | {formatCurrency(loan.loanAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{loan.propertyType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2 md:min-w-28">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 inline mr-1" />
                  {new Date(loan.submissionDate).toLocaleDateString()}
                </span>
              </div>
              {getStatusBadge(loan.status)}
            </div>
          </div>

          <div className="mt-4 flex flex-col xs:flex-row gap-3 justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated: {new Date(loan.lastUpdated).toLocaleDateString()}</span>
            </div>
            
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
              
              {pendingDocs > 0 && (
                <div className="flex items-center ml-2" title="Pending documents">
                  <FileCheck className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                  <span>{pendingDocs}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
