import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Volume2, CheckCheck } from 'lucide-react';

const MeditationCard = ({ from, today, lastCourse, totalCourse, time }: any) => {
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
        color: '#000', // Black as per requirement
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
                        From {from.name} | {from.dept} | {time}
                    </div>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                        <MoreVertical size={20} color="#1e3a8a" />
                    </div>
                </div>

                {/* Information Fields */}
                <div style={fieldStyle}>
                    <span style={labelStyle}>Meditation Today:-</span>
                    <span>{today}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Last Course:-</span>
                    <span>{lastCourse}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Total Course:-</span>
                    <span>{totalCourse}</span>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '2rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={22} style={{ color: '#1e3a8a' }} />
                        <ThumbsDown size={22} style={{ color: '#1e3a8a' }} />
                        <MessageSquare size={22} style={{ color: '#3b82f6' }} /> {/* Highlighted in blue (Tailwind blue-500) */}
                        <Link size={22} style={{ color: '#1e3a8a' }} />
                        <RotateCw size={22} style={{ color: '#1e3a8a' }} />
                        <Volume2 size={22} style={{ color: '#1e3a8a' }} />
                    </div>
                    <div style={{ position: 'absolute', right: 0, color: '#10b981' }}>
                        <CheckCheck size={28} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MeditationWindowSection = () => {
    const meditationRecords = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'Development' },
            today: 'Morning: 1hr | Evening: 45min',
            lastCourse: '10-Day Course, Dhamma Giri (Jan 2026)',
            totalCourse: '05 Courses',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mrs. Jane Smith', dept: 'Admin' },
            today: 'Morning: 1hr | Evening: 1hr',
            lastCourse: 'Satipatthana Course, Pagoda (Nov 2025)',
            totalCourse: '12 Courses',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1rem' }}>
            {meditationRecords.map((record, idx) => (
                <MeditationCard key={idx} {...record} />
            ))}
        </div>
    );
};

export default MeditationWindowSection;
