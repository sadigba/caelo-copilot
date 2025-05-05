
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loan } from "@/context/LoanContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface LoanListItemProps {
  loan: Loan;
}

export function LoanListItem({ loan }: LoanListItemProps) {
  return (
    <tr>
      <td>
        <span className="text-sm text-muted-foreground font-mono">
          {loan.id.substring(0, 8)}
        </span>
      </td>
      <td>
        <Link to={`/loans/${loan.id}`} className="font-medium text-primary hover:underline">
          {loan.businessName}
        </Link>
      </td>
      <td>{loan.loanType}</td>
      <td>{formatCurrency(loan.loanAmount)}</td>
      <td>
        <StatusBadge status={loan.status} />
      </td>
      <td>{loan.submissionDate ? formatDate(loan.submissionDate) : "N/A"}</td>
      <td>{loan.lastUpdated ? formatDate(loan.lastUpdated) : "N/A"}</td>
    </tr>
  );
}

function StatusBadge({ status }: { status: Loan["status"] }) {
  let variant: 
    | "default"
    | "secondary"
    | "outline"
    | "destructive" = "default";
  
  switch (status) {
    case "In Progress":
      variant = "secondary";
      break;
    case "Ready for Review":
    case "In Review":
    case "Under Review":
    case "New Application":
      variant = "default";
      break;
    case "Awaiting Docs":
      variant = "outline";
      break;
    case "Approved":
      variant = "default";
      break;
    case "Declined":
      variant = "destructive";
      break;
  }
  
  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}
