
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Insight, useLoanContext } from "@/context/LoanContext";
import { toast } from "sonner";

interface LoanInsightsProps {
  loanId: string;
  insights: Insight[];
}

export function LoanInsights({ loanId, insights }: LoanInsightsProps) {
  const { saveInsight } = useLoanContext();

  const handleSaveInsight = (insightId: string) => {
    saveInsight(loanId, insightId);
    toast.success("Insight saved");
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No insights available yet</p>
            <p className="text-sm text-muted-foreground">
              Upload and approve required documents to generate insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {insights.map((insight) => (
        <Card key={insight.id} className={insight.saved ? "border-caelo-200 bg-caelo-50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">{insight.title}</CardTitle>
              {!insight.saved && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSaveInsight(insight.id)}
                >
                  Save
                </Button>
              )}
              {insight.saved && (
                <span className="text-xs bg-caelo-100 text-caelo-800 px-2 py-1 rounded-full">
                  Saved
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">{insight.narrative}</p>
            <div className="text-sm">
              <span className="font-medium">Supporting Evidence:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {insight.evidence.map((evidence, index) => (
                  <span 
                    key={index}
                    className="bg-muted px-2 py-1 rounded text-muted-foreground"
                  >
                    {evidence}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
