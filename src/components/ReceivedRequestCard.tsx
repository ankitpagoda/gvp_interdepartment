import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock,
    Forward,
    Eye,
    ChevronDown,
    ChevronUp,
    Image as ImageIcon,
    FileText,
    Video,
    Music,
    Send,
    History as HistoryIcon
} from 'lucide-react';
import type { User as AuthUser, GVPRequest, RequestStatus } from '../types';
import { markAsSeen, addChatMessage } from '../lib/mockDb';

interface ReceivedRequestCardProps {
    request: GVPRequest;
    user: AuthUser | null;
    onStatusChange: (requestId: string, newState: RequestStatus, comment?: string) => void;
}

const ReceivedRequestCard: React.FC<ReceivedRequestCardProps> = ({ request, user, onStatusChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [comment, setComment] = useState("");
    const [showForwardModal, setShowForwardModal] = useState(false);

    useEffect(() => {
        if (isExpanded && user && request.status === 'Pending Approval') {
            markAsSeen(request.id, user.staffId, user.name);
        }
    }, [isExpanded, user, request.id, request.status]);

    const getStatusColor = (state: RequestStatus) => {
        switch (state) {
            case 'Seen': return '#3b82f6'; // blue
            case 'Approved': return '#22c55e'; // green
            case 'Rejected': return '#ef4444'; // red
            case 'On Hold': return '#f59e0b'; // orange
            case 'Forwarded to Trustee': return '#a855f7'; // purple
            case 'Completed': return '#10b981'; // emerald
            default: return '#94a3b8'; // pending/gray
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': case 'Emergency': return '#fee2e2';
            case 'Medium': return '#fef3c7';
            case 'Low': return '#f0f9ff';
            default: return '#f1f5f9';
        }
    };

    const getPriorityTextColor = (p: string) => {
        switch (p) {
            case 'High': case 'Emergency': return '#991b1b';
            case 'Medium': return '#92400e';
            case 'Low': return '#075985';
            default: return '#475569';
        }
    };

    const renderAttachmentIcon = (type: string) => {
        switch (type) {
            case 'image': return <ImageIcon size={16} />;
            case 'video': return <Video size={16} />;
            case 'audio': return <Music size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const handleSendComment = () => {
        if (!comment.trim() || !user) return;
        addChatMessage(request.id, {
            senderId: user.staffId,
            senderName: user.name,
            senderRole: user.role,
            text: comment,
            type: 'user'
        });
        setComment("");
    };

    const canAction = user?.role === 'Manager' || user?.role === 'General Manager' || user?.role === 'Chairman' || user?.role?.includes('Trustee');

    return (
        <div className="received-request-card" style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            marginBottom: '1.5rem',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            transition: 'all 0.3s'
        }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {request.requesterName[0]}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>{request.requesterName}</span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>|</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{request.requesterDept}</span>
                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>{request.requesterRole}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <span style={{ background: 'var(--primary)', color: 'white', padding: '0.1rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }}>{request.type}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(request.createdAt).toLocaleDateString()}</span>
                            <span style={{ background: getPriorityColor(request.priority), color: getPriorityTextColor(request.priority), padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>{request.priority}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: getStatusColor(request.status) + '15', color: getStatusColor(request.status), padding: '0.4rem 0.8rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem' }}>
                        {request.status === 'Seen' ? <Eye size={14} /> : <Clock size={14} />}
                        {request.status}
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                </div>
            </div>

            {/* Body */}
            {isExpanded && (
                <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #f8fafc' }} className="fade-in">
                    <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                        <div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Description</label>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#1e293b', marginTop: '0.5rem' }}>
                                    {request.description}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Attachments</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    {request.attachments.map((at, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {renderAttachmentIcon(at.type)}
                                            {at.name}
                                        </div>
                                    ))}
                                    {request.attachments.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>None</span>}
                                </div>
                            </div>

                            {/* Contextual Chat */}
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={16} /> Contextual Chat
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto', padding: '0.5rem' }} className="custom-scrollbar">
                                    {request.chat.map((msg, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: msg.type === 'system' ? 'center' : (msg.senderId === user?.staffId ? 'flex-end' : 'flex-start'),
                                            width: '100%'
                                        }}>
                                            {msg.type === 'system' ? (
                                                <div style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', padding: '0.25rem 0.75rem', borderRadius: '50px', margin: '0.5rem 0' }}>
                                                    {msg.text}
                                                </div>
                                            ) : (
                                                <div style={{
                                                    background: msg.senderId === user?.staffId ? 'var(--primary)' : '#f8fafc',
                                                    color: msg.senderId === user?.staffId ? 'white' : '#1e293b',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '16px',
                                                    border: msg.senderId === user?.staffId ? 'none' : '1px solid #e2e8f0',
                                                    maxWidth: '85%',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                }}>
                                                    <div style={{ fontSize: '0.65rem', marginBottom: '0.25rem', opacity: 0.8, fontWeight: 700 }}>{msg.senderName}</div>
                                                    <div style={{ fontSize: '0.85rem' }}>{msg.text}</div>
                                                    <div style={{ fontSize: '0.6rem', textAlign: 'right', marginTop: '0.2rem', opacity: 0.7 }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        className="form-control"
                                        placeholder="Type a contextual reply..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                                    />
                                    <button className="btn-primary" onClick={handleSendComment} style={{ width: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Timeline & CC */}
                        <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '1.5rem' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>
                                    <HistoryIcon size={12} style={{ marginRight: '4px' }} /> Approval Trail
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {request.history.map((h, i) => (
                                        <div key={i} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                                            <div style={{ position: 'absolute', left: 0, top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: i === 0 ? '#3b82f6' : '#cbd5e1' }} />
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{h.action}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{h.actorName} • {new Date(h.timestamp).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>Visibility (CC)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {request.cc.map((c, i) => (
                                        <div key={i} style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
                                            <div style={{ fontWeight: 700 }}>{c.name}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{c.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {canAction && !['Approved', 'Rejected'].includes(request.status) && (
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn-secondary"
                                style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}
                                onClick={() => onStatusChange(request.id, 'Approved', 'Approved after review.')}
                            >
                                <CheckCircle2 size={16} /> Approve
                            </button>
                            <button
                                className="btn-secondary"
                                style={{ background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' }}
                                onClick={() => onStatusChange(request.id, 'Rejected', 'Rejected based on policy.')}
                            >
                                <XCircle size={16} /> Reject
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => onStatusChange(request.id, 'On Hold', 'Pending department verification.')}
                            >
                                <Clock size={16} /> Hold
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowForwardModal(true)}
                            >
                                <Forward size={16} /> Forward
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Forward Modal (Simplified) */}
            {showForwardModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '320px', padding: '2rem' }}>
                        <h3>Forward Request</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Select target for escalation</p>
                        <div className="form-group mb-4 mt-4">
                            <select className="form-control">
                                <option>Trustee - Samyak Trust</option>
                                <option>General Manager</option>
                                <option>Chairman</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowForwardModal(false)}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                                onStatusChange(request.id, 'Forwarded to Trustee', 'Forwarded for higher level approval.');
                                setShowForwardModal(false);
                            }}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceivedRequestCard;
