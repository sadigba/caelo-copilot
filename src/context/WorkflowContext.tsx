
import React, { createContext, useContext, useState, useEffect } from "react";
import { Workflow, WorkflowNode, NodeConnection, WorkflowTemplate } from "@/types/workflow";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Sample templates
import { loanApprovalTemplate, documentReviewTemplate, missingDocumentTemplate } from "@/data/workflowTemplates";

interface WorkflowContextType {
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  templates: WorkflowTemplate[];
  createWorkflow: (name: string) => Workflow;
  updateWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (workflowId: string) => void;
  getWorkflowById: (id: string | null) => Workflow | null;
  addNode: (workflowId: string, node: WorkflowNode) => void;
  updateNode: (workflowId: string, node: WorkflowNode) => void;
  deleteNode: (workflowId: string, nodeId: string) => void;
  addConnection: (workflowId: string, connection: NodeConnection) => void;
  deleteConnection: (workflowId: string, connectionId: string) => void;
  activateWorkflow: (workflowId: string) => void;
  deactivateWorkflow: (workflowId: string) => void;
  createWorkflowFromTemplate: (templateId: string) => Workflow;
  saveWorkflowAsTemplate: (workflowId: string, name: string, description: string) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    // Initialize with some sample workflows from localStorage or default
    const savedWorkflows = localStorage.getItem('workflows');
    return savedWorkflows ? JSON.parse(savedWorkflows) : [];
  });

  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([
    loanApprovalTemplate,
    documentReviewTemplate,
    missingDocumentTemplate
  ]);

  // Save workflows to localStorage when they change
  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  const createWorkflow = (name: string): Workflow => {
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name,
      description: "",
      nodes: [],
      connections: [],
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkflows((prev) => [...prev, newWorkflow]);
    toast.success(`Workflow "${name}" created`);
    return newWorkflow;
  };

  const updateWorkflow = (workflow: Workflow) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflow.id ? {...workflow, updatedAt: new Date().toISOString()} : w))
    );
    toast.success(`Workflow "${workflow.name}" updated`);
  };

  const deleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
      toast.success(`Workflow "${workflow.name}" deleted`);
    }
  };

  const getWorkflowById = (id: string | null): Workflow | null => {
    if (!id) return null;
    return workflows.find((w) => w.id === id) || null;
  };

  const addNode = (workflowId: string, node: WorkflowNode) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            nodes: [...w.nodes, node],
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      })
    );
  };

  const updateNode = (workflowId: string, node: WorkflowNode) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            nodes: w.nodes.map((n) => (n.id === node.id ? node : n)),
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      })
    );
  };

  const deleteNode = (workflowId: string, nodeId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            nodes: w.nodes.filter((n) => n.id !== nodeId),
            connections: w.connections.filter(
              (c) => c.sourceId !== nodeId && c.targetId !== nodeId
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      })
    );
  };

  const addConnection = (workflowId: string, connection: NodeConnection) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            connections: [...w.connections, connection],
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      })
    );
  };

  const deleteConnection = (workflowId: string, connectionId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            connections: w.connections.filter((c) => c.id !== connectionId),
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      })
    );
  };

  const activateWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          toast.success(`Workflow "${w.name}" activated`);
          return { ...w, isActive: true, updatedAt: new Date().toISOString() };
        }
        return w;
      })
    );
  };

  const deactivateWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          toast.success(`Workflow "${w.name}" deactivated`);
          return { ...w, isActive: false, updatedAt: new Date().toISOString() };
        }
        return w;
      })
    );
  };

  const createWorkflowFromTemplate = (templateId: string): Workflow => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error("Template not found");
    
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name: `${template.name} Copy`,
      description: template.description,
      nodes: template.nodes.map(node => ({...node, id: uuidv4()})),
      connections: template.connections.map(conn => ({...conn, id: uuidv4()})),
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update connections to point to the new node IDs
    const nodeIdMap = new Map();
    template.nodes.forEach((node, index) => {
      nodeIdMap.set(node.id, newWorkflow.nodes[index].id);
    });
    
    newWorkflow.connections = newWorkflow.connections.map(conn => ({
      ...conn,
      sourceId: nodeIdMap.get(conn.sourceId) || conn.sourceId,
      targetId: nodeIdMap.get(conn.targetId) || conn.targetId
    }));
    
    setWorkflows(prev => [...prev, newWorkflow]);
    toast.success(`Workflow created from template: ${template.name}`);
    return newWorkflow;
  };
  
  const saveWorkflowAsTemplate = (workflowId: string, name: string, description: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;
    
    const newTemplate: WorkflowTemplate = {
      id: uuidv4(),
      name,
      description,
      category: "Custom",
      nodes: workflow.nodes,
      connections: workflow.connections,
      createdAt: new Date().toISOString()
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    toast.success(`Template "${name}" created`);
  };

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
        activeWorkflow,
        templates,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        getWorkflowById,
        addNode,
        updateNode,
        deleteNode,
        addConnection,
        deleteConnection,
        activateWorkflow,
        deactivateWorkflow,
        createWorkflowFromTemplate,
        saveWorkflowAsTemplate
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};
