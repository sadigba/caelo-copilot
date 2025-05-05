
import { LoanForm } from "@/components/loans/LoanForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NewLoan() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">New Loan Application</h1>
      </div>
      
      <LoanForm />
    </div>
  );
}
