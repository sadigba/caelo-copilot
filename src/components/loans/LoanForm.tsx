import { LoanForm } from "@/components/loans/LoanForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect } from "react";

export default function NewLoan() {
  // Tell the browser to scroll to the top when this component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger className="h-8 w-8" />
        <h1 className="text-2xl font-bold">New Loan Application</h1>
      </div>
      
      <LoanForm />
    </div>
  );
}
