
import LoanForm from "./LoanForm";
import { useLoanContext } from "@/context/LoanContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function LoanFormWrapper() {
  const { addLoan } = useLoanContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // This function will ensure all required fields are provided before passing to addLoan
  const handleSubmitLoan = (loanData: any) => {
    // Ensure all required fields are present
    const completeData = {
      ...loanData,
      // Provide defaults for any missing required fields
      businessName: loanData.businessName || "Untitled Business",
      loanType: loanData.loanType || "Investment Property",
      propertyType: loanData.propertyType || "Multifamily",
      loanAmount: loanData.loanAmount || 0,
      purpose: loanData.purpose || "",
      industry: loanData.industry || "",
      yearsInOperation: loanData.yearsInOperation || 0,
      sponsorName: loanData.sponsorName || "",
      sponsorTitle: loanData.sponsorTitle || "",
      sponsorEmail: loanData.sponsorEmail || "",
      sponsorPhone: loanData.sponsorPhone || "",
      propertyAddress: loanData.propertyAddress || "",
      submissionDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    addLoan(completeData);
    
    toast({
      title: "Success",
      description: "Loan application submitted successfully!",
    });
    
    navigate('/');
  };
  
  return <LoanForm onSubmit={handleSubmitLoan} />;
}
