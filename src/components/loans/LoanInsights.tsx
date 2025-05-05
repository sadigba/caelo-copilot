
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
import { MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoanInsightsProps {
  loanId: string;
  insights: Insight[];
  onViewComments: (insight: Insight) => void;
}

export function LoanInsights({ loanId, insights, onViewComments }: LoanInsightsProps) {
  const { saveInsight, getLoanById } = useLoanContext();
  const loan = getLoanById(loanId);

  // Function to check if an insight is already saved
  const isInsightSaved = (insightId: string) => {
    return loan?.savedInsights.some(savedInsight => savedInsight.id === insightId) || false;
  };

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
        <div className="overflow-x-auto">
          <Table className="loan-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Insight</TableHead>
                <TableHead>Narrative</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead className="w-[100px] text-left">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insights.map((insight) => {
                const saved = isInsightSaved(insight.id);
                return (
                  <TableRow 
                    key={insight.id} 
                    className={saved ? "bg-caelo-50" : ""}
                  >
                    <TableCell>
                      {!saved && (
                        <button
                          onClick={() => handleSaveInsight(insight.id)}
                          className="flex items-center justify-center"
                        >
                          <PlusCircle className="h-5 w-5 text-primary" />
                          <span className="sr-only">Save insight</span>
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      {insight.title}
                    </TableCell>
                    <TableCell>
                      {insight.narrative}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(insight.evidence) ? (
                          insight.evidence.map((evidence, index) => (
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
                          ))
                        ) : (
                          insight.evidence && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help underline-offset-4 underline decoration-dotted">
                                    (1)
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{insight.evidence}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewComments(insight)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {insight.comments && insight.comments.length > 0 ? (
                            <span className="text-xs">{insight.comments.length}</span>
                          ) : (
                            <span className="text-xs">Add</span>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
