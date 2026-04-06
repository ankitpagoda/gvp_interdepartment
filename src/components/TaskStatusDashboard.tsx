import { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    PauseCircle,
    Forward,
    Flag,
    ChevronDown,
    ChevronUp,
    Paperclip,
    MessageSquare,
    Search,
    Calendar,
    User,
    Info,
    History
} from 'lucide-react';
import type { GVPRequest, User as AuthUser, RequestStatus } from '../types';
import { getRequests } from '../lib/mockDb';

const TaskStatusDashboard = ({ user }: { user: AuthUser | null }) => {
    const [requests, setRequests] = useState<GVPRequest[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [showOnlyCreated, setShowOnlyCreated] = useState(true);

    useEffect(() => {
        setRequests(getRequests());
    }, []);

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'Seen': return '#3b82f6'; // blue
            case 'Approved': return '#22c55e'; // green
            case 'Rejected': return '#ef4444'; // red
            case 'On Hold': return '#f97316'; // orange
            case 'Forwarded to Trustee': return '#a855f7'; // purple
            case 'Completed': return '#6366f1'; // indigo
            default: return '#94a3b8';
        }
    };

    const getStatusIcon = (status: RequestStatus) => {
        switch (status) {
            case 'Seen': return <Eye size={16} />;
            case 'Approved': return <CheckCircle2 size={16} />;
            case 'Rejected': return <XCircle size={16} />;
            case 'On Hold': return <PauseCircle size={16} />;
            case 'Forwarded to Trustee': return <Forward size={16} />;
            case 'Completed': return <Flag size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.requesterName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = activeFilter === 'All' || req.type === activeFilter;

        const isCreator = req.requesterId === user?.staffId || req.requesterId === user?.id;
        const isInCC = req.cc?.some(c => c.name === user?.name) || false;

        if (showOnlyCreated) return matchesSearch && matchesType && isCreator;
        return matchesSearch && matchesType && (isCreator || isInCC);
    });

    return (
        <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '100%' }}>
            {/* Top Bar */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>My Task Dashboard</h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Track and manage your submitted requests and CC involvements.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Search by ID, name, or title..."
                            className="form-control"
                            style={{ paddingLeft: '2.5rem', width: '300px', borderRadius: '12px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="form-control"
                        style={{ width: 'auto', borderRadius: '12px' }}
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Course">Course</option>
                        <option value="Material">Material</option>
                        <option value="Repair">Repair</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Leave">Leave</option>
                    </select>
                    <div style={{ display: 'flex', background: 'white', padding: '0.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <button
                            onClick={() => setShowOnlyCreated(true)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: showOnlyCreated ? 'var(--primary)' : 'transparent',
                                color: showOnlyCreated ? 'white' : '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Created by Me
                        </button>
                        <button
                            onClick={() => setShowOnlyCreated(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: !showOnlyCreated ? 'var(--primary)' : 'transparent',
                                color: !showOnlyCreated ? 'white' : '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            I'm in CC
                        </button>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(req => (
                        <div key={req.id} className="fade-in" style={{
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            border: '1px solid #f1f5f9',
                            overflow: 'hidden'
                        }}>
                            {/* Card Header */}
                            <div
                                style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ background: '#eff6ff', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem' }}>
                                        {req.id}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{req.title}</h3>
                                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: '#f1f5f9', fontWeight: 600, color: '#475569' }}>{req.type}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={14} /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={14} /> Assigned to {req.department}</span>
                                            <span style={{
                                                color: req.priority === 'High' ? '#ef4444' : req.priority === 'Medium' ? '#f59e0b' : '#3b82f6',
                                                fontWeight: 800
                                            }}>{req.priority} Priority</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: getStatusColor(req.status) + '15', color: getStatusColor(req.status), padding: '0.4rem 0.8rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem', border: `1px solid ${getStatusColor(req.status)}30` }}>
                                        {getStatusIcon(req.status)}
                                        {req.status}
                                    </div>
                                    {expandedId === req.id ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                                </div>
                            </div>

                            {/* Card Body - Details & Workflow */}
                            {expandedId === req.id && (
                                <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #f8fafc' }} className="fade-in">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginTop: '1.5rem' }}>
                                        {/* Left Column: Content */}
                                        <div>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Description</h4>
                                                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                                    {req.description}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Attachments & Proofs</h4>
                                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                    {req.attachments?.map((at, idx) => (
                                                        <div key={idx} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.5rem 1rem',
                                                            background: 'white',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '10px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer'
                                                        }} className="hover-shadow">
                                                            <Paperclip size={14} color="var(--primary)" />
                                                            {at.name}
                                                        </div>
                                                    ))}
                                                    {!req.attachments?.length && <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No attachments provided.</p>}
                                                </div>
                                            </div>

                                            {/* Seen By Section */}
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Viewed By</h4>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {req.seenBy?.map((seen, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                                                            <Eye size={12} />
                                                            <strong>{seen.userName}</strong> • {new Date(seen.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    ))}
                                                    {!req.seenBy?.length && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Not viewed yet.</p>}
                                                </div>
                                            </div>

                                            {/* Action Disabled Message for Creator */}
                                            {req.requesterId === user?.staffId && (
                                                <div style={{ padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#92400e', fontSize: '0.85rem' }}>
                                                    <Info size={16} />
                                                    <span>You are the creator of this task. Final actions are reserved for management and trustees.</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column: Timeline & CC */}
                                        <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '2rem' }}>
                                            <div style={{ marginBottom: '2rem' }}>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', letterSpacing: '0.05em' }}>Approval Trail</h4>
                                                <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                                                    <div style={{ position: 'absolute', left: '4px', top: '8px', bottom: '8px', width: '2px', background: '#e2e8f0' }} />

                                                    {req.history.map((h, idx) => (
                                                        <div key={idx} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                                            <div style={{
                                                                position: 'absolute',
                                                                left: '-18px',
                                                                top: '4px',
                                                                width: '10px',
                                                                height: '10px',
                                                                borderRadius: '50%',
                                                                background: idx === req.history.length - 1 ? 'var(--primary)' : '#cbd5e1',
                                                                border: '2px solid white',
                                                                boxShadow: '0 0 0 2px #f8fafc'
                                                            }} />
                                                            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{h.action}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{h.actorName} ({h.timestamp ? new Date(h.timestamp).toLocaleString() : 'N/A'})</div>
                                                            {h.comments && <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '0.25rem', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>"{h.comments}"</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', letterSpacing: '0.05em' }}>Visibility (CC)</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {req.cc?.map((c, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer' }} className="hover-blue">
                                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                                                {c.name[0]}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{c.name}</div>
                                                                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{c.role}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {!req.cc?.length && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No CC members added.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Row */}
                                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
                                            <MessageSquare size={16} /> Open Comments
                                        </button>
                                        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
                                            <History size={16} /> Full Audit Trail
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '5rem', textAlign: 'center', background: 'white', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#cbd5e1' }}>
                            <History size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569' }}>No tasks found matching your filters</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '350px', margin: '0.5rem auto 0' }}>All your created tasks and tasks where you are in CC will appear here once they are generated.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskStatusDashboard;
