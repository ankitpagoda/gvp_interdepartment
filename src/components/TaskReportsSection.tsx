import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Mic, CheckCheck } from 'lucide-react';

const TaskReportCard = ({ from, givenBy, task, status, reason, time }: any) => {
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
                marginTop: '0.5rem'
            }}>
                <User size={45} color="#000" fill="#000" />
            </div>

            {/* Right Column: Main Content */}
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

                {/* Given By Row */}
                <div style={rowContainerStyle}>
                    Given By :- {givenBy.name} | {givenBy.dept} | {time}
                </div>

                {/* Task Field */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Task:-</span>
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
                    <div style={{ color: '#10b981' }}>
                        <CheckCheck size={26} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TaskReportsSection = () => {
    const reports = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept' },
            givenBy: { name: 'Dr. Manager', dept: 'Admin' },
            task: 'Complete the migration of the database to the new server environment.',
            status: 'In Progress',
            reason: 'Waiting for vendor confirmation on firewall rules.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. John Doe', dept: 'Accounts' },
            givenBy: { name: 'Finance Head', dept: 'Management' },
            task: 'Audit the voucher entries for the month of January.',
            status: 'Pending',
            reason: 'Data collection from DPVT department is still under review.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto' }}>
            {reports.map((report, idx) => (
                <TaskReportCard key={idx} {...report} />
            ))}
        </div>
    );
};

export default TaskReportsSection;
