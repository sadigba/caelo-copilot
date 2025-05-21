
import { Button } from '@/components/ui/button';
import { 
  Trigger, 
  Action, 
  Settings, 
  Workflow
} from 'lucide-react';
import { NodeType } from '@/types/workflow';

interface NodeLibraryProps {
  onAddNode: (type: string, x: number, y: number) => void;
}

export default function NodeLibrary({ onAddNode }: NodeLibraryProps) {
  const nodeTypes = [
    {
      type: 'trigger' as NodeType,
      name: 'Trigger',
      description: 'Start your workflow with an event',
      icon: Trigger,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      type: 'action' as NodeType,
      name: 'Action',
      description: 'Perform a task in your workflow',
      icon: Action,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      type: 'condition' as NodeType,
      name: 'Condition',
      description: 'Add branching logic to your flow',
      icon: Settings,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      type: 'start' as NodeType,
      name: 'Start',
      description: 'Define the starting point',
      icon: Workflow,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      type: 'end' as NodeType,
      name: 'End',
      description: 'Define the ending point',
      icon: Workflow,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Nothing to do here yet
  };

  const handleAddClick = (nodeType: NodeType) => {
    // Add node at default position in the middle-ish of the canvas
    onAddNode(nodeType, 400, 200);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Drag and drop nodes onto the canvas to build your workflow.
      </p>
      
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.type)}
            onDragEnd={handleDragEnd}
            className={`p-3 rounded-md border ${nodeType.borderColor} ${nodeType.bgColor} cursor-grab`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <nodeType.icon className={`h-5 w-5 ${nodeType.color} mr-3`} />
                <div>
                  <div className="font-medium text-sm">{nodeType.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {nodeType.description}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleAddClick(nodeType.type)}
              >
                <span className="sr-only">Add {nodeType.name}</span>
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
