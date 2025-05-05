
import { LoanForm } from "@/components/loans/LoanForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NewLoan() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold">New Loan Application</h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to create a new loan application.
          </p>
        </div>
      </div>
      
      <LoanForm />
    </div>
  );
}
