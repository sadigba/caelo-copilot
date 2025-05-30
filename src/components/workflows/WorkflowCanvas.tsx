
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkflowNode as WorkflowNodeComponent } from './WorkflowNode';

interface WorkflowNodeData {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowCanvasProps {
  nodes: WorkflowNodeData[];
  onNodeAdd: (node: WorkflowNodeData) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNodeData>) => void;
  onNodeDelete: (nodeId: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  onNodeAdd,
  onNodeUpdate,
  onNodeDelete
}) => {
  return (
    <Card className="flex-1 p-6 bg-gray-50 min-h-[600px] relative">
      <div className="text-center text-gray-500 mb-4">
        <h3 className="text-lg font-medium mb-2">Workflow Canvas</h3>
        <p className="text-sm">Drag and drop nodes from the library to build your workflow</p>
      </div>
      
      <div className="relative h-full">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.position.x,
              top: node.position.y
            }}
          >
            <WorkflowNodeComponent
              node={node}
              onUpdate={(updates) => onNodeUpdate(node.id, updates)}
              onDelete={() => onNodeDelete(node.id)}
            />
          </div>
        ))}
        
        {nodes.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 mb-4">No workflow nodes yet</p>
              <Button variant="outline">
                Start by dragging a trigger from the library
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
