import type { GVPRequest, RequestStatus, TrustId, Department } from '../types';

const DB_KEY = 'gvp_operations_db_v2';

// Helper to simulate a "Wait" for async realism

const INITIAL_DATA: GVPRequest[] = [
    {
        id: 'REQ-GPT-1001',
        trustId: 'GPT',
        department: 'Reception',
        requesterId: 'user-001',
        requesterName: 'Reception Desk',
        type: 'Purchase',
        title: 'Printer Paper Re-stock',
        description: 'Need 10 bundles of A4 paper for daily passes.',
        priority: 'Medium',
        status: 'Pending Approval',
        createdAt: Date.now() - 100000,
        updatedAt: Date.now(),
        history: [
            {
                timestamp: Date.now() - 100000,
                actorId: 'user-001',
                actorName: 'Reception Desk',
                action: 'Created',
                comments: 'Initial request'
            }
        ]
    },
    {
        id: 'REQ-SVCT-2001',
        trustId: 'SVCT',
        department: 'Souvenir',
        requesterId: 'user-005',
        requesterName: 'Souvenir Manager',
        type: 'Purchase',
        title: 'New Stock: Pagoda Miniatures',
        description: 'Order for 500 units of bronze miniatures.',
        priority: 'High',
        status: 'Quotation Requested',
        createdAt: Date.now() - 200000,
        updatedAt: Date.now(),
        history: [
            {
                timestamp: Date.now() - 200000,
                actorId: 'user-005',
                actorName: 'Souvenir Manager',
                action: 'Created'
            }
        ]
    }
];

export const getRequests = (): GVPRequest[] => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
    return JSON.parse(data);
};

export const saveRequests = (requests: GVPRequest[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(requests));
};

export const getRequestsByTrust = (trustId: TrustId): GVPRequest[] => {
    return getRequests().filter(r => r.trustId === trustId);
};

export const getRequestsByDepartment = (dept: Department): GVPRequest[] => {
    return getRequests().filter(r => r.department === dept);
};

export const createRequest = (
    request: Omit<GVPRequest, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>
): GVPRequest => {
    const requests = getRequests();
    const newRequest: GVPRequest = {
        ...request,
        id: `REQ-${request.trustId}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        history: [{
            timestamp: Date.now(),
            actorId: request.requesterId,
            actorName: request.requesterName,
            action: 'Created',
            comments: 'Request initialized'
        }]
    };

    requests.push(newRequest);
    saveRequests(requests);
    return newRequest;
};

export const updateRequestStatus = (
    id: string,
    status: RequestStatus,
    actorId: string,
    actorName: string,
    comment: string
) => {
    const requests = getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index].status = status;
        requests[index].updatedAt = Date.now();
        requests[index].history.push({
            timestamp: Date.now(),
            actorId,
            actorName,
            action: `Status Change: ${status}`,
            comments: comment
        });
        saveRequests(requests);
    }
};

