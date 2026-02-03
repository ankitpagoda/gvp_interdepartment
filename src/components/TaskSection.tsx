import { ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Mic, MoreVertical, CheckCheck, User } from 'lucide-react';

const TaskCard = ({ from, givenBy, task, status, reason, time }: any) => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const cardStyle = {
        backgroundColor: '#fff',
        border: '2px solid #1a1a1a',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        position: 'relative' as const,
        display: 'flex',
        gap: '1.5rem',
        fontFamily: systemFont,
    };

    const avatarStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#0056b3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0,
    };

    const pillStyle = {
        border: '1px solid #1a1a1a',
        borderRadius: '20px',
        padding: '0.25rem 1rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-block',
        marginBottom: '0.5rem',
        marginRight: '0.5rem',
        color: '#1a1a1a',
    };

    const boxStyle = {
        border: '1px solid #1a1a1a',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        fontSize: '0.9rem',
    };

    const iconButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#1a1a1a',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <div style={cardStyle}>
            {/* Overflow Menu */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer' }}>
                <MoreVertical size={20} />
            </div>

            {/* Left Side: Avatar */}
            <div style={avatarStyle}>
                <User size={30} fill="currentColor" />
            </div>

            {/* Right Side: Content */}
            <div style={{ flex: 1 }}>
                <div>
                    <div style={pillStyle}>
                        From {from.name} | {from.dept} | {time}
                    </div>
                </div>
                <div>
                    <div style={pillStyle}>
                        Given By :- {givenBy.name} | {givenBy.dept} | {time}
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <div style={boxStyle}>
                        <strong>Task :-</strong> {task}
                    </div>
                    <div style={boxStyle}>
                        <strong>Status :-</strong> {status}
                    </div>
                    <div style={boxStyle}>
                        <strong>Reason :-</strong> {reason}
                    </div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                    <button style={iconButtonStyle}><ThumbsUp size={18} /></button>
                    <button style={iconButtonStyle}><ThumbsDown size={18} /></button>
                    <button style={iconButtonStyle}><MessageSquare size={18} /></button>
                    <button style={iconButtonStyle}><Link size={18} /></button>
                    <button style={iconButtonStyle}><RotateCw size={18} /></button>
                    <button style={iconButtonStyle}><Mic size={18} /></button>
                </div>
            </div>

            {/* Completion Indicator */}
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: '#10b981' }}>
                <CheckCheck size={24} />
            </div>
        </div>
    );
};

const TaskSection = () => {
    const tasks = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Department' },
            givenBy: { name: 'Mr. Manager', dept: 'Admin' },
            task: 'Update the server security protocols and verify backup integrity.',
            status: 'In Progress',
            reason: 'Awaiting completion of system audit.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Department' },
            givenBy: { name: 'Dr. Smith', dept: 'Management' },
            task: 'Prepare monthly technical assessment report for the trustee board.',
            status: 'Pending',
            reason: 'Data collection from subordinate departments is incomplete.',
            time: 'Yesterday'
        }
    ];

    return (
        <div
            style={{
                backgroundColor: '#fff',
                minHeight: '100%',
                padding: '2rem',
                color: '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <div style={{ width: '100%', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem', textAlign: 'left' }}>
                    Task Activity Feed
                </h1>

                {tasks.map((task, idx) => (
                    <TaskCard key={idx} {...task} />
                ))}
            </div>
        </div>
    );
};

export default TaskSection;
