const DailyReportWidget = () => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const sectionContainerStyle = {
        marginBottom: '2rem',
        cursor: 'pointer',
    };

    const titleStyle = {
        textAlign: 'center' as const,
        fontWeight: '700',
        fontSize: '1rem',
        marginBottom: '0.75rem',
        color: '#000',
    };

    const blueBoxStyle = {
        backgroundColor: '#1E40AF', // Medium solid blue (Indigo-800)
        borderRadius: '30px', // Pill-like
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px',
    };

    const textStyle = {
        color: '#FFFFFF',
        textAlign: 'center' as const,
        fontSize: '1.2rem',
        fontWeight: '500',
        lineHeight: '1.5',
        margin: 0,
        whiteSpace: 'pre-line' as const,
    };

    return (
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', fontFamily: systemFont }}>
            {/* Doha Section */}
            <div style={sectionContainerStyle}>
                <h3 style={titleStyle}>Doha</h3>
                <div style={blueBoxStyle}>
                    <p style={textStyle}>
                        Aate Jaate saas par,{"\n"}
                        Rahe nirantar dhyan
                    </p>
                </div>
            </div>

            {/* Event Section */}
            <div style={sectionContainerStyle}>
                <h3 style={titleStyle}>Event</h3>
                <div style={blueBoxStyle}>
                    <p style={textStyle}>
                        18 Jan Mega Course{"\n"}
                        2 Feb Gratitude Course
                    </p>
                </div>
            </div>

            {/* Announcement Section */}
            <div style={sectionContainerStyle}>
                <h3 style={titleStyle}>Announcement</h3>
                <div style={blueBoxStyle}>
                    <p style={textStyle}>
                        We conduct staff meeting today at 4:00 pm,{"\n"}
                        please be present.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DailyReportWidget;
