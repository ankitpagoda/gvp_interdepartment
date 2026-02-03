import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Mic, CheckCheck } from 'lucide-react';

const IssueCard = ({ from, to, description, time }: any) => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const rowContainerStyle = {
        border: '1px solid #1e3a8a',
        borderRadius: '20px',
        padding: '0.6rem 1.25rem',
        marginBottom: '0.75rem',
        fontSize: '0.95rem',
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

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderBottom: '2px solid #1e3a8a',
            position: 'relative',
            fontFamily: systemFont,
            margin: '0.5rem 0'
        }}>
            {/* Left Column: Avatar */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: 'center'
            }}>
                <User size={50} color="#000" fill="#000" />
            </div>

            {/* Right Column: Fields */}
            <div style={{ flex: 1 }}>
                {/* From Field (Header) */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{ ...rowContainerStyle, paddingRight: '2.5rem' }}>
                        From {from.name} | {from.dept} | {time}
                    </div>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <MoreVertical size={20} color="#1e3a8a" />
                    </div>
                </div>

                {/* To Field */}
                <div style={rowContainerStyle}>
                    To {to.name} | {to.dept} | {time}
                </div>

                {/* Description Field */}
                <div style={{
                    border: '1px solid #1e3a8a',
                    borderRadius: '20px',
                    padding: '1rem 1.25rem',
                    minHeight: '100px',
                    backgroundColor: '#fff'
                }}>
                    <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Description:-</div>
                    <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#1a1a1a' }}>{description}</div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={22} style={{ cursor: 'pointer' }} />
                        <ThumbsDown size={22} style={{ cursor: 'pointer' }} />
                        <MessageSquare size={22} style={{ cursor: 'pointer' }} />
                        <Link size={22} style={{ cursor: 'pointer' }} />
                        <RotateCw size={22} style={{ cursor: 'pointer' }} />
                        <Mic size={22} style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ color: '#10b981', cursor: 'pointer' }}>
                        <CheckCheck size={28} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const IssueWindowSection = () => {
    const issues = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept' },
            to: { name: 'Mr. Manager', dept: 'Reception' },
            description: 'Connectivity issues reported in the main lobby access points. Need immediate technical inspection as it is affecting guest check-ins.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mrs. Jane Smith', dept: 'Housekeeping' },
            to: { name: 'Mr. Supervisor', dept: 'Maintenance' },
            description: 'Leakage observed in the block C corridor ceiling. Probable pipe burst in the upper floor washroom area.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto' }}>
            {issues.map((issue, idx) => (
                <IssueCard key={idx} {...issue} />
            ))}
        </div>
    );
};

export default IssueWindowSection;
