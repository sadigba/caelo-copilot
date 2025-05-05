
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LoanInsightsProps {
  loanId: string;
  insights: Insight[];
}

export function LoanInsights({ loanId, insights }: LoanInsightsProps) {
  const { saveInsight } = useLoanContext();
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);

  const handleSaveInsight = (insightId: string) => {
    saveInsight(loanId, insightId);
    toast.success("Insight saved");
  };

  const handleViewComments = (insight: Insight) => {
    setSelectedInsight(insight);
    setCommentSheetOpen(true);
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
    <>
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
                  <TableHead className="w-[80px]">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insights.map((insight) => (
                  <TableRow 
                    key={insight.id} 
                    className={insight.saved ? "bg-caelo-50" : ""}
                  >
                    <TableCell>
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
                    <TableCell>
                      {insight.title}
                    </TableCell>
                    <TableCell>
                      {insight.narrative}
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewComments(insight)}
                        className="p-0 h-auto"
                      >
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        {insight.comments && insight.comments.length > 0 && (
                          <span className="ml-1 text-xs bg-secondary rounded-full px-1.5">
                            {insight.comments.length}
                          </span>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={commentSheetOpen} onOpenChange={setCommentSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Comments</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {selectedInsight?.comments && selectedInsight.comments.length > 0 ? (
              <div className="space-y-4">
                {selectedInsight.comments.map((comment, index) => (
                  <div key={index} className="bg-secondary/20 p-3 rounded-md">
                    <div className="text-sm">{comment.text}</div>
                    {comment.author && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {comment.author} {comment.timestamp && new Date(comment.timestamp).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No comments yet</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
