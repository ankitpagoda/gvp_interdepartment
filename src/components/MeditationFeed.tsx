import React from 'react';
import { User, ThumbsUp, ThumbsDown, MessageSquare, Share2, RefreshCw, Volume2, CheckCheck, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface MeditationRecord {
    id: string;
    staffName: string;
    department: string;
    timeAgo: string;
    meditationToday: string;
    lastCourse: string;
    totalCourses: string;
}

const mockRecords: MeditationRecord[] = [
    {
        id: '1',
        staffName: 'Dr. Ramesh Kumar',
        department: 'Kitchen',
        timeAgo: '2 Hours Ago',
        meditationToday: '1 Hour (Morning & Evening)',
        lastCourse: '10-Day Course (Jan 2026)',
        totalCourses: '15 Courses'
    },
    {
        id: '2',
        staffName: 'Sanjay Gupta',
        department: 'Security',
        timeAgo: '5 Hours Ago',
        meditationToday: '45 Minutes (Afternoon)',
        lastCourse: '3-Day Course (Nov 2025)',
        totalCourses: '8 Courses'
    },
    {
        id: '3',
        staffName: 'Priya Sharma',
        department: 'Garden',
        timeAgo: '12 Hours Ago',
        meditationToday: '1 Hour 30 Minutes (Completed)',
        lastCourse: 'Satipatthana Course (Dec 2025)',
        totalCourses: '22 Courses'
    }
];

const MeditationFeed: React.FC = () => {
    return (
        <div className="meditation-feed-root">
            <header className="feed-header">
                <h1 className="feed-title">Meditation Report Feed</h1>
            </header>

            <div className="feed-container">
                {mockRecords.map((record) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="meditation-card"
                    >
                        {/* Top Header Row */}
                        <div className="card-top-row">
                            <div className="avatar-section">
                                <div className="avatar-circle">
                                    <User size={28} color="#ffffff" strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="header-pill-wrapper">
                                <div className="header-pill">
                                    <span className="pill-text">{record.staffName} | {record.department} | {record.timeAgo}</span>
                                </div>
                            </div>

                            <button className="overflow-menu-btn">
                                <MoreVertical size={20} color="#94a3b8" />
                            </button>
                        </div>

                        {/* Content Fields */}
                        <div className="card-content-grid">
                            <div className="read-only-field">
                                <label>Meditation Today:</label>
                                <div className="field-value-box">{record.meditationToday}</div>
                            </div>
                            <div className="read-only-field">
                                <label>Last Course:</label>
                                <div className="field-value-box">{record.lastCourse}</div>
                            </div>
                            <div className="read-only-field">
                                <label>Total Course:</label>
                                <div className="field-value-box">{record.totalCourses}</div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="card-action-bar">
                            <div className="action-icons">
                                <button className="action-btn"><ThumbsUp size={18} /></button>
                                <button className="action-btn"><ThumbsDown size={18} /></button>
                                <button className="action-btn"><MessageSquare size={18} /></button>
                                <button className="action-btn"><Share2 size={18} /></button>
                                <button className="action-btn"><RefreshCw size={18} /></button>
                                <button className="action-btn"><Volume2 size={18} /></button>
                            </div>
                            <div className="status-indicator">
                                <CheckCheck size={22} className="text-green-600" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .meditation-feed-root {
                    background-color: #f8fafc;
                    min-height: 100%;
                    width: 100%;
                    padding: 2.5rem 2rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .feed-header {
                    margin-bottom: 2.5rem;
                    max-width: 850px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .feed-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #0f172a;
                    text-align: left;
                    border-left: 5px solid #3b82f6;
                    padding-left: 1rem;
                }

                .feed-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    align-items: center;
                }

                .meditation-card {
                    background: #ffffff;
                    border: 1px solid #bfdbfe; /* Thin blue outline */
                    border-radius: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    width: 100%;
                    max-width: 850px;
                    padding: 1.75rem;
                    position: relative;
                }

                .card-top-row {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    margin-bottom: 1.5rem;
                }

                .avatar-circle {
                    width: 52px;
                    height: 52px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .header-pill-wrapper {
                    flex: 1;
                }

                .header-pill {
                    background: #f1f5f9;
                    border-radius: 999px;
                    padding: 0.5rem 1.25rem;
                    display: inline-block;
                }

                .pill-text {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #334155;
                }

                .overflow-menu-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                }

                .card-content-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .read-only-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .read-only-field label {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }

                .field-value-box {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    font-size: 0.95rem;
                    color: #1e293b;
                    font-weight: 500;
                }

                .card-action-bar {
                    border-top: 1px solid #f1f5f9;
                    padding-top: 1.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .action-icons {
                    display: flex;
                    gap: 1.5rem;
                }

                .action-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    color: #3b82f6;
                    transform: scale(1.1);
                }

                @media (max-width: 640px) {
                    .card-action-bar {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }
                    .status-indicator {
                        align-self: flex-end;
                    }
                    .action-icons {
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default MeditationFeed;
