
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Settings, GitBranch, X } from 'lucide-react';

interface WorkflowNodeData {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  onUpdate: (updates: Partial<WorkflowNodeData>) => void;
  onDelete: () => void;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'trigger':
      return Play;
    case 'action':
      return Settings;
    case 'condition':
      return GitBranch;
    default:
      return Settings;
  }
};

const getNodeColor = (type: string) => {
  switch (type) {
    case 'trigger':
      return 'border-green-500 bg-green-50';
    case 'action':
      return 'border-blue-500 bg-blue-50';
    case 'condition':
      return 'border-yellow-500 bg-yellow-50';
    default:
      return 'border-gray-500 bg-gray-50';
  }
};

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  node,
  onUpdate,
  onDelete
}) => {
  const Icon = getNodeIcon(node.type);
  const colorClass = getNodeColor(node.type);

  return (
    <Card className={`w-48 p-3 cursor-move ${colorClass} relative group`}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium text-sm">{node.title}</span>
      </div>
      
      <p className="text-xs text-gray-600 mb-2">{node.description}</p>
      
      <Button variant="ghost" size="sm" className="w-full text-xs">
        Configure
      </Button>
    </Card>
  );
};
