
import { LoanForm } from "@/components/loans/LoanForm";

export default function NewLoan() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Loan Application</h1>
      <LoanForm />
    </div>
  );
}
