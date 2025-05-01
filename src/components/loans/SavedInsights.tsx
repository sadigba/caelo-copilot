
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Insight, useLoanContext } from "@/context/LoanContext";
import { toast } from "sonner";

interface SavedInsightsProps {
  loanId: string;
  savedInsights: Insight[];
}

export function SavedInsights({ loanId, savedInsights }: SavedInsightsProps) {
  const { unsaveInsight } = useLoanContext();

  const handleRemoveInsight = (insightId: string) => {
    unsaveInsight(loanId, insightId);
    toast.success("Insight removed");
  };

  if (savedInsights.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No saved insights yet</p>
            <p className="text-sm text-muted-foreground">
              Save insights from the Insights Tracker to build your credit memo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {savedInsights.map((insight) => (
        <Card key={insight.id} className="border-caelo-200 bg-caelo-50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">{insight.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveInsight(insight.id)}
              >
                Remove
              </Button>
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
                    className="bg-caelo-100 px-2 py-1 rounded text-caelo-700"
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
