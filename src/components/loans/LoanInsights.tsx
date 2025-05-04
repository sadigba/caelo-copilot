
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
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Insight</TableHead>
              <TableHead className="w-1/3">Narrative</TableHead>
              <TableHead className="w-1/6">Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insights.map((insight) => (
              <TableRow 
                key={insight.id} 
                className={insight.saved ? "bg-caelo-50" : ""}
              >
                <TableCell className="w-[40px]">
                  {!insight.saved && (
                    <button
                      onClick={() => handleSaveInsight(insight.id)}
                      className="flex items-center justify-center"
                    >
                      <PlusCircle className="h-5 w-5 text-primary" />
                      <span className="sr-only">Save insight</span>
                    </button>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {insight.title}
                </TableCell>
                <TableCell>{insight.narrative}</TableCell>
                <TableCell className="text-sm">
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
      </CardContent>
    </Card>
  );
}
