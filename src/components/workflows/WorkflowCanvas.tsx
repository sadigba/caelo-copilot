
import { useState, useEffect } from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Workflow, WorkflowNode, NodeConnection } from '@/types/workflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import WorkflowNode from './WorkflowNode';
import WorkflowConnection from './WorkflowConnection';
import NodeLibrary from './NodeLibrary';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { Save, Play, Square, Plus, Undo } from 'lucide-react';

interface WorkflowCanvasProps {
  workflowId: string | null;
}

export default function WorkflowCanvas({ workflowId }: WorkflowCanvasProps) {
  const { 
    getWorkflowById, 
    createWorkflow, 
    updateWorkflow, 
    activateWorkflow,
    deactivateWorkflow
  } = useWorkflow();
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (workflowId) {
      const loadedWorkflow = getWorkflowById(workflowId);
      
      if (loadedWorkflow) {
        setWorkflow(loadedWorkflow);
        setName(loadedWorkflow.name);
        setDescription(loadedWorkflow.description);
      } else {
        // Create a new workflow if ID was provided but not found
        const newWorkflow = createWorkflow('New Workflow');
        setWorkflow(newWorkflow);
        setName(newWorkflow.name);
        setDescription(newWorkflow.description);
      }
    } else {
      // Create new workflow if no ID provided
      const newWorkflow = createWorkflow('New Workflow');
      setWorkflow(newWorkflow);
      setName(newWorkflow.name);
      setDescription(newWorkflow.description);
    }
  }, [workflowId, getWorkflowById, createWorkflow]);

  if (!workflow) {
    return <div className="p-8 text-center">Loading workflow...</div>;
  }

  const handleSave = () => {
    if (workflow) {
      const updatedWorkflow = {
        ...workflow,
        name,
        description,
      };
      updateWorkflow(updatedWorkflow);
      toast.success("Workflow saved successfully");
    }
  };

  const handleToggleActive = () => {
    if (workflow.isActive) {
      deactivateWorkflow(workflow.id);
    } else {
      activateWorkflow(workflow.id);
    }
    setWorkflow({ ...workflow, isActive: !workflow.isActive });
  };

  const handleAddNode = (nodeType: string, x: number, y: number) => {
    if (!workflow) return;

    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: nodeType as any,
      name: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
      position: { x, y },
      config: {}
    };

    const updatedWorkflow = {
      ...workflow,
      nodes: [...workflow.nodes, newNode]
    };

    setWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
  };

  const handleNodeConnect = (targetId: string) => {
    if (!connectingFrom || connectingFrom === targetId || !workflow) return;

    const newConnection: NodeConnection = {
      id: uuidv4(),
      sourceId: connectingFrom,
      targetId
    };

    const updatedWorkflow = {
      ...workflow,
      connections: [...workflow.connections, newConnection]
    };

    setWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
    setConnectingFrom(null);
  };

  const handleNodeSelect = (nodeId: string) => {
    if (connectingFrom) {
      handleNodeConnect(nodeId);
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  const handleUpdateNode = (node: WorkflowNode) => {
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      nodes: workflow.nodes.map(n => n.id === node.id ? node : n)
    };

    setWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      nodes: workflow.nodes.filter(n => n.id !== nodeId),
      connections: workflow.connections.filter(
        c => c.sourceId !== nodeId && c.targetId !== nodeId
      )
    };

    setWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
    setSelectedNode(null);
  };

  const handleDeleteConnection = (connectionId: string) => {
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      connections: workflow.connections.filter(c => c.id !== connectionId)
    };

    setWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            placeholder="Workflow Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-bold mb-2"
          />
          <Textarea
            placeholder="Workflow Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none h-20"
          />
        </div>
        <div className="flex gap-2 items-start">
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button 
            onClick={handleToggleActive}
            variant={workflow.isActive ? "destructive" : "default"}
            size="sm"
          >
            {workflow.isActive ? (
              <><Square className="mr-2 h-4 w-4" /> Deactivate</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Activate</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="library">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="library">Library</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                </TabsList>
                <TabsContent value="library" className="mt-4">
                  <NodeLibrary onAddNode={handleAddNode} />
                </TabsContent>
                <TabsContent value="properties" className="mt-4">
                  {selectedNode && (
                    <div>
                      <h3 className="font-medium mb-2">Node Properties</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure the properties for the selected node.
                      </p>
                      
                      {workflow.nodes.find(n => n.id === selectedNode) && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Name</label>
                            <Input 
                              value={workflow.nodes.find(n => n.id === selectedNode)?.name || ''}
                              onChange={(e) => {
                                const node = workflow.nodes.find(n => n.id === selectedNode);
                                if (node) {
                                  handleUpdateNode({...node, name: e.target.value});
                                }
                              }}
                              className="mt-1"
                            />
                          </div>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => selectedNode && handleDeleteNode(selectedNode)}
                          >
                            Delete Node
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {!selectedNode && (
                    <div className="text-center py-4 text-muted-foreground">
                      Select a node to edit its properties
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="relative overflow-hidden">
            <CardContent className="p-0 h-[600px] overflow-auto bg-slate-50 relative">
              <div
                className="absolute inset-0"
                style={{
                  transform: `scale(${scale}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
                  transformOrigin: '0 0',
                  width: '3000px',
                  height: '2000px',
                  backgroundSize: '20px 20px',
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
                }}
              >
                {workflow.nodes.map((node) => (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    isSelected={selectedNode === node.id}
                    isConnecting={connectingFrom === node.id}
                    onSelect={() => handleNodeSelect(node.id)}
                    onConnectStart={() => setConnectingFrom(node.id)}
                    onUpdate={handleUpdateNode}
                  />
                ))}

                {workflow.connections.map((connection) => {
                  const sourceNode = workflow.nodes.find(
                    (n) => n.id === connection.sourceId
                  );
                  const targetNode = workflow.nodes.find(
                    (n) => n.id === connection.targetId
                  );
                  
                  if (!sourceNode || !targetNode) return null;

                  return (
                    <WorkflowConnection
                      key={connection.id}
                      connection={connection}
                      sourceNode={sourceNode}
                      targetNode={targetNode}
                      onDelete={() => handleDeleteConnection(connection.id)}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
