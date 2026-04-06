import { useState } from 'react';
import type { Role, GVPRequest, RequestStatus, User as AuthUser } from '../types';
import { Shield, AlertTriangle, Clock, BarChart3, Search, X, ChevronRight } from 'lucide-react';

interface AdminDashboardProps {
    role: Role;
    requests: GVPRequest[];
    user: AuthUser | null;
}

const AdminDashboard = ({ role, requests, user }: AdminDashboardProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending Approval').length,
        approved: requests.filter(r => r.status === 'Approved').length,
        escalated: requests.filter(r => r.status === 'Escalated').length,
    };

    const selectedRequest = requests.find(r => r.id === selectedId);

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            case 'Pending Approval': return 'warning';
            case 'Escalated': return 'error';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-8 fade-in relative">
            {/* Stats Logic */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Requests', value: stats.total, icon: BarChart3, color: 'text-primary' },
                    { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-amber-600' },
                    { label: 'Approved', value: stats.approved, icon: Shield, color: 'text-green-600' },
                    { label: 'Escalations', value: stats.escalated, icon: AlertTriangle, color: 'text-rose-600' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1 text-primary-dark">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color} shadow-inner`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Table Section */}
                <div className={`glass-card overflow-hidden ${selectedId ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-300`}>
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-primary-dark">
                            <Shield size={24} className="text-primary" />
                            Global Operations Registry
                            <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 ml-2">
                                {role.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-[10px] text-text-muted ml-4 font-normal">Active Auditor: {user?.name} ({user?.staffId})</span>
                        </h2>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Request ID / Name..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] uppercase font-bold text-text-muted tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Request ID</th>
                                    <th className="px-6 py-4">Requester</th>
                                    <th className="px-6 py-4">Trust / Dept</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No records found.</td>
                                    </tr>
                                ) : (
                                    requests.map(req => (
                                        <tr
                                            key={req.id}
                                            className={`hover:bg-primary/5 transition-colors cursor-pointer ${selectedId === req.id ? 'bg-primary/5' : ''}`}
                                            onClick={() => setSelectedId(req.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-primary">{req.id}</span>
                                                <p className="text-[10px] text-text-muted">{new Date(req.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold">{req.requesterName}</p>
                                                <p className="text-[10px] text-text-muted truncate max-w-xs">{req.title}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold bg-gray-100 text-primary-dark px-2 py-1 rounded">
                                                    {req.trustId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge badge-${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-primary hover:text-primary-dark transition-colors text-xs font-semibold flex items-center gap-1 justify-end ml-auto">
                                                    View <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Panel */}
                {selectedId && selectedRequest && (
                    <div className="glass-card lg:col-span-1 animate-slide-in-right h-fit sticky top-4">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h3 className="font-bold text-lg text-primary-dark">Request Details</h3>
                            <button onClick={() => setSelectedId(null)} className="text-text-muted hover:text-rose-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 text-left">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-text-muted uppercase mb-1">Description</h4>
                                    <p className="text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedRequest.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-text-muted uppercase mb-1">Priority</h4>
                                        <p className="font-bold text-primary-dark">{selectedRequest.priority}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-text-muted uppercase mb-1">Type</h4>
                                        <p className="font-medium text-primary-dark">{selectedRequest.type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* History / Audit Log */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Audit Trail</h4>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedRequest.history.map((h, i) => (
                                        <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                                            <div className="min-w-[8px] h-[8px] rounded-full bg-primary mt-1.5"></div>
                                            {i !== selectedRequest.history.length - 1 && <div className="absolute left-[3px] top-[14px] bottom-0 w-[2px] bg-gray-100"></div>}
                                            <div>
                                                <p className="text-xs font-bold text-primary-dark">{h.action}</p>
                                                <p className="text-[10px] text-text-muted">{h.actorName} • {new Date(h.timestamp).toLocaleTimeString()}</p>
                                                {h.comments && <p className="text-[10px] mt-1 bg-white p-2 border border-gray-100 rounded-lg italic text-text-main shadow-sm">"{h.comments}"</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
