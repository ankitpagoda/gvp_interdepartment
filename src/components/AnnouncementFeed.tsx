import React from 'react';
import { User, ThumbsUp, ThumbsDown, MessageSquare, Share2, RefreshCw, Volume2, CheckCheck, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface Announcement {
    id: string;
    fromPerson: string;
    fromDept: string;
    toTarget: string;
    description: string;
    fromTime: string;
    toTime: string;
}

const mockAnnouncements: Announcement[] = [
    {
        id: '1',
        fromPerson: 'Dr. Ashok Mehta',
        fromDept: 'Medical Trust',
        toTarget: 'All Internal Staff Members',
        description: 'The annual health check-up camp has been scheduled for the next week. All department heads are requested to coordinate with their respective teams for the time slots.',
        fromTime: '2h ago',
        toTime: 'Recently Updated'
    },
    {
        id: '2',
        fromPerson: 'Sarah Wilson',
        fromDept: 'IT Support',
        toTarget: 'GVP & VRI Departments',
        description: 'Scheduled maintenance for the central server is planned this Sunday from 2:00 AM to 6:00 AM. Access to internal portals might be intermittent during this period.',
        fromTime: '5h ago',
        toTime: 'Just now'
    },
    {
        id: '3',
        fromPerson: 'Trustee Board',
        fromDept: 'Management',
        toTarget: 'All Departments',
        description: 'New guidelines regarding internal documentation and inter-departmental communication protocols have been uploaded to the policies section. Please review by the end of the day.',
        fromTime: '1d ago',
        toTime: '2h ago'
    }
];

const AnnouncementFeed: React.FC = () => {
    return (
        <div className="announcement-feed-root">
            <header className="feed-header">
                <h1 className="feed-title">Inter-Department Feed</h1>
            </header>

            <div className="feed-container">
                {mockAnnouncements.map((ann) => (
                    <motion.div
                        key={ann.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="announcement-card"
                    >
                        {/* Overflow Menu */}
                        <button className="overflow-btn">
                            <MoreVertical size={20} />
                        </button>

                        <div className="card-content">
                            {/* Left Side: Avatar */}
                            <div className="avatar-column">
                                <div className="avatar-circle-blue">
                                    <User size={32} color="#ffffff" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Right Side: Content Box */}
                            <div className="info-column">
                                {/* From Row */}
                                <div className="meta-field-container">
                                    <span className="field-label-bold">From :-</span>
                                    <span className="field-value">
                                        {ann.fromPerson} | {ann.fromDept} | {ann.fromTime}
                                    </span>
                                </div>

                                {/* To Row */}
                                <div className="meta-field-container">
                                    <span className="field-label-bold">To :-</span>
                                    <span className="field-value">
                                        {ann.toTarget} | {ann.toTime}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="description-container">
                                    <div className="description-header">Description :-</div>
                                    <div className="description-text">
                                        {ann.description}
                                    </div>
                                </div>

                                {/* Action Bar & Progress */}
                                <div className="card-bottom">
                                    <div className="action-icons">
                                        <button className="action-btn"><ThumbsUp size={18} /></button>
                                        <button className="action-btn"><ThumbsDown size={18} /></button>
                                        <button className="action-btn"><MessageSquare size={18} /></button>
                                        <button className="action-btn"><Share2 size={18} /></button>
                                        <button className="action-btn"><RefreshCw size={18} /></button>
                                        <button className="action-btn"><Volume2 size={18} /></button>
                                    </div>
                                    <div className="status-badge">
                                        <div className="seen-indicator">
                                            <CheckCheck size={20} className="text-green-600" />
                                            <span className="seen-text">Seen / Acknowledged</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .announcement-feed-root {
                    background-color: #f8f9fa;
                    min-height: 100%;
                    width: 100%;
                    padding: 2.5rem 2rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .feed-header {
                    margin-bottom: 2.5rem;
                    max-width: 900px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .feed-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1e293b;
                    border-bottom: 3px solid #3b82f6;
                    display: inline-block;
                    padding-bottom: 0.25rem;
                }

                .feed-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    align-items: center;
                    max-width: 100%;
                }

                .announcement-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                    width: 100%;
                    max-width: 900px;
                    padding: 2.5rem;
                    position: relative;
                    transition: all 0.2s ease;
                }

                .announcement-card:hover {
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                    transform: translateY(-2px);
                }

                .overflow-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                }

                .card-content {
                    display: flex;
                    gap: 2rem;
                }

                .avatar-column {
                    flex-shrink: 0;
                }

                .avatar-circle-blue {
                    width: 64px;
                    height: 64px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
                }

                .info-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .meta-field-container {
                    background: #fdfdfd;
                    border: 1px solid #edf2f7;
                    padding: 0.85rem 1.25rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
                }

                .field-label-bold {
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: #3b82f6;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    white-space: nowrap;
                }

                .field-value {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .description-container {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
                    overflow: hidden;
                }

                .description-header {
                    background: #f8fafc;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.8rem;
                    font-weight: 800;
                    color: #3b82f6;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #edf2f7;
                }

                .description-text {
                    padding: 1.25rem;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #475569;
                    min-height: 100px;
                }

                .card-bottom {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .action-icons {
                    display: flex;
                    gap: 1.25rem;
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
                    transform: scale(1.15);
                }

                .seen-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f0fdf4;
                    padding: 0.5rem 1rem;
                    border-radius: 999px;
                    border: 1px solid #dcfce7;
                }

                .seen-text {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #166534;
                }

                @media (max-width: 768px) {
                    .card-content {
                        flex-direction: column;
                        align-items: center;
                    }

                    .info-column {
                        width: 100%;
                    }

                    .card-bottom {
                        flex-direction: column;
                        align-items: center;
                        gap: 1.5rem;
                    }
                    
                    .announcement-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default AnnouncementFeed;
