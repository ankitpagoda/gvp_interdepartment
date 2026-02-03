import { useState } from 'react';
import type { Role, GVPRequest, RequestStatus } from '../types';
import { updateRequestStatus } from '../lib/mockDb';
import { Clock, Check, X, MessageSquare, Phone, Info, History as HistoryIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DepartmentDashboardProps {
    role: Role;
    requests: GVPRequest[];
}

const DepartmentDashboard = ({ role, requests }: DepartmentDashboardProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const filteredRequests = requests;
    const selectedRequest = requests.find(r => r.id === selectedId);

    const handleAction = (status: RequestStatus, comment: string) => {
        if (selectedId) {
            updateRequestStatus(selectedId, status, 'current-user-id', role, comment);
            setSelectedId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            case 'Pending Approval': return 'warning';
            default: return 'neutral';
        }
    };

    return (
        <div className="grid md:grid-cols-12 gap-6 fade-in">
            <div className="md:col-span-4 space-y-6">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-1 text-primary-dark">
                        <Clock size={24} className="opacity-80" />
                        Pending Tasks
                    </h2>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredRequests.length === 0 ? (
                            <div className="py-2 text-text-main">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center">
                                        <Info size={24} />
                                    </div>
                                </div>
                                <p className="text-lg font-medium opacity-80">No pending requests</p>
                                <div className="mt-4 opacity-50 transform scale-x-[-1] inline-block">
                                    <HistoryIcon size={64} />
                                </div>
                            </div>
                        ) : (
                            filteredRequests.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => setSelectedId(req.id)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedId === req.id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-transparent hover:border-primary/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{req.id}</span>
                                        <span className={`badge badge-${getStatusColor(req.status)}`}>{req.status}</span>
                                    </div>
                                    <p className="font-bold text-sm truncate">{req.title}</p>
                                    <p className="text-xs text-text-muted truncate">{req.requesterName}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                                            <Clock size={10} />
                                            {formatDistanceToNow(req.createdAt)} ago
                                        </span>
                                        <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                                            {req.type}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="md:col-span-8">
                {selectedRequest ? (
                    <div className="glass-card p-8 space-y-8 fade-in h-fit">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                            <div>
                                <span className="text-xs font-bold text-primary">{selectedRequest.id}</span>
                                <h2 className="text-2xl font-bold">{selectedRequest.title}</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-sm flex items-center gap-1 text-text-muted">
                                        <Phone size={14} />
                                        {selectedRequest.requesterName}
                                    </span>
                                    <span className="text-sm flex items-center gap-1 text-text-muted">
                                        <Clock size={14} />
                                        {new Date(selectedRequest.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className={`badge badge-${getStatusColor(selectedRequest.status)} py-2 px-4 text-sm`}>
                                {selectedRequest.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-primary uppercase text-xs tracking-widest">Request Details</h3>
                                <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm"><span className="text-text-muted font-medium">Type:</span> {selectedRequest.type}</p>
                                    <p className="text-sm"><span className="text-text-muted font-medium">Description:</span> {selectedRequest.description}</p>
                                    <p className="text-sm"><span className="text-text-muted font-medium">Priority:</span> {selectedRequest.priority}</p>
                                    <p className="text-sm"><span className="text-text-muted font-medium">Department:</span> {selectedRequest.department}</p>
                                    <p className="text-sm"><span className="text-text-muted font-medium">Trust:</span> {selectedRequest.trustId}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-primary uppercase text-xs tracking-widest">System History</h3>
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedRequest.history.map((h, i) => (
                                        <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                                            <div className="min-w-[8px] h-[8px] rounded-full bg-primary mt-1.5"></div>
                                            {i !== selectedRequest.history.length - 1 && <div className="absolute left-[3px] top-[14px] bottom-0 w-[2px] bg-gray-100"></div>}
                                            <div>
                                                <p className="text-xs font-bold">{h.action}</p>
                                                <p className="text-[10px] text-text-muted">{h.actorName} • {new Date(h.timestamp).toLocaleTimeString()}</p>
                                                {h.comments && <p className="text-[10px] mt-1 bg-white p-2 rounded-lg border border-gray-100 italic shadow-sm">"{h.comments}"</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-primary-dark">
                                <MessageSquare size={18} />
                                Response Action
                            </h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAction('Approved', 'Approved by department')}
                                    className="flex-1 bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={18} />
                                    Approve Request
                                </button>
                                <button
                                    onClick={() => handleAction('Rejected', 'Rejected by department')}
                                    className="flex-1 bg-rose-600 text-white rounded-xl py-3 font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={18} />
                                    Reject Request
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-text-muted">Actions are logged in the audit trail.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-left">
                        <h3 className="text-3xl font-bold text-text-main mb-4 italic">Select a Task</h3>
                        <p className="text-lg text-text-muted max-w-lg leading-relaxed">Choose a request from the sidebar to view details, timeline, and take necessary actions.</p>
                        <div className="mt-12 opacity-10">
                            <Clock size={200} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentDashboard;
