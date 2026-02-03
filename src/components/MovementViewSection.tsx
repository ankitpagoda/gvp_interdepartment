import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Mic, CheckCheck } from 'lucide-react';

const MVCard = ({ from, item, description, time }: any) => {
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

    const textAreaStyle = {
        ...inputStyle,
        width: '100%',
        minHeight: '80px',
        resize: 'none' as const,
        fontFamily: systemFont,
        lineHeight: '1.5'
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

            {/* Right Column: Content */}
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

                {/* Item Field */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Item:-</span>
                    <input style={inputStyle} defaultValue={item} />
                </div>

                {/* Description Field */}
                <div style={{ ...rowContainerStyle, alignItems: 'flex-start', flexDirection: 'column' }}>
                    <span style={{ ...labelStyle, marginBottom: '0.25rem' }}>Description:-</span>
                    <textarea style={textAreaStyle} defaultValue={description} />
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

const MovementViewSection = () => {
    const mvRecords = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept' },
            item: 'Laptop Dell Latitude 5420 (Asset ID: IT-042)',
            description: 'Item being moved from main server room to the new IT workspace on the 2nd floor for user assignment.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. John Doe', dept: 'Souvenir' },
            item: 'Wooden Buddha Statue (Box of 12)',
            description: 'Transferring stock from warehouse to the retail counter for weekend display.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto' }}>
            {mvRecords.map((record, idx) => (
                <MVCard key={idx} {...record} />
            ))}
        </div>
    );
};

export default MovementViewSection;
