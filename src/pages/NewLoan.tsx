
import { LoanForm } from "@/components/loans/LoanForm";

export default function NewLoan() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">New Loan Application</h1>
      </div>
      
      <LoanForm />
    </div>
  );
}
