import { User, Plus, CheckCheck, ChevronDown } from 'lucide-react';

const StaffCard = ({ name, status, reason, task }: any) => {
    const labelStyle = {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#1e3a8a', // Dark blue
        marginBottom: '0.2rem',
        display: 'block'
    };

    const inputContainerStyle = {
        border: '1px solid #1e3a8a',
        borderRadius: '20px',
        padding: '0.4rem 1rem',
        width: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        width: '100%',
        fontSize: '0.9rem',
        color: '#1a1a1a',
        backgroundColor: 'transparent'
    };

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e5e7eb',
            alignItems: 'center'
        }}>
            {/* Left: Avatar */}
            <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                <User size={40} color="#000" fill="#000" />
            </div>

            {/* Right: Fields */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Name */}
                <div>
                    <label style={labelStyle}>Name:-</label>
                    <div style={inputContainerStyle}>
                        <input style={inputStyle} defaultValue={name} />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label style={labelStyle}>Status:- Present / Weekly off / Seek Leave / Course</label>
                    <div style={inputContainerStyle}>
                        <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} defaultValue={status}>
                            <option value="Present">Present</option>
                            <option value="Weekly off">Weekly off</option>
                            <option value="Seek Leave">Seek Leave</option>
                            <option value="Course">Course</option>
                        </select>
                        <ChevronDown size={16} color="#1e3a8a" />
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label style={labelStyle}>Reason:- Of Leave / Late / Early</label>
                    <div style={inputContainerStyle}>
                        <input style={inputStyle} defaultValue={reason} placeholder="Enter reason if any..." />
                    </div>
                </div>

                {/* Working On */}
                <div>
                    <label style={labelStyle}>Working On:- TK 00</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={inputContainerStyle}>
                            <input style={inputStyle} defaultValue={task} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                            <button style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1.5px solid #1e3a8a',
                                background: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <Plus size={18} color="#1e3a8a" strokeWidth={3} />
                            </button>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981'
                            }}>
                                <CheckCheck size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StaffStatusSection = () => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const staffData = [
        { name: 'Mr. ABC P XYZ', status: 'Present', reason: '', task: 'TK-402' },
        { name: 'Mrs. JKL M NOP', status: 'Seek Leave', reason: 'Medical', task: '' },
        { name: 'Mr. QRS T UVW', status: 'Present', reason: 'Late (10 mins)', task: 'TK-105' },
    ];

    return (
        <div style={{
            backgroundColor: '#fff',
            minHeight: '100%',
            width: '100%',
            overflowY: 'auto',
            fontFamily: systemFont
        }}>
            {staffData.map((staff, idx) => (
                <StaffCard key={idx} {...staff} />
            ))}
        </div>
    );
};

export default StaffStatusSection;
