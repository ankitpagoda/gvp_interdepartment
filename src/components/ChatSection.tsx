import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Plus,
    Smile,
    Mic,
    Phone,
    Video,
    Settings,
    MoreVertical,
    Send,
    Paperclip,
    ImageIcon,
    CheckCheck,
} from 'lucide-react';
import {
    getChatThreads,
    getChatMessages,
    sendChatMessage,
    markThreadSeen,
    getRequests,
    markAsSeen
} from '../lib/mockDb';
import type {
    ChatThread,
    ChatMessage,
    User as AuthUser,
    GVPRequest,
    RequestStatus
} from '../types';

interface ChatSectionProps {
    user: AuthUser | null;
}

const ChatSection: React.FC<ChatSectionProps> = ({ user }) => {
    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Favourites'>('All');
    const [allRequests, setAllRequests] = useState<GVPRequest[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        const loadThreads = () => {
            const t = getChatThreads();
            setThreads(t);
        };
        const loadRequests = () => {
            setAllRequests(getRequests());
        };
        loadThreads();
        loadRequests();
        const interval = setInterval(() => {
            loadThreads();
            loadRequests();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Load messages for active thread
    useEffect(() => {
        if (activeThreadId && user) {
            const msgs = getChatMessages(activeThreadId);
            setMessages(msgs);
            markThreadSeen(activeThreadId);

            // Auto-mark requests as Seen if they are for my department
            msgs.filter(m => m.type === 'request' && m.requestId).forEach(m => {
                const req = allRequests.find(r => r.id === m.requestId);
                if (req && req.status === 'Pending Approval' && req.assignedToDept === user.department) {
                    markAsSeen(req.id, user.staffId, user.name);
                }
            });

            scrollToBottom();
        }
    }, [activeThreadId, user, allRequests]);

    // Poll current thread messages
    useEffect(() => {
        if (!activeThreadId) return;
        const interval = setInterval(() => {
            const msgs = getChatMessages(activeThreadId);
            if (msgs.length !== messages.length) {
                setMessages(msgs);
                scrollToBottom();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activeThreadId, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activeThreadId || !user) return;

        const msg: Omit<ChatMessage, 'id' | 'timestamp'> = {
            senderId: user.staffId,
            senderName: user.name,
            senderRole: user.role,
            text: newMessage,
            type: 'user',
        };

        sendChatMessage(activeThreadId, msg);
        setNewMessage('');
        // Refresh local messages immediately
        setMessages(getChatMessages(activeThreadId));
        scrollToBottom();
    };

    const activeThread = threads.find(t => t.id === activeThreadId);

    const filteredThreads = threads.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.department?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' ||
            (activeFilter === 'Unread' && t.unreadCount > 0) ||
            (activeFilter === 'Favourites' && t.isFavourite);
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'Pending Approval': return '#f59e0b';
            case 'Approved': return '#10b981';
            case 'Rejected': return '#ef4444';
            case 'Completed': return '#3b82f6';
            case 'Seen': return '#6366f1';
            default: return '#64748b';
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
            {/* SIDEBAR */}
            <div style={{
                width: '380px',
                backgroundColor: '#fff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Chats</h2>
                        <button style={{ background: '#3b82f615', border: 'none', padding: '0.5rem', borderRadius: '10px', color: '#3b82f6', cursor: 'pointer' }}>
                            <Plus size={20} />
                        </button>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search staff, dept, request..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#f8fafc',
                                outline: 'none',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['All', 'Unread', 'Favourites'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f as any)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    backgroundColor: activeFilter === f ? '#3b82f6' : '#f1f5f9',
                                    color: activeFilter === f ? '#fff' : '#64748b',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Threads</p>
                        {filteredThreads.map(thread => (
                            <div
                                key={thread.id}
                                onClick={() => setActiveThreadId(thread.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.85rem 0.75rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    backgroundColor: activeThreadId === thread.id ? '#3b82f610' : 'transparent',
                                    marginBottom: '4px',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    backgroundColor: thread.type === 'department' ? '#ebf4ff' : '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: thread.type === 'department' ? '#3b82f6' : '#64748b',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    marginRight: '0.85rem',
                                    position: 'relative',
                                    flexShrink: 0
                                }}>
                                    {thread.avatar || (thread.name.charAt(0))}
                                    {thread.status === 'online' && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', backgroundColor: '#10b981', border: '2px solid #fff', borderRadius: '50%' }} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                            {thread.lastMessage ? new Date(thread.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '0.8rem',
                                            color: '#64748b',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontWeight: thread.unreadCount > 0 ? 700 : 400
                                        }}>
                                            {thread.lastMessage?.text || 'Start a conversation'}
                                        </p>
                                        {thread.unreadCount > 0 && (
                                            <div style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '8px', marginLeft: '8px' }}>
                                                {thread.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#fff' }}>
                {activeThread ? (
                    <>
                        {/* Header */}
                        <div style={{
                            height: '80px',
                            padding: '0 2rem',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem',
                                    fontWeight: 800,
                                    color: '#3b82f6'
                                }}>
                                    {activeThread.avatar}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{activeThread.name}</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                        {activeThread.type === 'department' ? `${activeThread.department} Department Group` : 'Direct Message'}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.25rem', color: '#64748b' }}>
                                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><Phone size={20} /></button>
                                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><Video size={20} /></button>
                                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><Search size={20} /></button>
                                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><Settings size={20} /></button>
                                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div style={{
                            flex: 1,
                            padding: '2rem',
                            overflowY: 'auto',
                            backgroundColor: '#f8fafc',
                            backgroundImage: 'radial-gradient(#CBD5E1 0.5px, transparent 0.5px)',
                            backgroundSize: '24px 24px'
                        }}>
                            {messages.map((msg) => {
                                const isMe = msg.senderId === user?.staffId;
                                const isSystem = msg.type === 'system';
                                const isRequest = msg.type === 'request';

                                if (isSystem) {
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
                                            <div style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                }

                                if (isRequest) {
                                    const request = allRequests.find(r => r.id === msg.requestId);
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                                            <div style={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '20px',
                                                padding: '1.5rem',
                                                width: '100%',
                                                maxWidth: '450px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New {request?.type} Request</span>
                                                        <h4 style={{ margin: '0.25rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{request?.title || 'Loading request...'}</h4>
                                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{request?.id}</p>
                                                    </div>
                                                    <div style={{
                                                        backgroundColor: getStatusColor(request?.status || 'Pending Approval') + '15',
                                                        color: getStatusColor(request?.status || 'Pending Approval'),
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800
                                                    }}>
                                                        {request?.status}
                                                    </div>
                                                </div>

                                                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                                                        {request?.description ? (request.description.length > 100 ? request.description.substring(0, 100) + '...' : request.description) : 'No description provided.'}
                                                    </p>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, marginRight: '0.75rem' }}>
                                                            {request?.requesterName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>{request?.requesterName}</p>
                                                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>{request?.requesterDept}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={{
                                                            backgroundColor: '#3b82f6',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id} style={{
                                        display: 'flex',
                                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                                        marginBottom: '1rem',
                                        width: '100%'
                                    }}>
                                        {!isMe && (
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                backgroundColor: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '0.75rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: '#64748b',
                                                border: '1px solid #e2e8f0',
                                                alignSelf: 'flex-end'
                                            }}>
                                                {msg.senderName.charAt(0)}
                                            </div>
                                        )}
                                        <div style={{ maxWidth: '70%', position: 'relative' }}>
                                            {!isMe && <p style={{ margin: '0 0 0.25rem 4px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>{msg.senderName} · {msg.senderRole}</p>}
                                            <div style={{
                                                backgroundColor: isMe ? '#3b82f6' : '#fff',
                                                color: isMe ? '#fff' : '#1e293b',
                                                padding: '0.85rem 1.1rem',
                                                borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                                border: isMe ? 'none' : '1px solid #e2e8f0',
                                                fontSize: '0.95rem',
                                                lineHeight: 1.5,
                                                position: 'relative'
                                            }}>
                                                {msg.text}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    marginTop: '0.35rem',
                                                    fontSize: '0.65rem',
                                                    opacity: isMe ? 0.8 : 0.6,
                                                    gap: '4px'
                                                }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMe && <CheckCheck size={12} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Composer */}
                        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #f1f5f9' }}>
                            <form
                                onSubmit={handleSendMessage}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    gap: '0.5rem'
                                }}
                            >
                                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><Plus size={22} /></button>
                                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><ImageIcon size={22} /></button>
                                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><Paperclip size={22} /></button>

                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        background: 'none',
                                        outline: 'none',
                                        fontSize: '0.95rem',
                                        padding: '0.5rem',
                                        color: '#1e293b'
                                    }}
                                />

                                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><Smile size={22} /></button>
                                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><Mic size={22} /></button>

                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '0.65rem',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '40px',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            border: '2px dashed #e2e8f0'
                        }}>
                            <Send size={48} color="#e2e8f0" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#475569', margin: '0 0 0.5rem 0' }}>Your Messages</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center', maxWidth: '300px' }}>Select a staff member or department group to start communicating.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSection;
