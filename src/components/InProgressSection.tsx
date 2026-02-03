import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Mic, CheckCheck } from 'lucide-react';

const InProgressCard = ({ from, location, task, status, reason, time }: any) => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const rowContainerStyle = {
        border: '1px solid #1e3a8a',
        borderRadius: '20px',
        padding: '0.5rem 1rem',
        marginBottom: '0.75rem',
        fontSize: '0.9rem',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff'
    };

    const labelStyle = {
        fontWeight: '700',
        color: '#1e3a8a',
        marginRight: '0.5rem',
        whiteSpace: 'nowrap' as const
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        width: '100%',
        backgroundColor: 'transparent',
        fontSize: '0.9rem',
        color: '#1a1a1a'
    };

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e5e7eb',
            position: 'relative',
            fontFamily: systemFont
        }}>
            {/* Left Column: Avatar */}
            <div style={{
                width: '75px',
                height: '75px',
                borderRadius: '50%',
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: 'center'
            }}>
                <User size={45} color="#000" fill="#000" />
            </div>

            {/* Right Column: Details Panel */}
            <div style={{ flex: 1 }}>
                {/* Header Row */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{ ...rowContainerStyle, paddingRight: '2.5rem' }}>
                        From {from.name} | {from.dept} | {time}
                    </div>
                    <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <MoreVertical size={18} color="#1e3a8a" />
                    </div>
                </div>

                {/* Location Field */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Location:-</span>
                    <input style={inputStyle} defaultValue={location} />
                </div>

                {/* Task Field */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Task:- Working On</span>
                    <input style={inputStyle} defaultValue={task} />
                </div>

                {/* Status Field */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Status:-</span>
                    <input style={inputStyle} defaultValue={status} />
                </div>

                {/* Reason Field */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Reason:-</span>
                    <input style={inputStyle} defaultValue={reason} />
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={20} style={{ cursor: 'pointer' }} />
                        <ThumbsDown size={20} style={{ cursor: 'pointer' }} />
                        <MessageSquare size={20} style={{ cursor: 'pointer' }} />
                        <Link size={20} style={{ cursor: 'pointer' }} />
                        <RotateCw size={20} style={{ cursor: 'pointer' }} />
                        <Mic size={20} style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ color: '#10b981', cursor: 'pointer' }}>
                        <CheckCheck size={26} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InProgressSection = () => {
    const activeTasks = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'Maintenence' },
            location: 'Main Pagoda - Area 4',
            task: 'Repairing the lighting fixtures in the meditation hall.',
            status: 'Currently 70% complete',
            reason: 'Extended due to intricate wiring adjustments.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. John Smith', dept: 'IT' },
            location: 'Reception Server Room',
            task: 'Replacing network switches and re-organizing cable management.',
            status: 'Testing connectivity',
            reason: 'Urgent maintenance requested by administration.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto' }}>
            {activeTasks.map((task, idx) => (
                <InProgressCard key={idx} {...task} />
            ))}
        </div>
    );
};

export default InProgressSection;
