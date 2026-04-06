import type { GVPRequest, RequestStatus, TrustId, Department, Announcement, MeditationEntry, ChatMessage, ChatThread } from '../types';

const DB_KEY = 'gvp_master_db_v3';
const ANNOUNCEMENTS_KEY = 'gvp_announcements_db';
const MEDITATION_KEY = 'gvp_meditation_db';
const CHATS_KEY = 'gvp_chats_db';
const MESSAGES_KEY = 'gvp_messages_db';

// --- Master Initialization ---
const INITIAL_REQUESTS: GVPRequest[] = [
    {
        id: 'REQ-GPT-777',
        trustId: 'GPT',
        department: 'Maintenance',
        requesterId: 'GVP-IT-001',
        requesterName: 'Amit Sharma',
        requesterRole: 'Manager',
        requesterDept: 'IT-Dept',
        type: 'Repair',
        title: 'Server Room AC Leakage',
        description: 'Water dripping from the main split AC in the server room. Risk of short circuit.',
        priority: 'Emergency',
        assignedToDept: 'Maintenance',
        assignedToPerson: 'Electrical Head',
        cc: [{ name: 'Siddharth Gautam', role: 'GM' }],
        attachments: [],
        status: 'Seen',
        createdAt: Date.now() - 3600000 * 5,
        updatedAt: Date.now() - 3600000 * 4,
        history: [
            { timestamp: Date.now() - 3600000 * 5, actorId: 'GVP-IT-001', actorName: 'Amit Sharma', action: 'Created' },
            { timestamp: Date.now() - 3600000 * 4, actorId: 'MAIN-001', actorName: 'Maintenance Lead', action: 'Seen' }
        ],
        seenBy: [{ userId: 'MAIN-001', userName: 'Maintenance Lead', timestamp: Date.now() - 3600000 * 4 }],
        chat: [
            { id: 'msg-1', senderId: 'GVP-IT-001', senderName: 'Amit Sharma', senderRole: 'Manager', text: 'Please check this ASAP, servers are at risk.', timestamp: Date.now() - 3600000 * 5, type: 'user' },
            { id: 'msg-2', senderId: 'System', senderName: 'System', senderRole: 'Workflow', text: 'Request status changed to Seen', timestamp: Date.now() - 3600000 * 4, type: 'system' }
        ]
    }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'ANN-001',
        authorId: 'GM-101',
        authorName: 'Siddharth Gautam',
        authorDept: 'Administration',
        title: 'Monthly Staff Meeting',
        content: 'All HODs are requested to attend the monthly review meeting tomorrow at 4 PM in the main office.',
        priority: 'Urgent',
        targetDepts: ['All'],
        createdAt: Date.now() - 24 * 3600000
    }
];

// --- Core DB Logic ---

export const getRequests = (): GVPRequest[] => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_REQUESTS));
        return INITIAL_REQUESTS;
    }
    return JSON.parse(data);
};

export const saveRequests = (requests: GVPRequest[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(requests));
};

export const createRequest = (requestData: any): GVPRequest => {
    const requests = getRequests();
    const newRequest: GVPRequest = {
        requesterRole: 'Staff',
        requesterDept: requestData.department || 'General',
        assignedToDept: 'Admin',
        assignedToPerson: 'Unassigned',
        cc: [],
        attachments: [],
        ...requestData,
        id: `REQ-${requestData.trustId}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Pending Approval',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        seenBy: [],
        history: [{
            timestamp: Date.now(),
            actorId: requestData.requesterId,
            actorName: requestData.requesterName,
            action: 'Created',
            comments: 'Request submitted via Unified Form'
        }],
        chat: [{
            id: `chat-${Date.now()}`,
            senderId: 'System',
            senderName: 'System',
            senderRole: 'Workflow',
            text: `New ${requestData.type} request created by ${requestData.requesterName}`,
            timestamp: Date.now(),
            type: 'system'
        }]
    };
    requests.push(newRequest);
    saveRequests(requests);

    // Auto-post to Chat Group
    const threadId = `dept-${requestData.assignedToDept.toLowerCase().replace(/\s+/g, '-')}`;
    postRequestToChat(threadId, newRequest);

    return newRequest;
};

const postRequestToChat = (threadId: string, request: GVPRequest) => {
    const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: request.requesterId,
        senderName: request.requesterName,
        senderRole: request.requesterRole,
        text: `I've submitted a new ${request.type} request: ${request.title}`,
        timestamp: Date.now(),
        type: 'request',
        requestId: request.id
    };
    sendChatMessage(threadId, message);
};

export const markAsSeen = (requestId: string, userId: string, userName: string) => {
    const requests = getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && !request.seenBy.some(s => s.userId === userId)) {
        request.status = 'Seen';
        request.updatedAt = Date.now();
        request.seenBy.push({ userId, userName, timestamp: Date.now() });
        request.history.push({
            timestamp: Date.now(),
            actorId: userId,
            actorName: userName,
            action: 'Seen',
            comments: `Viewed by ${userName}`
        });
        request.chat.push({
            id: `chat-${Date.now()}`,
            senderId: 'System',
            senderName: 'System',
            senderRole: 'Workflow',
            text: `${userName} has seen the request.`,
            timestamp: Date.now(),
            type: 'system'
        });
        saveRequests(requests);
    }
};

export const updateRequestStatus = (requestId: string, status: RequestStatus, actorId: string, actorName: string, comment?: string) => {
    return updateWorkflowStatus(requestId, status, actorId, actorName, comment);
};

export const updateWorkflowStatus = (requestId: string, newStatus: RequestStatus, actorId: string, actorName: string, comment?: string) => {
    const requests = getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        const req = requests[index];
        req.status = newStatus;
        req.updatedAt = Date.now();
        req.history.push({
            timestamp: Date.now(),
            actorId,
            actorName,
            action: `Status: ${newStatus}`,
            comments: comment
        });
        req.chat.push({
            id: `chat-${Date.now()}`,
            senderId: 'System',
            senderName: 'System',
            senderRole: 'Workflow',
            text: `Status updated to ${newStatus} by ${actorName}. ${comment ? `Comment: ${comment}` : ''}`,
            timestamp: Date.now(),
            type: 'system'
        });
        saveRequests(requests);

        // Notify in Department Chat Group
        const threadId = `dept-${req.assignedToDept.toLowerCase().replace(/\s+/g, '-')}`;
        sendChatMessage(threadId, {
            senderId: 'System',
            senderName: 'System',
            senderRole: 'Workflow',
            text: `Request ${req.id} (${req.title}) updated to ${newStatus} by ${actorName}`,
            timestamp: Date.now(),
            type: 'system'
        });
    }
};

export const addChatMessage = (requestId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const requests = getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request) {
        request.chat.push({
            ...message,
            id: `chat-${Date.now()}`,
            timestamp: Date.now()
        });
        request.updatedAt = Date.now();
        saveRequests(requests);
    }
};

// --- Announcements ---
export const getAnnouncements = (): Announcement[] => {
    const data = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (!data) {
        localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
        return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(data);
};

export const createAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const list = getAnnouncements();
    const newAnn = { ...ann, id: `ANN-${Date.now()}`, createdAt: Date.now() };
    list.unshift(newAnn);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
    return newAnn;
};

// --- Meditation ---
export const getMeditationEntries = (): MeditationEntry[] => {
    const data = localStorage.getItem(MEDITATION_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveMeditationEntry = (entry: Omit<MeditationEntry, 'id' | 'createdAt'>) => {
    const list = getMeditationEntries();
    const newEntry = { ...entry, id: `MED-${Date.now()}`, createdAt: Date.now() };
    list.unshift(newEntry);
    localStorage.setItem(MEDITATION_KEY, JSON.stringify(list));
    return newEntry;
};

// --- Analytics Helpers ---
export const getRequestAnalytics = () => {
    const requests = getRequests();
    return {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending Approval' || r.status === 'Seen').length,
        approved: requests.filter(r => r.status === 'Approved').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
        byDept: requests.reduce((acc, r) => {
            acc[r.assignedToDept] = (acc[r.assignedToDept] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        byPriority: requests.reduce((acc, r) => {
            acc[r.priority] = (acc[r.priority] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    };
};

export const getRequestsByTrust = (trustId: TrustId): GVPRequest[] => {
    return getRequests().filter(r => r.trustId === trustId);
};

export const getRequestsByDepartment = (dept: string | Department): GVPRequest[] => {
    return getRequests().filter(r => r.department === dept || r.assignedToDept === dept);
};

// --- Chat Logic ---

const INITIAL_CHATS: ChatThread[] = [
    // GVP
    { id: 'dept-reception', type: 'department', name: 'GVP-Reception', department: 'Reception', participants: [], unreadCount: 1, isFavourite: true, avatar: 'RC' },
    { id: 'dept-museum', type: 'department', name: 'GVP-Museum', department: 'Museum', participants: [], unreadCount: 0, isFavourite: false, avatar: 'MS' },
    { id: 'dept-pr', type: 'department', name: 'GVP-PR', department: 'PR', participants: [], unreadCount: 0, isFavourite: false, avatar: 'PR' },
    { id: 'dept-maintains', type: 'department', name: 'GVP-Maintains', department: 'Maintains', participants: [], unreadCount: 2, isFavourite: false, avatar: 'MN' },
    { id: 'dept-electrical', type: 'department', name: 'GVP-Electrical', department: 'Electrical', participants: [], unreadCount: 0, isFavourite: false, avatar: 'EL' },
    { id: 'dept-water', type: 'department', name: 'GVP-Water', department: 'Water', participants: [], unreadCount: 0, isFavourite: false, avatar: 'WT' },
    { id: 'dept-civil', type: 'department', name: 'GVP-Civil', department: 'Civil', participants: [], unreadCount: 0, isFavourite: false, avatar: 'CV' },
    { id: 'dept-kitchen', type: 'department', name: 'GVP-Kitchen', department: 'Kitchen', participants: [], unreadCount: 0, isFavourite: false, avatar: 'KT' },
    { id: 'dept-one-day', type: 'department', name: 'GVP-OneDay', department: 'One-Day', participants: [], unreadCount: 0, isFavourite: false, avatar: 'OD' },
    { id: 'dept-garden', type: 'department', name: 'GVP-Garden', department: 'Garden', participants: [], unreadCount: 0, isFavourite: false, avatar: 'GD' },
    { id: 'dept-housekeeping', type: 'department', name: 'GVP-Housekeeping', department: 'Housekeeping', participants: [], unreadCount: 0, isFavourite: false, avatar: 'HK' },
    { id: 'dept-security', type: 'department', name: 'GVP-Security', department: 'Security', participants: [], unreadCount: 0, isFavourite: false, avatar: 'SC' },
    { id: 'dept-accounts', type: 'department', name: 'GVP-Accounts', department: 'Accounts', participants: [], unreadCount: 0, isFavourite: false, avatar: 'AC' },
    { id: 'dept-it', type: 'department', name: 'GVP-IT', department: 'IT', participants: [], unreadCount: 0, isFavourite: true, avatar: 'IT' },
    { id: 'dept-purchase', type: 'department', name: 'GVP-Purchase', department: 'Purchase', participants: [], unreadCount: 0, isFavourite: false, avatar: 'PC' },
    { id: 'dept-store', type: 'department', name: 'GVP-Store', department: 'Store', participants: [], unreadCount: 0, isFavourite: false, avatar: 'ST' },

    // DPVT
    { id: 'dept-dhamma-pattana', type: 'department', name: 'DPVT-Dhamma-Pattana', department: 'Dhamma-Pattana', participants: [], unreadCount: 0, isFavourite: true, avatar: 'DP' },

    // SVCT
    { id: 'dept-food-court', type: 'department', name: 'SVCT-Food Court', department: 'Food-Court', participants: [], unreadCount: 0, isFavourite: false, avatar: 'FC' },
    { id: 'dept-souvenir', type: 'department', name: 'SVCT-Souvenir', department: 'Souvenir', participants: [], unreadCount: 0, isFavourite: false, avatar: 'SV' },
    { id: 'dept-svct-dhammalay', type: 'department', name: 'SVCT-Dhammalay', department: 'Dhammalay', participants: [], unreadCount: 0, isFavourite: false, avatar: 'SD' },

    // VRI
    { id: 'dept-library', type: 'department', name: 'VRI-Library', department: 'Library', participants: [], unreadCount: 0, isFavourite: false, avatar: 'LB' },
    { id: 'dept-academic', type: 'department', name: 'VRI-Academic', department: 'Academic', participants: [], unreadCount: 0, isFavourite: false, avatar: 'AD' },
    { id: 'dept-pariyatti', type: 'department', name: 'VRI-Pariyatti', department: 'Pariyatti', participants: [], unreadCount: 0, isFavourite: false, avatar: 'PY' },
    { id: 'dept-publication', type: 'department', name: 'VRI-Publication', department: 'Publication', participants: [], unreadCount: 0, isFavourite: false, avatar: 'PB' },
    { id: 'dept-archive', type: 'department', name: 'VRI-Archive', department: 'Archive', participants: [], unreadCount: 0, isFavourite: false, avatar: 'AR' },
    { id: 'dept-conservation', type: 'department', name: 'VRI-Conservation', department: 'Conservation', participants: [], unreadCount: 0, isFavourite: false, avatar: 'CS' },
    { id: 'dept-preservation', type: 'department', name: 'VRI-Preservation', department: 'Preservation', participants: [], unreadCount: 0, isFavourite: false, avatar: 'PS' },

    { id: 'direct-gm', type: 'direct', name: 'Siddharth Gautam', participants: [{ userId: 'GM-101', name: 'Siddharth Gautam', role: 'GM' }], unreadCount: 0, isFavourite: false, avatar: 'SG', status: 'online' }
];

export const getChatThreads = (): ChatThread[] => {
    const data = localStorage.getItem(CHATS_KEY);
    if (!data) {
        localStorage.setItem(CHATS_KEY, JSON.stringify(INITIAL_CHATS));
        return INITIAL_CHATS;
    }
    const threads: ChatThread[] = JSON.parse(data);
    // Sync last message
    return threads.map(t => {
        const msgs = getChatMessages(t.id);
        return {
            ...t,
            lastMessage: msgs.length > 0 ? msgs[msgs.length - 1] : undefined
        };
    });
};

export const getChatMessages = (threadId: string): ChatMessage[] => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const allMessages: Record<string, ChatMessage[]> = data ? JSON.parse(data) : {};
    return allMessages[threadId] || [];
};

export const sendChatMessage = (threadId: string, message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string, timestamp?: number }) => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const allMessages: Record<string, ChatMessage[]> = data ? JSON.parse(data) : {};
    if (!allMessages[threadId]) allMessages[threadId] = [];

    const newMessage: ChatMessage = {
        ...message,
        id: message.id || `msg-${Date.now()}-${Math.random()}`,
        timestamp: message.timestamp || Date.now()
    };

    allMessages[threadId].push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));

    // Update thread unread count if not from me? (Assuming current user logic in UI)
    return newMessage;
};

export const markThreadSeen = (threadId: string) => {
    const threads = getChatThreads();
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
        thread.unreadCount = 0;
        localStorage.setItem(CHATS_KEY, JSON.stringify(threads));
    }
};

