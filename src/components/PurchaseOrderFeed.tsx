import React from 'react';
import { User, ThumbsUp, ThumbsDown, MessageSquare, Forward, Volume2, CheckCircle, Clock, XCircle, PauseCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type POStatus = 'Pending' | 'Approved' | 'Rejected' | 'On Hold';

interface PORequest {
    id: string;
    requestedBy: string;
    requestDept: string;
    requestTime: string;
    approver?: string;
    approverDept?: string;
    approvalTime?: string;
    summary: string;
    status: POStatus;
}

const mockPOs: PORequest[] = [
    {
        id: '1',
        requestedBy: 'Amit Kumar',
        requestDept: 'Maintenance',
        requestTime: '10m ago',
        approver: 'Suresh Patil',
        approverDept: 'Accounts',
        approvalTime: 'Recently',
        summary: 'Replacement pump for central water tank (Site-B)',
        status: 'Pending'
    },
    {
        id: '2',
        requestedBy: 'Dr. Neha Shah',
        requestDept: 'Dhamma-Pattana',
        requestTime: '1h ago',
        approver: 'Admin Board',
        approverDept: 'Management',
        approvalTime: '20m ago',
        summary: 'Bulk order of 500 meditation mats for upcoming course',
        status: 'Approved'
    },
    {
        id: '3',
        requestedBy: 'Rajesh Varma',
        requestDept: 'Souvenir',
        requestTime: '3h ago',
        summary: 'Printing of 1000 copies of VRI newsletters (Annual)',
        status: 'Rejected'
    },
    {
        id: '4',
        requestedBy: 'Sunita Rao',
        requestDept: 'Security',
        requestTime: '5h ago',
        summary: 'CCTV Upgrade project - Phase 2 (Library)',
        status: 'On Hold'
    }
];

const PurchaseOrderFeed: React.FC = () => {
    const getStatusStyles = (status: POStatus) => {
        switch (status) {
            case 'Approved': return { bg: '#dcfce7', text: '#166534', icon: <CheckCircle size={14} /> };
            case 'Rejected': return { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={14} /> };
            case 'On Hold': return { bg: '#f1f5f9', text: '#475569', icon: <PauseCircle size={14} /> };
            default: return { bg: '#fef9c3', text: '#854d0e', icon: <Clock size={14} /> };
        }
    };

    return (
        <div className="po-feed-root">
            <header className="feed-header">
                <h1 className="feed-title">Purchase Orders Activity</h1>
            </header>

            <div className="feed-list">
                {mockPOs.map((po) => {
                    const statusStyle = getStatusStyles(po.status);
                    return (
                        <motion.div
                            key={po.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="po-card"
                        >
                            <div className="card-top">
                                <div className="avatar-side">
                                    <div className="avatar-circle">
                                        <User size={24} color="#ffffff" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="content-side">
                                    <div className="meta-stack">
                                        <div className="meta-row">
                                            <span className="meta-title">Request By | Dept | Time</span>
                                            <span className="meta-val">{po.requestedBy} | {po.requestDept} | {po.requestTime}</span>
                                        </div>
                                        {po.approver && (
                                            <div className="meta-row gold-accent">
                                                <span className="meta-title">Prepaid / Approved By | Dept | Time</span>
                                                <span className="meta-val">{po.approver} | {po.approverDept} | {po.approvalTime}</span>
                                            </div>
                                        )}
                                        <div className="summary-row">
                                            <p className="po-summary">{po.summary}</p>
                                        </div>
                                    </div>
                                    <div className="status-container">
                                        <div
                                            className="status-pill"
                                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                                        >
                                            {statusStyle.icon}
                                            <span>{po.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="action-row">
                                    <button className="action-btn-icon"><ThumbsUp size={18} /></button>
                                    <button className="action-btn-icon"><ThumbsDown size={18} /></button>
                                    <button className="action-btn-icon"><MessageSquare size={18} /></button>
                                    <button className="action-btn-icon"><Forward size={18} /></button>
                                    <button className="action-btn-icon"><Volume2 size={18} /></button>
                                </div>
                                <div className="final-check">
                                    <CheckCircle className="text-blue-700 opacity-30" size={20} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <style>{`
                .po-feed-root {
                    background-color: #f8fafc;
                    min-height: 100%;
                    padding: 2.5rem 3rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .feed-header {
                    margin-bottom: 2rem;
                }

                .feed-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #0f172a;
                    border-left: 5px solid #1e3a8a;
                    padding-left: 1.25rem;
                    letter-spacing: -0.01em;
                }

                .feed-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    max-width: 1100px;
                }

                .po-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 1.5rem 2rem;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.25s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .po-card:hover {
                    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.08);
                    transform: translateY(-2px);
                    border-color: #cbd5e1;
                }

                .card-top {
                    display: flex;
                    gap: 1.5rem;
                }

                .avatar-side {
                    flex-shrink: 0;
                }

                .avatar-circle {
                    width: 48px;
                    height: 48px;
                    background: #1e3a8a;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .content-side {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                }

                .meta-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    flex: 1;
                }

                .meta-row {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .meta-title {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #94a3b8;
                }

                .meta-val {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .gold-accent .meta-title {
                    color: #b45309;
                }

                .gold-accent .meta-val {
                    color: #92400e;
                }

                .summary-row {
                    margin-top: 0.5rem;
                }

                .po-summary {
                    font-size: 1rem;
                    color: #475569;
                    font-weight: 500;
                    line-height: 1.4;
                    margin: 0;
                }

                .status-container {
                    flex-shrink: 0;
                }

                .status-pill {
                    padding: 0.5rem 1rem;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    letter-spacing: 0.025em;
                }

                .card-footer {
                    margin-top: 1.5rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .action-row {
                    display: flex;
                    gap: 1.5rem;
                }

                .action-btn-icon {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    transition: all 0.2s;
                }

                .action-btn-icon:hover {
                    color: #1e3a8a;
                    transform: scale(1.15);
                }

                @media (max-width: 768px) {
                    .card-top {
                        flex-direction: column;
                    }
                    .content-side {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .po-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default PurchaseOrderFeed;
