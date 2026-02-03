import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AttendanceSection = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const fieldStyle = {
        width: '100%',
        padding: '0.9rem 1.25rem',
        borderRadius: '8px',
        border: '2px solid #1a1a1a',
        backgroundColor: '#fff',
        fontSize: '1rem',
        fontFamily: systemFont,
        color: '#1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    };

    const labelStyle = {
        fontWeight: '700',
        fontSize: '0.95rem'
    };

    const valueStyle = {
        fontWeight: '600',
        color: '#1a1a1a'
    };

    const attendanceMetrics = [
        { label: "Present :-", value: "24 Days" },
        { label: "Holiday :-", value: "05 Days" },
        { label: "Late Mark :-", value: "01" },
        { label: "Early CheckOut :-", value: "02" },
        { label: "Leave :-", value: "0.5 Day" },
        { label: "Course :-", value: "01 (10-Day Vipassana)" }
    ];

    return (
        <div
            style={{
                backgroundColor: '#fff',
                minHeight: '100%',
                padding: '2rem',
                color: '#1a1a1a',
                fontFamily: systemFont
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Attendance</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={() => changeMonth(-1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div style={{
                        border: '2px solid #1a1a1a',
                        borderRadius: '20px',
                        padding: '0.4rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '700'
                    }}>
                        Month :- {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button
                        onClick={() => changeMonth(1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Balance for flexbox */}
                <div style={{ width: '150px', visibility: 'hidden' }} />
            </div>

            {/* Main Container */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    border: '2px solid #1a1a1a',
                    borderRadius: '24px',
                    padding: '3rem',
                    backgroundColor: '#fff'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {attendanceMetrics.map((metric, index) => (
                            <div key={index} style={fieldStyle}>
                                <span style={labelStyle}>{metric.label}</span>
                                <span style={valueStyle}>{metric.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceSection;

