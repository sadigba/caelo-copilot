
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function AskCaelo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Sample responses based on question content
      let response = "";
      
      if (question.toLowerCase().includes("cash flow")) {
        response = "Based on the documents provided, the borrower's cash flow appears stable. The business has maintained consistent monthly revenues between $35,000-$42,000 over the past 12 months, with expenses ranging from $18,000-$22,000. This results in a positive cash flow averaging $18,500 per month.\n\nThe debt coverage ratio (DCR) is calculated to be 1.48, which exceeds the minimum requirement of 1.25 for this loan type.";
      } else if (question.toLowerCase().includes("document")) {
        response = "For this Owner-Occupied CRE loan, I recommend requesting the following additional documents:\n\n1. Three years of business tax returns\n2. Personal financial statements from all owners with 20%+ ownership\n3. Current rent roll and copies of existing leases\n4. Property insurance documentation\n5. Environmental report (Phase I at minimum)\n6. Current property tax statements";
      } else if (question.toLowerCase().includes("risk")) {
        response = "Key risks identified for this loan application:\n\n1. Lease expiration for the main tenant (45% of rental income) in 18 months\n2. Property tax reassessment pending, potentially increasing annual expenses by 8-12%\n3. Recent decline in occupancy rates for similar properties in the area\n4. Borrower's limited experience with this specific property type\n5. Higher than average debt-to-income ratio for the primary sponsor";
      } else {
        response = "I've analyzed the available documents for this loan application. Here are my observations:\n\n• The property appears to be in good condition based on the inspection report, with only minor maintenance issues noted.\n\n• The borrower has a strong credit history with no late payments in the past 24 months.\n\n• The proposed loan-to-value ratio of 68% is within acceptable parameters for this loan type.\n\nI recommend proceeding with the underwriting process while requesting additional financial documentation to verify the projected rental income.";
      }
      
      setAnswer(response);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Ask Caelo anything about this loan application..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[60px] flex-1"
        />
        <Button type="submit" disabled={!question.trim() || loading}>
          {loading ? "Thinking..." : "Ask"}
        </Button>
      </form>
      
      {answer && (
        <Card className="p-4 whitespace-pre-line">
          <div className="mb-2 text-sm font-medium text-caelo-800">Caelo's Response:</div>
          <div className="text-sm">{answer}</div>
        </Card>
      )}
    </div>
  );
}
