import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Volume2, CheckCheck } from 'lucide-react';

const RequestCard = ({ category, from, givenBy, task, status, reason }: any) => {
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

    const categoryHeadingStyle = {
        border: '2px solid #1e3a8a',
        borderRadius: '20px',
        padding: '0.4rem 1.5rem',
        backgroundColor: '#1e3a8a',
        color: '#fff',
        fontWeight: '800',
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        marginBottom: '1rem',
        display: 'inline-block'
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
                {/* Category Heading */}
                <div style={categoryHeadingStyle}>
                    {category} Request
                </div>

                {/* Header Row */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={fieldStyle}>
                        From {from.name} | {from.dept} | {from.time}
                    </div>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <MoreVertical size={20} color="#1e3a8a" />
                    </div>
                </div>

                {/* Information Fields */}
                <div style={fieldStyle}>
                    <span style={labelStyle}>Given By :-</span>
                    <span>{givenBy.name} | {givenBy.dept} | {givenBy.time}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Task:-</span>
                    <span>{task}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Status:-</span>
                    <span>{status}</span>
                </div>

                <div style={fieldStyle}>
                    <span style={labelStyle}>Reason:-</span>
                    <span>{reason}</span>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '2rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={22} style={{ cursor: 'pointer' }} />
                        <ThumbsDown size={22} style={{ cursor: 'pointer' }} />
                        <MessageSquare size={22} style={{ color: '#3b82f6', cursor: 'pointer' }} /> {/* Highlighted blue */}
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

const ReceivedRequestsSection = ({ department }: { department?: string }) => {
    // Mock data with "to" field for filtering
    const allRequests = [
        {
            to: 'Reception',
            category: 'Guest',
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept', time: '22 Hour Ago' },
            givenBy: { name: 'Dr. John Doe', dept: 'PR Dept', time: 'Yesterday' },
            task: 'Register VIP Guest (Suite 101)',
            status: 'Pending',
            reason: 'High priority guest arrival for management meeting.'
        },
        {
            to: 'Reception',
            category: 'Visitor',
            from: { name: 'Mrs. Jane Smith', dept: 'PR Dept', time: 'Yesterday' },
            givenBy: { name: 'Mr. X Manager', dept: 'Admin', time: '2 Days Ago' },
            task: 'Coordinate badges for Group Visit',
            status: 'In Progress',
            reason: 'School group of 120 people expected at Museum.'
        },
        {
            to: 'Transport',
            category: 'Vehicle',
            from: { name: 'Driver X', dept: 'Reception', time: '5 Hour Ago' },
            givenBy: { name: 'Transport Head', dept: 'Logistics', time: 'Morning' },
            task: 'Airport pickup for Trustee Members (Bus-04)',
            status: 'Dispatched',
            reason: 'Scheduled arrival at 2:00 PM.'
        },
        {
            to: 'Kitchen',
            category: 'Meal',
            from: { name: 'Mr. Chef', dept: 'Dhammalay', time: '10 Hour Ago' },
            givenBy: { name: 'Supervisor', dept: 'Catering', time: 'Today' },
            task: 'Special Satvic Meal preparation for 200 guests',
            status: 'In Progress',
            reason: 'Arrival of international delegation.'
        },
        {
            to: 'Dhammalay',
            category: 'Course',
            from: { name: 'Mr. ABC P XYZ', dept: 'Reception', time: '22 Hour Ago' },
            givenBy: { name: 'Teacher A', dept: 'C-Section', time: 'Yesterday' },
            task: 'Register 50 students for 10-Day Dhamma Course',
            status: 'Processing',
            reason: 'High demand for upcoming meditation retreat.'
        }
    ];

    // If a department is provided, filter requests meant for that department
    // Otherwise show all for demonstration
    const filteredRequests = department
        ? allRequests.filter(req => req.to === department)
        : allRequests;

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1rem' }}>
            {filteredRequests.length > 0 ? (
                filteredRequests.map((req, idx) => (
                    <RequestCard key={idx} {...req} />
                ))
            ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#1e3a8a', fontWeight: '700' }}>
                    No incoming requests for {department || 'this department'}.
                </div>
            )}
        </div>
    );
};

export default ReceivedRequestsSection;
