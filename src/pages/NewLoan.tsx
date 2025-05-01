
import { LoanForm } from "@/components/loans/LoanForm";

export default function NewLoan() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Loan Application</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to create a new loan application.
        </p>
      </div>
      
      <LoanForm />
    </div>
  );
}
