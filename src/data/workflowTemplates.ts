
import { WorkflowTemplate } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";

// Helper to create node IDs that are stable within each template
const createNodeId = (prefix: string) => `${prefix}-${uuidv4().substring(0, 8)}`;

// Loan Approval Workflow Template
const loanApprovalStartId = createNodeId('start');
const loanApprovalTrigger1Id = createNodeId('trigger');
const loanApprovalCondition1Id = createNodeId('condition');
const loanApprovalAction1Id = createNodeId('action');
const loanApprovalAction2Id = createNodeId('action');
const loanApprovalEndId = createNodeId('end');

export const loanApprovalTemplate: WorkflowTemplate = {
  id: "template-loan-approval",
  name: "Loan Approval Process",
  description: "Standard workflow for loan approval with document checks and notifications",
  category: "Credit Processing",
  nodes: [
    {
      id: loanApprovalStartId,
      type: "start",
      name: "Start",
      position: { x: 100, y: 100 },
      config: {}
    },
    {
      id: loanApprovalTrigger1Id,
      type: "trigger",
      name: "New Loan Application",
      position: { x: 100, y: 200 },
      config: {
        eventType: "new_loan_application"
      }
    },
    {
      id: loanApprovalCondition1Id,
      type: "condition",
      name: "All Documents Provided?",
      position: { x: 100, y: 300 },
      config: {
        condition: "{documents_count} >= 3"
      }
    },
    {
      id: loanApprovalAction1Id,
      type: "action",
      name: "Send to Approval",
      position: { x: 250, y: 400 },
      config: {
        actionType: "change_status",
        status: "pending_approval"
      }
    },
    {
      id: loanApprovalAction2Id,
      type: "action",
      name: "Request Missing Documents",
      position: { x: 0, y: 400 },
      config: {
        actionType: "send_notification",
        notificationType: "email",
        template: "missing_documents"
      }
    },
    {
      id: loanApprovalEndId,
      type: "end",
      name: "End",
      position: { x: 100, y: 500 },
      config: {}
    }
  ],
  connections: [
    {
      id: uuidv4(),
      sourceId: loanApprovalStartId,
      targetId: loanApprovalTrigger1Id
    },
    {
      id: uuidv4(),
      sourceId: loanApprovalTrigger1Id,
      targetId: loanApprovalCondition1Id
    },
    {
      id: uuidv4(),
      sourceId: loanApprovalCondition1Id,
      targetId: loanApprovalAction1Id,
      label: "Yes"
    },
    {
      id: uuidv4(),
      sourceId: loanApprovalCondition1Id,
      targetId: loanApprovalAction2Id,
      label: "No"
    },
    {
      id: uuidv4(),
      sourceId: loanApprovalAction1Id,
      targetId: loanApprovalEndId
    },
    {
      id: uuidv4(),
      sourceId: loanApprovalAction2Id,
      targetId: loanApprovalEndId
    }
  ],
  createdAt: new Date().toISOString()
};

// Document Review Workflow Template
const docReviewStartId = createNodeId('start');
const docReviewTrigger1Id = createNodeId('trigger');
const docReviewCondition1Id = createNodeId('condition');
const docReviewAction1Id = createNodeId('action');
const docReviewAction2Id = createNodeId('action');
const docReviewEndId = createNodeId('end');

export const documentReviewTemplate: WorkflowTemplate = {
  id: "template-document-review",
  name: "Document Review Process",
  description: "Automated workflow for document validation and review",
  category: "Document Management",
  nodes: [
    {
      id: docReviewStartId,
      type: "start",
      name: "Start",
      position: { x: 100, y: 100 },
      config: {}
    },
    {
      id: docReviewTrigger1Id,
      type: "trigger",
      name: "Document Uploaded",
      position: { x: 100, y: 200 },
      config: {
        eventType: "document_uploaded"
      }
    },
    {
      id: docReviewCondition1Id,
      type: "condition",
      name: "Valid Document?",
      position: { x: 100, y: 300 },
      config: {
        condition: "{document_validation} == true"
      }
    },
    {
      id: docReviewAction1Id,
      type: "action",
      name: "Mark as Verified",
      position: { x: 250, y: 400 },
      config: {
        actionType: "update_document",
        status: "verified"
      }
    },
    {
      id: docReviewAction2Id,
      type: "action",
      name: "Request Replacement",
      position: { x: 0, y: 400 },
      config: {
        actionType: "send_notification",
        notificationType: "email",
        template: "document_rejected"
      }
    },
    {
      id: docReviewEndId,
      type: "end",
      name: "End",
      position: { x: 100, y: 500 },
      config: {}
    }
  ],
  connections: [
    {
      id: uuidv4(),
      sourceId: docReviewStartId,
      targetId: docReviewTrigger1Id
    },
    {
      id: uuidv4(),
      sourceId: docReviewTrigger1Id,
      targetId: docReviewCondition1Id
    },
    {
      id: uuidv4(),
      sourceId: docReviewCondition1Id,
      targetId: docReviewAction1Id,
      label: "Yes"
    },
    {
      id: uuidv4(),
      sourceId: docReviewCondition1Id,
      targetId: docReviewAction2Id,
      label: "No"
    },
    {
      id: uuidv4(),
      sourceId: docReviewAction1Id,
      targetId: docReviewEndId
    },
    {
      id: uuidv4(),
      sourceId: docReviewAction2Id,
      targetId: docReviewEndId
    }
  ],
  createdAt: new Date().toISOString()
};

// Missing Document Notification Workflow
const missingDocStartId = createNodeId('start');
const missingDocTrigger1Id = createNodeId('trigger');
const missingDocAction1Id = createNodeId('action');
const missingDocCondition1Id = createNodeId('condition');
const missingDocAction2Id = createNodeId('action');
const missingDocEndId = createNodeId('end');

export const missingDocumentTemplate: WorkflowTemplate = {
  id: "template-missing-document",
  name: "Missing Document Follow-up",
  description: "Automated reminders for missing documentation",
  category: "Notifications",
  nodes: [
    {
      id: missingDocStartId,
      type: "start",
      name: "Start",
      position: { x: 100, y: 100 },
      config: {}
    },
    {
      id: missingDocTrigger1Id,
      type: "trigger",
      name: "Daily Check",
      position: { x: 100, y: 200 },
      config: {
        eventType: "scheduled",
        schedule: "daily"
      }
    },
    {
      id: missingDocCondition1Id,
      type: "condition",
      name: "Documents Missing?",
      position: { x: 100, y: 300 },
      config: {
        condition: "{missing_documents_count} > 0"
      }
    },
    {
      id: missingDocAction1Id,
      type: "action",
      name: "Send Reminder",
      position: { x: 250, y: 400 },
      config: {
        actionType: "send_notification",
        notificationType: "email",
        template: "document_reminder"
      }
    },
    {
      id: missingDocAction2Id,
      type: "action",
      name: "Update Last Reminded Date",
      position: { x: 250, y: 500 },
      config: {
        actionType: "update_loan",
        field: "last_document_reminder",
        value: "{current_date}"
      }
    },
    {
      id: missingDocEndId,
      type: "end",
      name: "End",
      position: { x: 100, y: 600 },
      config: {}
    }
  ],
  connections: [
    {
      id: uuidv4(),
      sourceId: missingDocStartId,
      targetId: missingDocTrigger1Id
    },
    {
      id: uuidv4(),
      sourceId: missingDocTrigger1Id,
      targetId: missingDocCondition1Id
    },
    {
      id: uuidv4(),
      sourceId: missingDocCondition1Id,
      targetId: missingDocAction1Id,
      label: "Yes"
    },
    {
      id: uuidv4(),
      sourceId: missingDocCondition1Id,
      targetId: missingDocEndId,
      label: "No"
    },
    {
      id: uuidv4(),
      sourceId: missingDocAction1Id,
      targetId: missingDocAction2Id
    },
    {
      id: uuidv4(),
      sourceId: missingDocAction2Id,
      targetId: missingDocEndId
    }
  ],
  createdAt: new Date().toISOString()
};
