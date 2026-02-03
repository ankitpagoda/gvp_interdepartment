import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Volume2, CheckCheck } from 'lucide-react';

const VisitorReportCard = ({ from, location, visitorCount }: any) => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const fieldStyle = {
        border: '1px solid #1e3a8a', // Dark blue
        borderRadius: '20px',
        padding: '0.6rem 1.25rem',
        marginBottom: '0.75rem',
        fontSize: '0.95rem',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%'
    };

    const labelStyle = {
        fontWeight: '700',
        color: '#000',
        marginRight: '0.5rem',
        whiteSpace: 'nowrap' as const
    };

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '2rem',
            backgroundColor: '#fff',
            border: '2px solid #1e3a8a',
            borderRadius: '24px',
            position: 'relative',
            fontFamily: systemFont,
            margin: '1rem',
            maxWidth: 'calc(100% - 2rem)'
        }}>
            {/* Left Section: Avatar */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#1e40af', // Solid blue
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: 'center'
            }}>
                <User size={50} color="#000" fill="#000" />
            </div>

            {/* Right Section: Content */}
            <div style={{ flex: 1 }}>
                {/* Header Row */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={fieldStyle}>
                        <span style={labelStyle}>Location:-</span>
                        <span>Museum / Anapan / Dhammalay</span>
                    </div>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <MoreVertical size={20} color="#1e3a8a" />
                    </div>
                </div>

                {/* Data Fields */}
                <div style={fieldStyle}>
                    <span style={labelStyle}>Report From:-</span>
                    <span>{from}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Location:-</span>
                    <span>{location}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Visitor:-</span>
                    <span>{visitorCount}</span>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '2rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={22} />
                        <ThumbsDown size={22} />
                        <MessageSquare size={22} style={{ color: '#3b82f6' }} /> {/* Highlighted blue as per requirement */}
                        <Link size={22} />
                        <RotateCw size={22} />
                        <Volume2 size={22} />
                    </div>
                    <div style={{ position: 'absolute', right: 0, color: '#10b981', cursor: 'pointer' }}>
                        <CheckCheck size={28} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisitorReportWindowSection = () => {
    const reports = [
        {
            from: 'Mr. ABC P XYZ | Department | 22 Hour Ago',
            location: 'Main Pagoda Reception',
            visitorCount: '45 People (General Entry)'
        },
        {
            from: 'Mrs. Jane Smith | PR Dept | Yesterday',
            location: 'Museum Entrance',
            visitorCount: '120 People (School Group)'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1rem' }}>
            {reports.map((report, idx) => (
                <VisitorReportCard key={idx} {...report} />
            ))}
        </div>
    );
};

export default VisitorReportWindowSection;
