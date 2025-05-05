
import { LoanForm } from "@/components/loans/LoanForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NewLoan() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">New Loan Application</h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to create a new loan application.
          </p>
        </div>
        <SidebarTrigger />
      </div>
      
      <LoanForm />
    </div>
  );
}
