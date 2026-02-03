import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Volume2, CheckCheck } from 'lucide-react';

const AnnouncementCard = ({ from, to, description, time }: any) => {
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

    const descriptionBlockStyle = {
        border: '1px solid #1e3a8a',
        borderRadius: '20px',
        padding: '1.25rem',
        minHeight: '120px',
        backgroundColor: '#fff',
        color: '#1a1a1a'
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

            {/* Right Column: Main Content */}
            <div style={{ flex: 1 }}>
                {/* From Header Row */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{ ...rowContainerStyle, paddingRight: '2.5rem' }}>
                        <span style={labelStyle}>From</span> {from.name} | {from.dept} | {time}
                    </div>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <MoreVertical size={20} color="#1e3a8a" />
                    </div>
                </div>

                {/* To Header Row */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>To</span> {to.name} | {to.dept} | {time}
                </div>

                {/* Description Section */}
                <div style={descriptionBlockStyle}>
                    <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Description:-</div>
                    <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#1a1a1a' }}>{description}</div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '2rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={22} style={{ cursor: 'pointer' }} />
                        <ThumbsDown size={22} style={{ cursor: 'pointer' }} />
                        <MessageSquare size={22} style={{ cursor: 'pointer' }} />
                        <Link size={22} style={{ cursor: 'pointer' }} />
                        <RotateCw size={22} style={{ cursor: 'pointer' }} />
                        <Volume2 size={22} style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ position: 'absolute', right: 0, color: '#10b981', cursor: 'pointer' }}>
                        <CheckCheck size={28} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnnouncementsWindowSection = () => {
    const announcements = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'Administration' },
            to: { name: 'All Staff', dept: 'Global Vipassana Pagoda' },
            time: '22 Hour Ago',
            description: 'Please note that the monthly staff meeting will be held today at 4:30 PM in the Main Hall. Attendance is mandatory for all department heads and available staff members. We will be discussing the upcoming Mega Course logistics.'
        },
        {
            from: { name: 'Dr. John Doe', dept: 'Management' },
            to: { name: 'Reception & Security', dept: 'GVP' },
            time: 'Yesterday',
            description: 'New security protocol updates for the South Gate entry. Please ensure all temporary visitor badges are scanned and recorded in the digital register before entry. This change is effective immediately.'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto' }}>
            {announcements.map((item, idx) => (
                <AnnouncementCard key={idx} {...item} />
            ))}
        </div>
    );
};

export default AnnouncementsWindowSection;
