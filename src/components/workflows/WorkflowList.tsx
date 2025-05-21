
import { useWorkflow } from '@/context/WorkflowContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Trash2, 
  Play, 
  Square, 
  LayoutList,
  Plus,
  Copy
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface WorkflowListProps {
  onEditWorkflow: (workflowId: string) => void;
}

export default function WorkflowList({ onEditWorkflow }: WorkflowListProps) {
  const { 
    workflows, 
    templates, 
    deleteWorkflow, 
    activateWorkflow,
    deactivateWorkflow,
    createWorkflowFromTemplate
  } = useWorkflow();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    
    try {
      const newWorkflow = createWorkflowFromTemplate(selectedTemplate);
      if (newWorkflowName) {
        newWorkflow.name = newWorkflowName;
      }
      onEditWorkflow(newWorkflow.id);
      setIsDialogOpen(false);
      setSelectedTemplate(null);
      setNewWorkflowName('');
      toast.success('Workflow created from template');
    } catch (error) {
      toast.error('Failed to create workflow from template');
    }
  };
  
  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <LayoutList className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">No workflows yet</h3>
              <p className="text-muted-foreground mt-1">
                Create your first workflow to start automating your credit processes
              </p>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button onClick={() => onEditWorkflow('new')}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Workflow
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create from Template</DialogTitle>
                    <DialogDescription>
                      Choose a template to quickly get started with common workflow patterns
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="mb-4">
                      <Label htmlFor="workflow-name">Workflow Name (Optional)</Label>
                      <Input 
                        id="workflow-name" 
                        placeholder="My New Workflow"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                      />
                    </div>
                    
                    <RadioGroup 
                      value={selectedTemplate || ''}
                      onValueChange={setSelectedTemplate}
                    >
                      <div className="space-y-4">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center space-x-2 rounded-md border p-4 hover:bg-accent"
                          >
                            <RadioGroupItem value={template.id} id={template.id} />
                            <div className="flex-1">
                              <Label 
                                htmlFor={template.id} 
                                className="flex items-center justify-between"
                              >
                                {template.name}
                                <Badge variant="outline">{template.category}</Badge>
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFromTemplate}>
                      Create Workflow
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Your Workflows</h2>
        
        <div className="flex gap-2">
          <Button onClick={() => onEditWorkflow('new')} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Use Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create from Template</DialogTitle>
                <DialogDescription>
                  Choose a template to quickly get started with common workflow patterns
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="mb-4">
                  <Label htmlFor="workflow-name">Workflow Name (Optional)</Label>
                  <Input 
                    id="workflow-name" 
                    placeholder="My New Workflow"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                  />
                </div>
                
                <RadioGroup 
                  value={selectedTemplate || ''}
                  onValueChange={setSelectedTemplate}
                >
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center space-x-2 rounded-md border p-4 hover:bg-accent"
                      >
                        <RadioGroupItem value={template.id} id={template.id} />
                        <div className="flex-1">
                          <Label 
                            htmlFor={template.id} 
                            className="flex items-center justify-between"
                          >
                            {template.name}
                            <Badge variant="outline">{template.category}</Badge>
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFromTemplate}>
                  Create Workflow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {workflow.description || "No description provided"}
                  </p>
                </div>
                <Badge 
                  variant={workflow.isActive ? "default" : "outline"} 
                  className={workflow.isActive ? "bg-green-500 hover:bg-green-500/90" : ""}
                >
                  {workflow.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground">
                {workflow.updatedAt && (
                  <p>Updated: {format(new Date(workflow.updatedAt), 'MMM d, yyyy')}</p>
                )}
                <p className="mt-1">{workflow.nodes.length} nodes, {workflow.connections.length} connections</p>
              </div>
              
              <div className="flex gap-2 mt-4 justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (workflow.isActive) {
                      deactivateWorkflow(workflow.id);
                    } else {
                      activateWorkflow(workflow.id);
                    }
                  }}
                >
                  {workflow.isActive ? (
                    <><Square className="h-4 w-4 mr-1" /> Deactivate</>
                  ) : (
                    <><Play className="h-4 w-4 mr-1" /> Activate</>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditWorkflow(workflow.id)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this workflow?')) {
                      deleteWorkflow(workflow.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
