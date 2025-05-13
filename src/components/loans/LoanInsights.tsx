
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
import { MessageSquare, PlusCircle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";

interface LoanInsightsProps {
  loanId: string;
  insights: Insight[];
  onViewComments: (insight: Insight) => void;
}

// Create a static map to track which loans have completed their initial load
// This ensures persistence across tab changes
const loadedLoans = new Map<string, boolean>();

export function LoanInsights({ loanId, insights, onViewComments }: LoanInsightsProps) {
  const { saveInsight, getLoanById } = useLoanContext();
  const loan = getLoanById(loanId);
  const [loading, setLoading] = useState(!loadedLoans.get(loanId));
  const [visibleInsights, setVisibleInsights] = useState<Insight[]>([]);
  const initialLoadComplete = useRef(loadedLoans.get(loanId) || false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Function to check if an insight is already saved
  const isInsightSaved = (insightId: string) => {
    return loan?.savedInsights.some(savedInsight => savedInsight.id === insightId) || false;
  };

  const handleSaveInsight = (insightId: string) => {
    saveInsight(loanId, insightId);
    toast.success("Insight saved");
  };

  // Set visible insights on first render and when insights change
  useEffect(() => {
    // If we've already loaded this loan before, show insights immediately
    if (loadedLoans.get(loanId) || initialLoadComplete.current) {
      setLoading(false);
      setVisibleInsights([...insights]);
      return;
    }
    
    // No insights, no need to load
    if (insights.length === 0) {
      setLoading(false);
      return;
    }
    
    // Initial loading state
    setLoading(true);
    setVisibleInsights([]);
    setLoadingProgress(0);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 100); // Increment every 100ms to reach ~100% in 10 seconds
    
    // Show loading state for 10 seconds (increased from 5 seconds)
    const loadingTimeout = setTimeout(() => {
      // Show all insights at once after loading
      setVisibleInsights([...insights]);
      setLoading(false);
      initialLoadComplete.current = true;
      
      // Mark this loan as loaded in the static map
      loadedLoans.set(loanId, true);
      
      // Clear the progress interval if it's still running
      clearInterval(progressInterval);
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(progressInterval);
    };
  }, [insights, loanId]);

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <LoaderCircle className="h-12 w-12 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground mb-6">Generating insights from documents...</p>
            <div className="w-full max-w-md mx-auto">
              <Progress value={loadingProgress} className="h-2" />
            </div>
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
              {visibleInsights.map((insight) => {
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
                        {Array.isArray(insight.evidence) && insight.evidence.length > 0 ? (
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
                          insight.evidence && !Array.isArray(insight.evidence) ? (
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
                          ) : null
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
