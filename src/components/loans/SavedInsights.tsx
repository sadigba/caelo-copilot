
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
import { MessageSquare, MinusCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface SavedInsightsProps {
  loanId: string;
  savedInsights: Insight[];
}

interface NewInsightRow {
  id: string;
  title: string;
  narrative: string;
  evidence: string;
}

export function SavedInsights({ loanId, savedInsights }: SavedInsightsProps) {
  const { unsaveInsight, addInsight } = useLoanContext();
  const [newInsightRows, setNewInsightRows] = useState<NewInsightRow[]>([
    { 
      id: `new-${Date.now()}`, 
      title: "", 
      narrative: "", 
      evidence: ""
    }
  ]);
  
  // For comments sidebar
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  
  // Reference for auto-focusing on new rows
  const lastRowRef = useRef<HTMLTableRowElement>(null);
  
  const handleRemoveInsight = (insightId: string) => {
    unsaveInsight(loanId, insightId);
    toast.success("Insight removed");
  };

  const handleViewComments = (insight: Insight) => {
    setSelectedInsight(insight);
    setCommentSheetOpen(true);
  };

  const handleAddNewRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      title: "",
      narrative: "",
      evidence: ""
    };
    setNewInsightRows([...newInsightRows, newRow]);
    
    // Focus on new row after it's rendered
    setTimeout(() => {
      if (lastRowRef.current) {
        const firstInput = lastRowRef.current.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const handleRemoveNewRow = (id: string) => {
    const updatedRows = newInsightRows.filter(row => row.id !== id);
    setNewInsightRows(updatedRows);
  };

  const updateNewInsightRow = (id: string, field: keyof NewInsightRow, value: string) => {
    const updatedRows = newInsightRows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setNewInsightRows(updatedRows);
  };

  const handleSaveNewInsight = (row: NewInsightRow) => {
    // At least title or narrative should be provided
    if (!row.title && !row.narrative) {
      toast.error("Please provide at least a title or narrative");
      return;
    }

    // Create and save the new insight
    addInsight(loanId, {
      title: row.title || "Untitled Insight",
      narrative: row.narrative || "",
      evidence: row.evidence ? [row.evidence] : [],
    });

    // Remove the row from the new insights list
    handleRemoveNewRow(row.id);
    
    // Add a new empty row if there are no more new rows
    if (newInsightRows.length <= 1) {
      handleAddNewRow();
    }

    toast.success("Insight created and saved");
  };

  return (
    <>
      <Card className="bg-caelo-50">
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
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedInsights.map((insight) => (
                  <TableRow key={insight.id}>
                    <TableCell>
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
                    <TableCell className="text-right">
                      {/* No action needed here */}
                    </TableCell>
                  </TableRow>
                ))}
                
                {newInsightRows.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    ref={index === newInsightRows.length - 1 ? lastRowRef : null}
                    className="border-t-2 border-secondary/20"
                  >
                    <TableCell>
                      {newInsightRows.length > 1 && (
                        <button
                          onClick={() => handleRemoveNewRow(row.id)}
                          className="flex items-center justify-center"
                        >
                          <MinusCircle className="h-5 w-5 text-destructive" />
                          <span className="sr-only">Remove row</span>
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Enter insight title"
                        value={row.title}
                        onChange={(e) => updateNewInsightRow(row.id, 'title', e.target.value)}
                        className="w-full border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="Enter narrative"
                        value={row.narrative}
                        onChange={(e) => updateNewInsightRow(row.id, 'narrative', e.target.value)}
                        className="w-full min-h-[60px] border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Add supporting evidence"
                        value={row.evidence}
                        onChange={(e) => updateNewInsightRow(row.id, 'evidence', e.target.value)}
                        className="w-full border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      {/* Comments not available for new insights */}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          onClick={() => handleSaveNewInsight(row)} 
                          size="sm" 
                          className="h-8 px-2"
                        >
                          Save
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={handleAddNewRow}
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Row
              </Button>
            </div>
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
