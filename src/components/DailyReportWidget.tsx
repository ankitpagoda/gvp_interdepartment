import React, { useState, useEffect } from 'react';
import { getAnnouncements } from '../lib/mockDb';
import type { Announcement } from '../types';

const DailyReportWidget = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const primaryBlue = '#1E3A8A';
    const bodyFont = "'Inter', sans-serif";

    useEffect(() => {
        setAnnouncements(getAnnouncements().slice(0, 2));
    }, []);

    const containerStyle: React.CSSProperties = {
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
        padding: '2rem 1.5rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        width: '100%',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
    };

    const sectionTitleStyle: React.CSSProperties = {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '0.85rem',
        marginBottom: '1rem',
        color: primaryBlue,
        fontFamily: bodyFont,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    };

    const cardContainerStyle: React.CSSProperties = {
        backgroundColor: primaryBlue,
        borderRadius: '20px',
        padding: '2rem 1.25rem',
        boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    return (
        <div style={containerStyle} className="fade-in">
            {/* Doha Section */}
            <div style={{ width: '100%' }}>
                <h3 style={sectionTitleStyle}>Doha</h3>
                <div style={cardContainerStyle}>
                    <p
                        style={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            lineHeight: 1.6,
                            margin: 0,
                        }}
                    >
                        Aate Jaate saas par,<br />Rahe nirantar dhyan
                    </p>
                </div>
            </div>

            {/* Live Announcements Section */}
            <div style={{ width: '100%' }}>
                <h3 style={sectionTitleStyle}>Live Announcements</h3>
                <div style={cardContainerStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                        {announcements.length > 0 ? (
                            announcements.map(ann => (
                                <div
                                    key={ann.id}
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        paddingBottom: '0.5rem',
                                    }}
                                >
                                    <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
                                        {ann.title}
                                    </p>
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '0.75rem',
                                            margin: '0.25rem 0 0',
                                        }}
                                    >
                                        {ann.content.substring(0, 40)}...
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                <p style={{ color: 'white', fontSize: '0.9rem', textAlign: 'center' }}>
                                    18 Jan – Mega Course
                                </p>
                                <p style={{ color: 'white', fontSize: '0.9rem', textAlign: 'center' }}>
                                    02 Feb – Gratitude Course
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Upcoming Events Section */}
            <div style={{ width: '100%' }}>
                <h3 style={sectionTitleStyle}>Upcoming Events</h3>
                <div style={cardContainerStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                            10 Feb – Morning Meditation
                        </p>
                        <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                            18 Feb – Inner Silence Retreat
                        </p>
                        <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                            25 Feb – Guided Breathwork
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyReportWidget;
