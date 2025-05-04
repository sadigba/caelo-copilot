import { Card, CardContent } from "@/components/ui/card";
import { Insight, useLoanContext } from "@/context/LoanContext";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MinusCircle } from "lucide-react";

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
    <Card className="bg-caelo-50">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table className="loan-table">
            <TableHeader>
              <TableRow>
                <TableHead className="action-column"></TableHead>
                <TableHead>Insight</TableHead>
                <TableHead className="narrative-column">Narrative</TableHead>
                <TableHead className="evidence-column">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedInsights.map((insight) => (
                <TableRow key={insight.id}>
                  <TableCell className="action-column">
                    <button
                      onClick={() => handleRemoveInsight(insight.id)}
                      className="flex items-center justify-center"
                    >
                      <MinusCircle className="h-5 w-5 text-destructive" />
                      <span className="sr-only">Remove insight</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    {insight.title}
                  </TableCell>
                  <TableCell className="narrative-column">
                    {insight.narrative}
                  </TableCell>
                  <TableCell className="evidence-column">
                    <div className="flex flex-wrap gap-1">
                      {insight.evidence.map((evidence, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline-offset-4 underline decoration-dotted">
                                ({index + 1})
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{evidence}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
