import { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Mic,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import {
    getRequests,
    updateWorkflowStatus,
    getRequestAnalytics,
    createRequest
} from '../lib/mockDb';
import type { User as AuthUser, GVPRequest } from '../types';

interface Message {
    id: string;
    type: 'ai' | 'user';
    text: string;
    timestamp: number;
    actions?: { label: string; action: () => void }[];
    chart?: any;
    dataList?: any[]; // Generic list for rendering items
}

const AskAI = ({ user }: { user: AuthUser | null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = `Namaste ${user?.name}. \n I am your GVP Inter-Department Assistant. \n I can create Task, approve/reject tasks behalf of you, and show you analytics & Daily Reports. \n How can I help you...?`;
            setMessages([{
                id: '1',
                type: 'ai',
                text: greeting,
                timestamp: Date.now(),
                actions: [],
                chart: null
            } as Message]);
        }
        scrollToBottom();
    }, [isOpen, messages.length, user]);

    // Voice Recognition Logic
    useEffect(() => {
        let recognition: any = null;
        if (isListening) {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInputValue(transcript);
                    setIsListening(false);
                    setTimeout(() => handleSend(transcript), 800);
                };

                recognition.onerror = () => {
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognition.start();
            } else {
                alert("Voice input is not supported in this browser.");
                setIsListening(false);
            }
        }
        return () => {
            if (recognition) recognition.stop();
        };
    }, [isListening]);


    const handleAction = async (text: string) => {
        const lowerText = text.toLowerCase();

        // Booking detection: if user asks to book a room for dhammasevak
        const isBooking = lowerText.includes('book') && (lowerText.includes('dhammasevak') || lowerText.includes('book a room') || lowerText.includes('room'));
        if (isBooking) {
            const processingMsg: Message = {
                id: Date.now().toString(),
                type: 'ai',
                text: "Processing your booking...",
                timestamp: Date.now(),
                actions: [],
                chart: null,
                dataList: []
            };
            setMessages(prev => [...prev, processingMsg]);
            try {
                const resp = await fetch('/api/assistant/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: { staffId: user?.staffId, name: user?.name }, message: text })
                });
                const data = await resp.json();
                if (resp.ok) {
                    if (data.action === 'clarify' && Array.isArray(data.questions)) {
                        data.questions.forEach((q: string) => {
                            setMessages(prev => [...prev, {
                                id: Date.now().toString() + Math.random(),
                                type: 'ai',
                                text: q,
                                timestamp: Date.now(),
                                actions: [],
                                chart: null,
                                dataList: []
                            }]);
                        });
                    } else if (data.action === 'book_room' && data.booking) {
                        const b = data.booking;
                        const msgText = `Done — Room '${b.room}' booked for ${b.dhammasevak_name} on ${b.date} at ${b.start_time} for ${b.duration_minutes/60} hours. Booking ID: ${b.id}`;
                        setMessages(prev => [...prev, {
                            id: Date.now().toString() + Math.random(),
                            type: 'ai',
                            text: msgText,
                            timestamp: Date.now(),
                            actions: [{ label: 'Add to Calendar', action: () => setInputValue(`Add ${b.id} to calendar`) }],
                            chart: null,
                            dataList: []
                        }]);
                    } else if (data.assistant) {
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            type: 'ai',
                            text: data.assistant,
                            timestamp: Date.now(),
                            actions: [],
                            chart: null,
                            dataList: []
                        }]);
                    } else if (data.error) {
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            type: 'ai',
                            text: `Error: ${data.error}`,
                            timestamp: Date.now(),
                            actions: [],
                            chart: null,
                            dataList: []
                        }]);
                    } else {
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            type: 'ai',
                            text: JSON.stringify(data),
                            timestamp: Date.now(),
                            actions: [],
                            chart: null,
                            dataList: []
                        }]);
                    }
                } else {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        type: 'ai',
                        text: data.error || 'Server error while processing booking.',
                        timestamp: Date.now(),
                        actions: [],
                        chart: null,
                        dataList: []
                    }]);
                }
            } catch (err) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    type: 'ai',
                    text: 'Network error while contacting assistant.',
                    timestamp: Date.now(),
                    actions: [],
                    chart: null,
                    dataList: []
                }]);
            }
            setTimeout(scrollToBottom, 100);
            return;
        }

        let response: Message = {
            id: Date.now().toString(),
            type: 'ai',
            text: "I'm processing that for you.",
            timestamp: Date.now(),
            actions: [],
            chart: null,
            dataList: []
        };

        // Role-based permissions
        const isTrustee = user?.role === 'Trustee' || user?.role === 'Super Admin' || user?.role === 'Chairman';
        const isManager = user?.role === 'Department Admin' || isTrustee || user?.role === 'Manager';

        // --- Helper: Date Parser ---
        const getDateFilter = (query: string) => {
            const now = new Date();
            const oneDay = 86400000;

            if (query.includes('today')) {
                const start = new Date(now.setHours(0, 0, 0, 0)).getTime();
                return { start, end: Date.now(), label: 'Today' };
            }
            if (query.includes('yesterday')) {
                const start = new Date(now.getTime() - oneDay).setHours(0, 0, 0, 0);
                const end = new Date(now.getTime() - oneDay).setHours(23, 59, 59, 999);
                return { start, end, label: 'Yesterday' };
            }
            return null;
        };

        // 1. REPORT BY DATE / ANALYTICS
        if (lowerText.includes('report') || lowerText.includes('analytics') || lowerText.includes('summary')) {
            const dateRange = getDateFilter(lowerText);

            // If user explicitly asks for a date range
            if (dateRange) {
                const allRequests = getRequests();
                const filtered = allRequests.filter(r => r.createdAt >= dateRange.start && r.createdAt <= dateRange.end);

                const stats = {
                    total: filtered.length,
                    approved: filtered.filter(r => r.status === 'Approved').length,
                    pending: filtered.filter(r => r.status === 'Pending Approval').length,
                    rejected: filtered.filter(r => r.status === 'Rejected').length
                };

                response.text = `Here is the ${dateRange.label}'s Report (${new Date(dateRange.start).toLocaleDateString()}):`;
                response.chart = stats; // Reuse chart visualization
            }
            // Global/Current Analytics
            else {
                if (!isTrustee && !isManager) {
                    response.text = "Here is your personal activity report.";
                    // Personal Stats Fallback could go here/
                    // For now, simpler response
                } else {
                    const stats = getRequestAnalytics();
                    response.text = `Here is the Overall System Analytical Report:`;
                    response.chart = stats;
                }
            }
        }

        // 2. ASSIGNED TASKS (Tasks assigned TO the user)
        else if (lowerText.includes('assigned') || (lowerText.includes('my') && lowerText.includes('task'))) {
            const allRequests = getRequests();
            // Tasks assigned explicitly to user OR to their department (if they are generic staff/admin looking for work)
            const assignedTasks = allRequests.filter(r =>
                r.assignedToPerson === user?.name ||
                (r.assignedToDept === user?.department && r.status === 'Pending Approval')
            );

            if (assignedTasks.length === 0) {
                response.text = "You have no pending tasks assigned to you at the moment.";
            } else {
                response.text = `You have ${assignedTasks.length} tasks assigned to you/your department:`;
                response.dataList = assignedTasks.slice(0, 5); // Show top 5
                response.actions = assignedTasks.slice(0, 3).map(t => ({
                    label: `Open ${t.id}`,
                    action: () => setInputValue(`Show details of ${t.id}`) // Mock action
                }));
            }
        }

        // 3. PENDING REQUESTS (Tasks user CREATED that are waiting)
        else if (lowerText.includes('pending') || lowerText.includes('status')) {
            const myRequests = getRequests().filter(r => r.requesterId === user?.staffId && r.status !== 'Approved' && r.status !== 'Rejected');

            if (myRequests.length === 0) {
                response.text = "You have no open requests pending approval.";
            } else {
                response.text = `You have ${myRequests.length} requests waiting for approval:`;
                response.dataList = myRequests.slice(0, 5);
            }
        }

        // 4. WORKFLOW: APPROVE/REJECT logic (Voice & Text)
        else if (lowerText.match(/(approve|reject)\s+(REQ-[\w-]+)/i)) {
            const match = lowerText.match(/(approve|reject)\s+(REQ-[\w-]+)/i);
            const action = match![1].toLowerCase();
            const reqId = match![2].toUpperCase();

            if (!isManager) {
                response.text = "Permission Denied. Authorization needed.";
            } else {
                const status = action === 'approve' ? 'Approved' : 'Rejected';
                // MockDB update
                updateWorkflowStatus(reqId, status, user?.staffId || '', user?.name || '', `Voice Action: ${action} via AskAI`);
                response.text = `Done. Request ${reqId} has been ${status.toUpperCase()}.`;
            }
        }

        // 5. ONE-SHOT CREATION
        else if (lowerText.startsWith('create task') && text.length > 15) {
            const title = text.replace(/create task/i, '').trim();
            const newTask = createRequest({
                trustId: user?.trustId || 'GVP',
                department: user?.department || 'General',
                requesterId: user?.staffId || '',
                requesterName: user?.name || '',
                requesterRole: user?.role || 'Staff',
                type: 'Task',
                title: title,
                description: `Created via Voice Command`,
                priority: 'Medium'
            });
            response.text = `Task Created Successfully!\nTicket: ${newTask.id}\nTitle: ${newTask.title}`;
        }

        // Fallback / Guidance
        else {
            response.text = "I can help you with:\n• 'Report for today/yesterday'\n• 'My assigned tasks'\n• 'My pending requests'\n• 'Create task [Title]'";
        }

        setMessages(prev => [...prev, response]);
        setTimeout(scrollToBottom, 100);
    };

    const handleSend = (textOverride?: string) => {
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: textToSend,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        handleAction(textToSend);
        setInputValue('');
    };

    return (
        <>
            {/* Entry Point */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(42, 82, 152, 0.45',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {isOpen ? <X size={32} /> : (
                    <div style={{ position: 'relative' }}>
                        <MessageCircle size={32} />
                        <Sparkles size={16} style={{ position: 'absolute', top: '-6px', right: '-6px', color: '#fff' }} />
                    </div>
                )}
            </button>

            {/* Chat Interface */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '420px',
                    height: '650px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 1000,
                    border: '1px solid rgba(184, 134, 11, 0.1)',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                        padding: '1.5rem',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                AskAI <span style={{ fontSize: '0.7em', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>BETA</span>
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>GVP Intelligent Assistant</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ alignSelf: msg.type === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '90%' }}>
                                <div style={{
                                    backgroundColor: msg.type === 'ai' ? '#fff' : '#2563eb',
                                    color: msg.type === 'ai' ? '#1e293b' : '#fff',
                                    padding: '1rem',
                                    borderRadius: msg.type === 'ai' ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5,
                                    border: msg.type === 'ai' ? '1px solid #e2e8f0' : 'none'
                                }}>
                                    {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}

                                    {/* Data List Rendering */}
                                    {msg.dataList && msg.dataList.length > 0 && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {msg.dataList.map((item: GVPRequest) => (
                                                <div key={item.id} style={{
                                                    background: '#f1f5f9',
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    borderLeft: `3px solid ${item.status === 'Approved' ? '#22c55e' : item.status === 'Rejected' ? '#ef4444' : '#f59e0b'}`
                                                }}>
                                                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.7em', marginTop: '2px' }}>
                                                        <span>{item.id}</span>
                                                        <span>{item.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Analytics Chart Block */}
                                    {msg.chart && (
                                        <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', gap: '4px', height: '30px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                                                <div style={{ flex: msg.chart.approved || 1, background: '#22c55e' }} title="Approved" />
                                                <div style={{ flex: msg.chart.pending || 1, background: '#f59e0b' }} title="Pending" />
                                                <div style={{ flex: msg.chart.rejected || 1, background: '#ef4444' }} title="Rejected" />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
                                                <span style={{ color: '#16a34a', fontWeight: 600 }}>{msg.chart.approved} Approved</span>
                                                <span style={{ color: '#d97706', fontWeight: 600 }}>{msg.chart.pending} Pending</span>
                                                <span style={{ color: '#dc2626', fontWeight: 600 }}>{msg.chart.rejected} Rejected</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {msg.actions && msg.actions.length > 0 && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {msg.actions.map((act, i) => (
                                                <button key={i} onClick={act.action} style={{
                                                    background: 'white', border: '1px solid #cbd5e1', color: '#475569',
                                                    padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    {act.label} <ChevronRight size={12} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', textAlign: msg.type === 'ai' ? 'left' : 'right', padding: '0 4px' }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: '#f1f5f9', padding: '0.5rem', borderRadius: '14px', border: '1px solid #e2e8f0'
                        }}>
                            <button
                                onClick={() => setIsListening(!isListening)}
                                style={{
                                    background: isListening ? '#fee2e2' : 'transparent',
                                    border: 'none',
                                    color: isListening ? '#ef4444' : '#64748b',
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Say 'Report for today' or 'My Pending Tasks'..."
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#334155' }}
                            />
                            <button
                                onClick={() => handleSend()}
                                style={{
                                    background: '#1e3a8a', color: 'white', border: 'none',
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            `}</style>
        </>
    );
};

export default AskAI;
