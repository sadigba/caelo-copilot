
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
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoanInsightsProps {
  loanId: string;
  insights: Insight[];
  onViewComments: (insight: Insight) => void;
}

export function LoanInsights({ loanId, insights, onViewComments }: LoanInsightsProps) {
  const { saveInsight, getLoanById } = useLoanContext();
  const loan = getLoanById(loanId);
  const [loading, setLoading] = useState(true);
  const [visibleInsights, setVisibleInsights] = useState<Insight[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingState, setTypingState] = useState<{
    insightIndex: number;
    field: 'title' | 'narrative' | 'evidence';
    charIndex: number;
    completed: boolean;
  }>({
    insightIndex: 0,
    field: 'title',
    charIndex: 0,
    completed: false
  });

  // Function to check if an insight is already saved
  const isInsightSaved = (insightId: string) => {
    return loan?.savedInsights.some(savedInsight => savedInsight.id === insightId) || false;
  };

  const handleSaveInsight = (insightId: string) => {
    saveInsight(loanId, insightId);
    toast.success("Insight saved");
  };

  // Loading effect for insights
  useEffect(() => {
    if (insights.length === 0) {
      setLoading(false);
      return;
    }
    
    // Initial loading state
    setLoading(true);
    setVisibleInsights([]);
    
    // Show loading state for 2 seconds
    const loadingTimeout = setTimeout(() => {
      // Start revealing insights one by one
      setVisibleInsights([{ ...insights[0], title: '', narrative: '', evidence: [] }]);
      setLoading(false);
      setTypingIndex(0);
      setTypingState({
        insightIndex: 0,
        field: 'title',
        charIndex: 0,
        completed: false
      });
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, [insights]);

  // Typing effect for insights
  useEffect(() => {
    if (loading || typingState.completed || insights.length === 0) return;
    
    const currentInsight = insights[typingState.insightIndex];
    if (!currentInsight) return;
    
    // Get text to type based on current field
    let targetText = '';
    let isComplete = false;
    let nextField: 'title' | 'narrative' | 'evidence' = 'title';
    let nextCharIndex = typingState.charIndex + 1;
    
    switch(typingState.field) {
      case 'title':
        targetText = currentInsight.title;
        if (nextCharIndex >= targetText.length) {
          nextField = 'narrative';
          nextCharIndex = 0;
        } else {
          nextField = 'title';
        }
        break;
      case 'narrative':
        targetText = currentInsight.narrative;
        if (nextCharIndex >= targetText.length) {
          nextField = 'evidence';
          nextCharIndex = 0;
        } else {
          nextField = 'narrative';
        }
        break;
      case 'evidence':
        // Handle evidence - we'll increment a counter for evidence items
        const evidenceArray = Array.isArray(currentInsight.evidence) 
          ? currentInsight.evidence 
          : currentInsight.evidence ? [currentInsight.evidence] : [];
        
        if (nextCharIndex >= evidenceArray.length) {
          // Move to next insight
          if (typingState.insightIndex + 1 < insights.length) {
            const nextInsights = [...visibleInsights];
            nextInsights.push({ ...insights[typingState.insightIndex + 1], title: '', narrative: '', evidence: [] });
            setVisibleInsights(nextInsights);
            
            nextField = 'title';
            nextCharIndex = 0;
            isComplete = false;
            
            // Update typing state for next insight
            setTypingState({
              insightIndex: typingState.insightIndex + 1,
              field: nextField,
              charIndex: nextCharIndex,
              completed: isComplete
            });
            return;
          } else {
            // All insights complete
            isComplete = true;
            setTypingState(prev => ({ ...prev, completed: true }));
            setVisibleInsights([...insights]); // Show all insights fully
            return;
          }
        } else {
          nextField = 'evidence';
        }
        break;
    }
    
    // Update the visible insight with typed text
    const typing = setTimeout(() => {
      const updatedInsights = [...visibleInsights];
      const updatedInsight = { ...updatedInsights[typingState.insightIndex] };
      
      switch(typingState.field) {
        case 'title':
          updatedInsight.title = currentInsight.title.substring(0, nextCharIndex);
          break;
        case 'narrative':
          updatedInsight.title = currentInsight.title; // Ensure title is complete
          updatedInsight.narrative = currentInsight.narrative.substring(0, nextCharIndex);
          break;
        case 'evidence':
          updatedInsight.title = currentInsight.title; // Ensure title is complete
          updatedInsight.narrative = currentInsight.narrative; // Ensure narrative is complete
          
          // Handle evidence
          const evidenceArray = Array.isArray(currentInsight.evidence) 
            ? currentInsight.evidence 
            : currentInsight.evidence ? [currentInsight.evidence] : [];
          
          updatedInsight.evidence = evidenceArray.slice(0, nextCharIndex);
          break;
      }
      
      updatedInsights[typingState.insightIndex] = updatedInsight;
      setVisibleInsights(updatedInsights);
      
      // Update typing state
      setTypingState({
        insightIndex: typingState.insightIndex,
        field: nextField,
        charIndex: nextCharIndex,
        completed: isComplete
      });
    }, typingState.field === 'evidence' ? 500 : 50); // Slower for evidence, faster for text
    
    return () => clearTimeout(typing);
  }, [typingState, loading, insights, visibleInsights]);

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
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">Generating insights from documents...</p>
            <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg mx-auto">
              <Skeleton className="w-full h-10 bg-caelo-100" />
              <Skeleton className="w-full h-28 bg-caelo-100" />
              <div className="flex gap-2 w-full">
                <Skeleton className="w-1/3 h-6 bg-caelo-100" />
                <Skeleton className="w-1/3 h-6 bg-caelo-100" />
                <Skeleton className="w-1/3 h-6 bg-caelo-100" />
              </div>
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
              {visibleInsights.map((insight, idx) => {
                const saved = isInsightSaved(insight.id);
                const isTyping = typingState.insightIndex === idx && !typingState.completed;
                
                return (
                  <TableRow 
                    key={insight.id} 
                    className={saved ? "bg-caelo-50" : ""}
                  >
                    <TableCell>
                      {!saved && insight.title && (
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
                      {insight.title || (isTyping && typingState.field === 'title' && (
                        <span className="inline-block animate-pulse">|</span>
                      ))}
                    </TableCell>
                    <TableCell>
                      {insight.narrative || (isTyping && typingState.field === 'narrative' && (
                        <span className="inline-block animate-pulse">|</span>
                      ))}
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
                          ) : isTyping && typingState.field === 'evidence' ? (
                            <span className="inline-block animate-pulse">|</span>
                          ) : null
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-start">
                        {insight.title && (
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
                        )}
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
