import { CommentsSidebar } from "@/components/loans/LoanForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewLoan() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the loan detail page after 1 second
    const timer = setTimeout(() => {
      navigate("/loan/example-loan-id");
    }, 1000);

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex flex-col h-full">
      {/* Header with sidebar trigger, title and navigation */}
      <div>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-medium leading-tight">New Loan</h1>
                <p className="text-sm text-muted-foreground">
                  Redirecting to loan detail page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
