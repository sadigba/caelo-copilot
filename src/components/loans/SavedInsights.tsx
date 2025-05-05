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
import { MinusCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SavedInsightsProps {
  loanId: string;
  savedInsights: Insight[];
}

export function SavedInsights({ loanId, savedInsights }: SavedInsightsProps) {
  const { unsaveInsight, addInsight } = useLoanContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInsight, setNewInsight] = useState<{
    title: string;
    narrative: string;
    documentType: string;
    evidence: string;
  }>({
    title: "",
    narrative: "",
    documentType: "",
    evidence: "",
  });

  const handleRemoveInsight = (insightId: string) => {
    unsaveInsight(loanId, insightId);
    toast.success("Insight removed");
  };

  const handleCreateInsight = () => {
    if (!newInsight.title || !newInsight.narrative) {
      toast.error("Title and narrative are required");
      return;
    }

    // Create evidence array from the optional evidence field
    const evidenceArray = newInsight.evidence ? [newInsight.evidence] : [];

    // Create and save the new insight
    addInsight(loanId, {
      title: newInsight.title,
      narrative: newInsight.narrative,
      evidence: evidenceArray,
    });

    // Reset form and close dialog
    setNewInsight({
      title: "",
      narrative: "",
      documentType: "",
      evidence: "",
    });
    setIsCreateDialogOpen(false);
    toast.success("Insight created and saved");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Empty div to maintain flex spacing */}
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Create Insight
        </Button>
      </div>

      {savedInsights.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No saved insights yet</p>
              <p className="text-sm text-muted-foreground">
                Save insights from the Insights Tracker or create new insights to build your credit memo
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-caelo-50">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table className="loan-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="action-column"></TableHead>
                    <TableHead>Insight</TableHead>
                    <TableHead className="narrative-column">Narrative</TableHead>
                    <TableHead className="evidence-column">Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedInsights.map((insight) => (
                    <TableRow key={insight.id}>
                      <TableCell className="action-column">
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
                      <TableCell className="narrative-column">
                        {insight.narrative}
                      </TableCell>
                      <TableCell className="evidence-column">
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
                              </TooltipProvider>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Insight Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Insight</DialogTitle>
            <DialogDescription>
              Create a custom insight to add to your analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="insight-title" className="text-right col-span-1">
                Title
              </label>
              <Input
                id="insight-title"
                placeholder="e.g., Strong Cash Flow Position"
                value={newInsight.title}
                onChange={(e) => setNewInsight({...newInsight, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="insight-narrative" className="text-right col-span-1">
                Narrative
              </label>
              <Textarea
                id="insight-narrative"
                placeholder="Describe the insight and its implications"
                value={newInsight.narrative}
                onChange={(e) => setNewInsight({...newInsight, narrative: e.target.value})}
                className="col-span-3"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="document-type" className="text-right col-span-1">
                Document (Optional)
              </label>
              <Select
                value={newInsight.documentType}
                onValueChange={(value) => setNewInsight({...newInsight, documentType: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select document type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Statements">Financial Statements</SelectItem>
                  <SelectItem value="Rent Roll">Rent Roll</SelectItem>
                  <SelectItem value="Tax Returns">Tax Returns</SelectItem>
                  <SelectItem value="Business Plan">Business Plan</SelectItem>
                  <SelectItem value="Property Appraisal">Property Appraisal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="insight-evidence" className="text-right col-span-1">
                Evidence (Optional)
              </label>
              <Input
                id="insight-evidence"
                placeholder="e.g., Page 3 shows consistent revenue growth of 15%"
                value={newInsight.evidence}
                onChange={(e) => setNewInsight({...newInsight, evidence: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInsight}>
              Create Insight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
