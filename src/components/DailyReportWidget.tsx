import React from 'react';

const DailyReportWidget = () => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const sectionContainerStyle = {
        marginBottom: '2.5rem',
        width: '100%',
    };

    const titleStyle = {
        textAlign: 'center' as const,
        fontWeight: '700',
        fontSize: '1.1rem',
        marginBottom: '1rem',
        color: '#1a1a1a',
        letterSpacing: '0.05em',
        fontFamily: systemFont,
    };

    const cardStyle = {
        backgroundColor: '#1E3A8A', // Deep institutional blue
        borderRadius: '40px', // Large pill-like border radius
        padding: '2.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box' as const,
    };

    const textStyle = {
        color: '#FFFFFF',
        textAlign: 'center' as const,
        fontSize: '1.25rem',
        fontWeight: '500',
        lineHeight: '1.6',
        margin: 0,
        whiteSpace: 'pre-line' as const,
        fontFamily: systemFont,
    };

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '400px', // Compact widget width
            margin: '0 auto'
        }}>

            {/* Doha Section */}
            <div style={sectionContainerStyle}>
                <h3 style={titleStyle}>Doha</h3>
                <div style={cardStyle}>
                    <p style={textStyle}>
                        Aate Jaate saas par,{"\n"}
                        Rahe nirantar dhyan
                    </p>
                </div>
            </div>

            {/* Event Section */}
            <div style={sectionContainerStyle}>
                <h3 style={titleStyle}>Event</h3>
                <div style={cardStyle}>
                    <p style={textStyle}>
                        18 Jan Mega Course{"\n"}
                        2 Feb Gratitude Course
                    </p>
                </div>
            </div>

            {/* Event Section */}
            <div style={sectionContainerStyle}>
                <h3 style={titleStyle}>Announcement</h3>
                <div style={cardStyle}>
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
