export type TrustId = 'GPT' | 'SVCT' | 'DPT' | 'VRI';

export const TRUSTS: Record<TrustId, string> = {
  GPT: 'Global Pagoda Trust',
  SVCT: 'Samyak Vaniya Charitable Trust',
  DPT: 'Dhammapatana Vipassana Center Trust',
  VRI: 'Vipassana Research Institute'
};

export type Department =
  // Global Pagoda Trust
  | 'Reception' | 'IT' | 'IT-Dept' | 'Public Relations' | 'PR' | 'Museum' | 'Security'
  | 'Transport' | 'Maintenance' | 'Housekeeping' | 'Account' | 'Relevent' | 'DPVT'
  | 'Electrician' | 'Water Man' | 'Garden' | 'Food Court'
  // SVCT
  | 'Dhammale' | 'Kitchen' | 'Souvenir'
  // Dhammapatana Trust
  | 'Course Operations' | 'Course Accommodation' | 'Course Kitchen' | 'Course Maintenance'
  // VRI Trust
  | 'PALA' | 'Pali' | 'VRI Data Center' | 'VRI PR';

export type Role =
  | 'Super Admin'
  | 'Trustee'
  | 'Department Admin'
  | 'Department User'
  | 'Purchase Manager' // Split logic in code, shared role name or use specific? Spec says "Purchase Manager – Pagoda"
  | 'Store Manager'
  | 'Security User'
  | 'Accounts User'
  | 'Self User';

// Specific Roles for code clarity if needed
export type SpecificRole =
  | 'Purchase Manager - Pagoda'
  | 'Purchase Manager - Souvenir'
  | 'Store Manager - Pagoda'
  | 'Store Manager - Souvenir';

export type RequestStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Quotation Requested'
  | 'Quotations Received'
  | 'Approved'
  | 'Rejected'
  | 'Escalated'
  | 'Purchase Order Created'
  | 'Gate Pass Created'
  | 'Received at Store'
  | 'Issued';

export interface AuditLog {
  timestamp: number;
  actorId: string;
  actorName: string;
  action: string;
  comments?: string;
}

export interface User {
  id: string;
  name: string;
  email: string; // Login ID
  role: Role | SpecificRole;
  trustId: TrustId;
  department?: Department;
}

export interface Quotation {
  id: string;
  vendorName: string;
  amount: number;
  currency: string;
  attachmentUrl?: string; // Mock URL
  isApproved: boolean;
}

export interface PurchaseDetails {
  quotations: Quotation[];
  selectedQuoteId?: string;
  poNumber?: string;
  gateEntryId?: string;
  grnId?: string; // Goods Receipt Note
  issueId?: string; // Handover ID
}

export interface GVPRequest {
  id: string;
  trustId: TrustId; // CRITICAL: Every record must be tagged to a trust
  department: Department;
  requesterId: string;
  requesterName: string;

  type: 'Purchase' | 'Maintenance' | 'Transport' | 'Accommodation' | 'IT Support';

  // Common details
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';

  // Purchase Specifics
  purchaseDetails?: PurchaseDetails; // Optional extension for Purchase flow
  approvalChain?: {
    step: number;
    role: Role;
    status: 'Pending' | 'Approved' | 'Rejected';
    approverId?: string;
    timestamp?: number;
  }[];

  // System Metadata
  status: RequestStatus;
  createdAt: number;
  updatedAt: number;
  history: AuditLog[];

  // Legacy/Compatibility fields (optional/deprecated)
  slaReminderSent?: boolean;
  slaEscalated?: boolean;
}

