
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
import { MinusCircle, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface SavedInsightsProps {
  loanId: string;
  savedInsights: Insight[];
}

export function SavedInsights({ loanId, savedInsights }: SavedInsightsProps) {
  const { unsaveInsight, addComment } = useLoanContext();
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleRemoveInsight = (insightId: string) => {
    unsaveInsight(loanId, insightId);
    toast.success("Insight removed");
  };

  const handleOpenCommentDialog = (event: React.MouseEvent, insight: Insight) => {
    event.stopPropagation(); // Prevent row click from triggering
    setSelectedInsight(insight);
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = () => {
    if (!selectedInsight || !commentText.trim()) return;
    
    addComment(loanId, selectedInsight.id, commentText.trim());
    setCommentText("");
    setIsCommentDialogOpen(false);
    toast.success("Comment added");
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
    <>
      <Card className="bg-caelo-50">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Insight</TableHead>
                <TableHead className="w-3/5">Narrative</TableHead>
                <TableHead className="w-15">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedInsights.map((insight) => (
                <TableRow 
                  key={insight.id}
                  onClick={() => handleRemoveInsight(insight.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className="font-medium">
                    <MinusCircle className="inline mr-2 h-4 w-4 text-destructive" />
                    {insight.title}
                    {insight.comments.length > 0 && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1">
                        {insight.comments.length}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={(e) => handleOpenCommentDialog(e, insight)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
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

      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedInsight ? `Comments on: ${selectedInsight.title}` : 'Comments'}
            </DialogTitle>
            <DialogDescription>
              View and add comments about this insight
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {selectedInsight?.comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No comments yet
              </div>
            ) : (
              selectedInsight?.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(comment.timestamp, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Add a comment
            </label>
            <Textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment here..."
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
