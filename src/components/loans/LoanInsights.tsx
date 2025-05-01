
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
import { PlusCircle } from "lucide-react";

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
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Insight</TableHead>
              <TableHead className="w-1/3">Supporting Evidence</TableHead>
              <TableHead className="w-1/3">Narrative</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insights.map((insight) => (
              <TableRow 
                key={insight.id} 
                className={insight.saved ? "bg-caelo-50" : ""}
                onClick={() => !insight.saved && handleSaveInsight(insight.id)}
                style={{ cursor: insight.saved ? "default" : "pointer" }}
              >
                <TableCell className="font-medium">
                  {!insight.saved && (
                    <PlusCircle className="inline mr-2 h-4 w-4 text-primary" />
                  )}
                  {insight.title}
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
