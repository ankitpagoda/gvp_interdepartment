import { useState } from 'react';
import {
    Search,
    Plus,
    Smile,
    Mic,
    Phone,
    ChevronDown,
    Settings,
    MoreVertical
} from 'lucide-react';

const ChatSection = () => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
    const [selectedChat, setSelectedChat] = useState<number | null>(0);
    const [activeFilter, setActiveFilter] = useState('All');

    const chats = [
        { id: 0, name: 'John Doe', lastMsg: 'I will send the report by EOD.', time: '10:30 AM', avatar: 'JD' },
        { id: 1, name: 'Alice Smith', lastMsg: 'The meeting is rescheduled.', time: '09:15 AM', avatar: 'AS' },
        { id: 2, name: 'Marketing Team', lastMsg: 'New campaign assets are ready.', time: 'Yesterday', avatar: 'MT' },
        { id: 3, name: 'David Miller', lastMsg: 'Please check the invoice #442.', time: 'Yesterday', avatar: 'DM' },
        { id: 4, name: 'Sarah Wilson', lastMsg: 'The server maintenance is done.', time: 'Feb 1', avatar: 'SW' },
    ];

    const filters = ['All', 'Unread', 'Favourites', 'Groups'];

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                width: '100%',
                backgroundColor: '#fff',
                fontFamily: systemFont,
                overflow: 'hidden'
            }}
        >
            {/* LEFT PANEL — Chat List */}
            <div
                style={{
                    width: '350px',
                    borderRight: '1px solid #e5e5e5',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ padding: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 1.5rem 0' }}>Chats</h1>

                    {/* Search Input */}
                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <Search
                            size={18}
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#666'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Ask"
                            style={{
                                width: '100%',
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                backgroundColor: '#f9f9f9',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: activeFilter === filter
                                        ? (filter === 'All' ? '#e8f5e9' : '#f0f0f0')
                                        : 'transparent',
                                    color: activeFilter === filter && filter === 'All' ? '#2e7d32' : '#333'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Items List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem 1.5rem',
                                cursor: 'pointer',
                                backgroundColor: selectedChat === chat.id ? '#f5f5f5' : 'transparent',
                                borderBottom: '1px solid #f0f0f0'
                            }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#eeeeee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    color: '#666',
                                    marginRight: '1rem',
                                    flexShrink: 0
                                }}
                            >
                                {chat.avatar}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{chat.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>{chat.time}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {chat.lastMsg}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL — Active Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedChat !== null ? (
                    <>
                        {/* Top Bar */}
                        <div
                            style={{
                                height: '70px',
                                borderBottom: '1px solid #e5e5e5',
                                padding: '0 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#eeeeee',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        color: '#666',
                                        marginRight: '0.75rem'
                                    }}
                                >
                                    {chats[selectedChat].avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{chats[selectedChat].name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Okay</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#666' }}>
                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <Phone size={20} />
                                    <ChevronDown size={14} style={{ marginLeft: '2px' }} />
                                </div>
                                <Search size={20} style={{ cursor: 'pointer' }} />
                                <Settings size={20} style={{ cursor: 'pointer' }} />
                                <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
                            {/* Empty conversation area as requested */}
                        </div>

                        {/* Message Input Bar */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e5e5' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '12px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem', marginRight: '1rem', color: '#666' }}>
                                    <Plus size={22} style={{ cursor: 'pointer' }} />
                                    <Smile size={22} style={{ cursor: 'pointer' }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type a message"
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                />
                                <Mic size={22} style={{ marginLeft: '1rem', color: '#666', cursor: 'pointer' }} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#888' }}>
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSection;
