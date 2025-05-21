
export type NodeType = 
  | 'trigger' 
  | 'action' 
  | 'condition' 
  | 'start' 
  | 'end';

export type NodeStatus = 
  | 'idle' 
  | 'running' 
  | 'completed' 
  | 'error';

export interface WorkflowNodeConfig {
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: {
    x: number;
    y: number;
  };
  config: WorkflowNodeConfig;
  status?: NodeStatus;
}

export interface NodeConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  createdAt: string;
}

export interface TriggerDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  configFields: ConfigField[];
}

export interface ActionDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  configFields: ConfigField[];
}

export interface ConditionDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  configFields: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date';
  options?: {label: string; value: string}[];
  required: boolean;
  default?: any;
}
