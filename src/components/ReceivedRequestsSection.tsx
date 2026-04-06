import { useState, useEffect } from 'react';
import type { User as AuthUser, GVPRequest, RequestStatus } from '../types.ts';
import ReceivedRequestCard from './ReceivedRequestCard';
import { Image as ImageIcon } from 'lucide-react';
import { getRequests, updateWorkflowStatus } from '../lib/mockDb';

const ReceivedRequestsSection = ({ department, user }: { department?: string, user: AuthUser | null }) => {
    const [requests, setRequests] = useState<GVPRequest[]>([]);

    useEffect(() => {
        const fetchRequests = () => {
            const allDbRequests = getRequests();

            // Filter by department if provided (Recipients view)
            // A request is visible if assigned to dept OR if user is in CC
            const filtered = allDbRequests.filter(req =>
                req.assignedToDept === department ||
                req.cc?.some(c => c.name === user?.name)
            );

            setRequests(filtered);
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 2000);
        return () => clearInterval(interval);
    }, [department, user]);

    const handleStatusChange = (requestId: string, newState: RequestStatus, commentText?: string) => {
        updateWorkflowStatus(
            requestId,
            newState,
            user?.staffId || 'SYS',
            user?.name || 'System',
            commentText || `Status changed to ${newState}`
        );
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Received Requests</h1>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Action incoming requests for {user?.department || department || 'GVP System'}
                        </p>
                    </div>
                </div>

                {requests.length > 0 ? (
                    <div className="fade-in">
                        {requests.map((req) => (
                            <ReceivedRequestCard
                                key={req.id}
                                request={req}
                                user={user}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '5rem 3rem', textAlign: 'center', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#94a3b8' }}>
                            <ImageIcon size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569' }}>No Requests Found</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '300px', margin: '0.5rem auto 0' }}>
                            There are no incoming requests for the {user?.department || department} department at this time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceivedRequestsSection;
