import React from 'react';
import { User, ThumbsUp, ThumbsDown, MessageSquare, Share2, RefreshCw, Volume2, CheckCheck, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface HousekeepingRecord {
    id: string;
    requestBy: string;
    requestDept: string;
    requestTime: string;
    doneBy: string;
    doneDept: string;
    doneTime: string;
    status: string;
    remark: string;
}

const mockRecords: HousekeepingRecord[] = [
    {
        id: '1',
        requestBy: 'Amit Patel',
        requestDept: 'Kitchen',
        requestTime: '3h ago',
        doneBy: 'Rajesh Kumar',
        doneDept: 'Housekeeping',
        doneTime: '1h ago',
        status: 'Completed',
        remark: 'Deep cleaning of main dining hall completed as requested'
    },
    {
        id: '2',
        requestBy: 'Dr. Neha Shah',
        requestDept: 'Dhamma-Pattana',
        requestTime: '5h ago',
        doneBy: 'Suresh Varma',
        doneDept: 'Maintenance',
        doneTime: '2h ago',
        status: 'In Progress',
        remark: 'AC repair scheduled for tomorrow morning'
    },
    {
        id: '3',
        requestBy: 'Priya Sharma',
        requestDept: 'Library',
        requestTime: '1d ago',
        doneBy: 'Vikram Singh',
        doneDept: 'Housekeeping',
        doneTime: '18h ago',
        status: 'Completed',
        remark: 'All reading room windows cleaned and sanitized'
    }
];

const HousekeepingFeed: React.FC = () => {
    return (
        <div className="housekeeping-feed-root">
            <header className="feed-header">
                <h1 className="feed-title">Housekeeping & Maintenance Activity</h1>
            </header>

            <div className="feed-container">
                {mockRecords.map((record) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.08)' }}
                        className="housekeeping-card"
                    >
                        {/* Overflow Menu */}
                        <button className="overflow-menu">
                            <MoreVertical size={20} />
                        </button>

                        <div className="card-layout">
                            {/* Left: Avatar */}
                            <div className="avatar-section">
                                <div className="avatar-circle">
                                    <User size={26} color="#ffffff" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Right: Information Stack */}
                            <div className="info-stack">
                                <div className="info-pill">
                                    <span className="pill-label">Request By | Dept | Time</span>
                                    <span className="pill-value">{record.requestBy} | {record.requestDept} | {record.requestTime}</span>
                                </div>

                                <div className="info-pill">
                                    <span className="pill-label">Done By | Dept | Time</span>
                                    <span className="pill-value">{record.doneBy} | {record.doneDept} | {record.doneTime}</span>
                                </div>

                                <div className="info-pill single-line">
                                    <span className="pill-label">Status</span>
                                    <span className="pill-value">{record.status}</span>
                                </div>

                                <div className="info-pill single-line">
                                    <span className="pill-label">Remark</span>
                                    <span className="pill-value">{record.remark}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action Row */}
                        <div className="action-row">
                            <div className="action-icons">
                                <button className="icon-btn"><ThumbsUp size={18} /></button>
                                <button className="icon-btn"><ThumbsDown size={18} /></button>
                                <button className="icon-btn"><MessageSquare size={18} /></button>
                                <button className="icon-btn"><Share2 size={18} /></button>
                                <button className="icon-btn"><RefreshCw size={18} /></button>
                                <button className="icon-btn"><Volume2 size={18} /></button>
                            </div>
                            <div className="status-check">
                                <CheckCheck size={22} className="text-green-600" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .housekeeping-feed-root {
                    background-color: #f8fafc;
                    min-height: 100%;
                    width: 100%;
                    padding: 2.5rem 2rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .feed-header {
                    margin-bottom: 2.5rem;
                    max-width: 950px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .feed-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #0f172a;
                    border-left: 5px solid #3b82f6;
                    padding-left: 1.25rem;
                }

                .feed-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    align-items: center;
                }

                .housekeeping-card {
                    background: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    width: 100%;
                    max-width: 950px;
                    padding: 2rem;
                    position: relative;
                    transition: all 0.25s ease;
                }

                .overflow-menu {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    transition: color 0.2s;
                }

                .overflow-menu:hover {
                    color: #475569;
                }

                .card-layout {
                    display: flex;
                    gap: 1.75rem;
                    margin-bottom: 1.5rem;
                }

                .avatar-section {
                    flex-shrink: 0;
                }

                .avatar-circle {
                    width: 56px;
                    height: 56px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.15);
                }

                .info-stack {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .info-pill {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 0.85rem 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }

                .info-pill.single-line {
                    flex-direction: row;
                    align-items: center;
                    gap: 1rem;
                }

                .pill-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .info-pill.single-line .pill-label {
                    min-width: 80px;
                }

                .pill-value {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .action-row {
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

                .icon-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    transition: all 0.2s;
                }

                .icon-btn:hover {
                    color: #3b82f6;
                    transform: scale(1.12);
                }

                .status-check {
                    display: flex;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .card-layout {
                        flex-direction: column;
                        align-items: center;
                    }

                    .info-stack {
                        width: 100%;
                    }

                    .action-row {
                        flex-direction: column;
                        gap: 1.25rem;
                        align-items: flex-start;
                    }

                    .status-check {
                        align-self: flex-end;
                    }

                    .housekeeping-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default HousekeepingFeed;
