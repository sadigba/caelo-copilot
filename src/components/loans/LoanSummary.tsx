
import { Card, CardContent } from "@/components/ui/card";
import { Loan } from "@/context/LoanContext";
import { formatCurrency } from "@/lib/utils";

interface LoanSummaryProps {
  loan: Loan;
}

export function LoanSummary({ loan }: LoanSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Loan Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd>{loan.loanType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                <dd>{formatCurrency(loan.loanAmount)}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Purpose</dt>
                <dd>{loan.purpose}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Business Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Business Name</dt>
                <dd>{loan.businessName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                <dd>{loan.industry || "Not specified"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Years in Operation</dt>
                <dd>{loan.yearsInOperation || "Not specified"}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Primary Contact</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd>{loan.sponsorName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Title</dt>
                <dd>{loan.sponsorTitle || "Not specified"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd>{loan.sponsorEmail}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd>{loan.sponsorPhone}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Property Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd>{loan.propertyAddress}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Property Type</dt>
                <dd>{loan.propertyType}</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
