
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowCanvas from "@/components/workflows/WorkflowCanvas";
import WorkflowList from "@/components/workflows/WorkflowList";
import { WorkflowProvider } from "@/context/WorkflowContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Workflow } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";

export default function WorkflowBuilder() {
  const [activeTab, setActiveTab] = useState("workflows");
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);

  const handleCreateWorkflow = () => {
    const newWorkflowId = uuidv4();
    setEditingWorkflowId(newWorkflowId);
    setActiveTab("editor");
  };

  const handleEditWorkflow = (workflowId: string) => {
    setEditingWorkflowId(workflowId);
    setActiveTab("editor");
  };

  return (
    <WorkflowProvider>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Workflow Builder</h1>
          <Button onClick={handleCreateWorkflow} className="gap-2">
            <Plus className="h-4 w-4" /> New Workflow
          </Button>
        </div>
        <p className="text-muted-foreground mb-8">
          Build automated workflows to streamline credit processing tasks, approval flows, and notifications.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="workflows">My Workflows</TabsTrigger>
            <TabsTrigger value="editor">Workflow Editor</TabsTrigger>
          </TabsList>
          <TabsContent value="workflows" className="mt-6">
            <WorkflowList onEditWorkflow={handleEditWorkflow} />
          </TabsContent>
          <TabsContent value="editor" className="mt-6">
            <WorkflowCanvas workflowId={editingWorkflowId} />
          </TabsContent>
        </Tabs>
      </div>
    </WorkflowProvider>
  );
}
