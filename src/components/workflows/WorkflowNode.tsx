
import { useState } from 'react';
import { WorkflowNode as WorkflowNodeType } from '@/types/workflow';
import { Workflow, Trigger, Action, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onConnectStart: () => void;
  onUpdate: (node: WorkflowNodeType) => void;
}

export default function WorkflowNode({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onConnectStart,
  onUpdate,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: node.position.x, y: node.position.y });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    e.stopPropagation();
    onSelect();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
    
    setPosition(newPosition);
    e.stopPropagation();
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onUpdate({
      ...node,
      position: {
        x: position.x,
        y: position.y,
      },
    });
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case 'trigger':
        return <Trigger className="h-5 w-5 text-blue-600" />;
      case 'action':
        return <Action className="h-5 w-5 text-green-600" />;
      case 'condition':
        return <Settings className="h-5 w-5 text-amber-600" />;
      case 'start':
        return <Workflow className="h-5 w-5 text-indigo-600" />;
      case 'end':
        return <Workflow className="h-5 w-5 text-red-600" />;
      default:
        return <Workflow className="h-5 w-5" />;
    }
  };

  const getBorderColor = () => {
    switch (node.type) {
      case 'trigger':
        return 'border-blue-400';
      case 'action':
        return 'border-green-400';
      case 'condition':
        return 'border-amber-400';
      case 'start':
        return 'border-indigo-400';
      case 'end':
        return 'border-red-400';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <div
      className={cn(
        'absolute shadow-md rounded-md bg-white border-2',
        getBorderColor(),
        isSelected && 'ring-2 ring-offset-2',
        isConnecting && 'outline-dashed outline-2 outline-offset-4 outline-blue-400',
        isDragging && 'cursor-grabbing opacity-70'
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '160px',
        zIndex: isSelected || isDragging ? 10 : 1,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            {getNodeIcon()}
            <span className="ml-2 font-medium text-sm">{node.name}</span>
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <button
            className="h-4 w-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onConnectStart();
            }}
          >
            <span className="sr-only">Connect from this node</span>
            <span className="text-xs">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
