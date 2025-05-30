
import React from 'react';
import { Card } from "@/components/ui/card";
import { Play, Settings, GitBranch, FileText, Bell, CheckCircle } from 'lucide-react';

interface NodeTemplate {
  type: 'trigger' | 'action' | 'condition';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  defaultConfig: Record<string, any>;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    title: 'Document Upload',
    description: 'Triggers when a document is uploaded',
    icon: FileText,
    defaultConfig: { documentType: 'any' }
  },
  {
    type: 'trigger',
    title: 'Loan Status Change',
    description: 'Triggers when loan status changes',
    icon: Play,
    defaultConfig: { status: 'any' }
  },
  {
    type: 'action',
    title: 'Send Notification',
    description: 'Sends an email or in-app notification',
    icon: Bell,
    defaultConfig: { type: 'email', recipients: [] }
  },
  {
    type: 'action',
    title: 'Update Status',
    description: 'Updates the loan application status',
    icon: CheckCircle,
    defaultConfig: { status: 'pending' }
  },
  {
    type: 'condition',
    title: 'Check Document Type',
    description: 'Branches based on document type',
    icon: GitBranch,
    defaultConfig: { documentType: '', operator: 'equals' }
  }
];

interface NodeLibraryProps {
  onNodeSelect: (template: NodeTemplate) => void;
}

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ onNodeSelect }) => {
  return (
    <Card className="w-64 p-4">
      <h3 className="font-medium mb-4">Node Library</h3>
      <div className="space-y-2">
        {nodeTemplates.map((template, index) => (
          <div
            key={index}
            className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onNodeSelect(template)}
          >
            <div className="flex items-center gap-2 mb-1">
              <template.icon className="h-4 w-4" />
              <span className="font-medium text-sm">{template.title}</span>
            </div>
            <p className="text-xs text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
