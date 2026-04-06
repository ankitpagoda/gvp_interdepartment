export type TrustId = 'GVP' | 'DPVT' | 'SVCT' | 'VRI' | 'GPT' | 'DPT';

export const TRUSTS: Record<TrustId, string> = {
  GVP: 'Global Vipassana Pagoda',
  DPVT: 'Dhammapatana Vipassana Trust',
  SVCT: 'Samyak Vaniya Charitable Trust',
  VRI: 'Vipassana Research Institute',
  GPT: 'Global Pagoda Trust',
  DPT: 'Dhammapatana Center Trust'
};

export type Activity =
  | 'Received Request'
  | 'Schedule Dashboard'
  | 'Staff Status'
  | 'Room Dashboard'
  | 'Meditator Dashboard'
  | 'Store Dashboard'
  | 'Housekeeping Maintenance Dashboard'
  | 'Task Status'
  | 'Meditation Done'
  | 'Meditator Request'
  | 'DPVT Bills'
  | 'Purchase Order'
  | 'Feedback'
  | 'Survey'
  | 'Announcements'
  | 'CCTV'
  | 'Policies'
  | 'Food Menu Dashboard'
  | 'Food-Court Bills'
  | 'Souvenir Items Dashboard'
  | 'Souvenir Bills'
  | 'Guest/DS Dashboard'
  | 'Dhammalay Bills'
  | 'Books Dashboard'
  | 'Library Bills'
  | 'Course Dashboard'
  | 'Academic Bills'
  | 'Pariyatti Bills'
  | 'Publication Bills'
  | 'Archive Bills'
  | 'Conservation Bills'
  | 'Preservation Bills'
  | 'Reception Bills'
  | 'Museum Bills'
  | 'PR Bills'
  | 'Electrical Bills'
  | 'Water Bills'
  | 'Civil Bills'
  | 'Kitchen Bills'
  | 'Housekeeping Bills'
  | 'Security Bills'
  | 'Accounts Bills'
  | 'IT Bills'
  | 'Purchase Bills'
  | 'Store Bills'
  | 'Received Bills'
  | 'Dashboard'
  | 'Staff Resume'
  | 'Pay-slip'
  | 'Requests'
  | 'Issue'
  | 'Movement'
  | 'Voucher'
  | 'Reception Request'
  | 'Swipe Request'
  | 'Bill Sub'
  | 'Maintains'
  | 'In-Progress'
  | 'Food-Court Request'
  | 'Housekeeping Request'
  | 'Souvenir Request'
  | 'Suggestion';

export type Department =
  // GVP
  | 'Reception' | 'Museum' | 'PR' | 'Maintains' | 'Electrical' | 'Water' | 'Civil'
  | 'Kitchen' | 'One-Day' | 'Garden' | 'Housekeeping' | 'Security' | 'Accounts'
  | 'IT' | 'Purchase' | 'Store'
  // DPVT
  | 'Dhamma-Pattana'
  // SVCT
  | 'Food-Court' | 'Souvenir' | 'Dhammalay'
  // VRI
  | 'Library' | 'Academic' | 'Pariyatti' | 'Publication' | 'Archive' | 'Conservation' | 'Preservation'
  // Legacy/Special
  | 'Transport' | 'Accommodation' | 'Sevak' | 'Admin' | 'IT-Dept' | 'IT Support' | 'Plumbing';

export type Role =
  | 'Super Admin'
  | 'Trustee'
  | 'Department Admin'
  | 'Department User'
  | 'Purchase Manager' // Split logic in code, shared role name or use specific? Spec says "Purchase Manager – Pagoda"
  | 'Store Manager'
  | 'Security User'
  | 'Accounts User'
  | 'Self User'
  | 'Sevak'
  | 'Staff'
  | 'Manager'
  | 'Admin';

// Specific Roles for code clarity if needed
export type SpecificRole =
  | 'Purchase Manager - Pagoda'
  | 'Purchase Manager - Souvenir'
  | 'Store Manager - Pagoda'
  | 'Store Manager - Souvenir';

export type RequestStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Seen'
  | 'Approved'
  | 'Rejected'
  | 'On Hold'
  | 'Forwarded to Trustee'
  | 'Completed'
  | 'Quotation Requested'
  | 'Quotations Received'
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
  staffId: string;
  name: string;
  email: string; // Login ID
  role: Role | SpecificRole | string;
  trustId: TrustId;
  department?: Department | string;
  phone?: string;
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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: number;
  type: 'system' | 'user' | 'request';
  requestId?: string;
  attachment?: {
    type: 'image' | 'document' | 'voice' | 'video' | 'audio',
    name: string,
    url?: string,
    duration?: number
  };
}

export interface ChatThread {
  id: string;
  type: 'direct' | 'group' | 'department';
  name: string;
  avatar?: string;
  department?: string;
  participants: { userId: string; name: string; role: string; department?: string }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isFavourite: boolean;
  status?: 'online' | 'offline';
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorDept: string;
  title: string;
  content: string;
  priority: 'Normal' | 'Urgent';
  targetDepts: string[]; // ['All'] or specific ones
  createdAt: number;
  expiresAt?: number;
}

export interface MeditationEntry {
  id: string;
  userId: string;
  userName: string;
  userDept: string;
  date: string;
  sessions: {
    type: 'Morning' | 'Afternoon' | 'Evening';
    durationMinutes: number;
    attended: boolean;
  }[];
  createdAt: number;
}

export interface GVPRequest {
  id: string;
  trustId: TrustId;
  department: Department | string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requesterDept: string;

  type: 'Task' | 'Purchase' | 'Maintenance' | 'Transport' | 'Accommodation' | 'IT Support' | 'Course' | 'Repair' | 'Material' | 'Vehicle' | 'Leave' | string;

  assignedToDept: string;
  assignedToPerson: string;
  cc: { name: string; role: string; id?: string }[];

  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';

  attachments: { type: 'image' | 'audio' | 'video' | 'document', name: string, url?: string }[];

  // Purchase Specifics
  purchaseDetails?: PurchaseDetails;

  // Workflow
  status: RequestStatus;
  createdAt: number;
  updatedAt: number;
  history: AuditLog[];
  seenBy: { userId: string; userName: string; timestamp: number }[];

  // Contextual Chat
  chat: ChatMessage[];

  // SLA tracking
  slaReminderSent?: boolean;
  slaEscalated?: boolean;
}

