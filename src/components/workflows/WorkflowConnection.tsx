
import { NodeConnection, WorkflowNode } from '@/types/workflow';
import { X } from 'lucide-react';

interface WorkflowConnectionProps {
  connection: NodeConnection;
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
  onDelete: () => void;
}

export default function WorkflowConnection({
  connection,
  sourceNode,
  targetNode,
  onDelete,
}: WorkflowConnectionProps) {
  // Calculate source and target center positions
  const sourcePosition = {
    x: sourceNode.position.x + 80, // Half of node width (160px)
    y: sourceNode.position.y + 25, // Approximate center of node height
  };

  const targetPosition = {
    x: targetNode.position.x + 80,
    y: targetNode.position.y + 25,
  };

  // Calculate the midpoint for the connection label
  const midPoint = {
    x: (sourcePosition.x + targetPosition.x) / 2,
    y: (sourcePosition.y + targetPosition.y) / 2,
  };

  // Create a simple straight line SVG path
  const path = `M${sourcePosition.x},${sourcePosition.y} L${targetPosition.x},${targetPosition.y}`;

  // Create an arrow marker for the end of the path
  const markerId = `arrow-${connection.id}`;

  return (
    <>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d={path}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-500"
          markerEnd={`url(#${markerId})`}
        />
      </svg>

      {/* Connection label (if any) */}
      {connection.label && (
        <div
          style={{
            position: 'absolute',
            left: `${midPoint.x}px`,
            top: `${midPoint.y}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #e2e8f0',
            zIndex: 5,
            pointerEvents: 'auto',
          }}
          className="shadow-sm"
        >
          {connection.label}
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={onDelete}
        style={{
          position: 'absolute',
          left: `${midPoint.x}px`,
          top: `${midPoint.y - 20}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          pointerEvents: 'auto',
        }}
        className="h-6 w-6 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-300"
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Delete connection</span>
      </button>
    </>
  );
}
