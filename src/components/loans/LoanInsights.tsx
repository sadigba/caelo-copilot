
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface LoanInsightsProps {
  loanId: string;
  insights: Insight[];
}

export function LoanInsights({ loanId, insights }: LoanInsightsProps) {
  const { saveInsight, addComment } = useLoanContext();
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const handleSaveInsight = (insightId: string) => {
    saveInsight(loanId, insightId);
    toast.success("Insight saved");
  };

  const handleSubmitComment = (insightId: string) => {
    if (!commentText[insightId]?.trim()) return;
    
    addComment(loanId, insightId, commentText[insightId].trim());
    setCommentText(prev => ({
      ...prev,
      [insightId]: ""
    }));
    toast.success("Comment added");
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
              <TableHead className="w-1/5">Insight</TableHead>
              <TableHead className="w-1/4">Narrative</TableHead>
              <TableHead className="w-1/10">Evidence</TableHead>
              <TableHead className="w-2/5">Comments</TableHead>
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
                  {insight.comments.length > 0 && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1">
                      {insight.comments.length}
                    </span>
                  )}
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
                <TableCell 
                  onClick={(e) => e.stopPropagation()} 
                  className="align-top"
                >
                  <div className="space-y-3">
                    {insight.comments.length > 0 ? (
                      <div className="max-h-[150px] overflow-y-auto space-y-2">
                        {insight.comments.map((comment) => (
                          <div key={comment.id} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start text-xs">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-muted-foreground">
                                {format(comment.timestamp, 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic">No comments yet</div>
                    )}
                    
                    <div className="space-y-1">
                      <Textarea
                        value={commentText[insight.id] || ''}
                        onChange={(e) => setCommentText(prev => ({
                          ...prev,
                          [insight.id]: e.target.value
                        }))}
                        placeholder="Add a comment..."
                        className="resize-none text-sm min-h-[60px] bg-white"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleSubmitComment(insight.id)}
                        disabled={!commentText[insight.id]?.trim()}
                        className="text-xs h-7 w-full"
                      >
                        Add Comment
                      </Button>
                    </div>
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
