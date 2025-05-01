
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Insight</TableHead>
              <TableHead className="w-1/3">Supporting Evidence</TableHead>
              <TableHead className="w-1/3">Narrative</TableHead>
              <TableHead className="w-20 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedInsights.map((insight) => (
              <TableRow key={insight.id}>
                <TableCell className="font-medium">{insight.title}</TableCell>
                <TableCell>
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
                <TableCell>{insight.narrative}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInsight(insight.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
