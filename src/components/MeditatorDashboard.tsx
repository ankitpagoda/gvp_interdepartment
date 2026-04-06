import React from 'react';
import { User, MessageSquare, Share2, RefreshCw, Volume2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MeditatorRequest {
    id: string;
    name: string;
    roomNo: string;
    timeAgo: string;
    day: string;
    requirements: string;
}

const mockRequests: MeditatorRequest[] = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        roomNo: 'A-101',
        timeAgo: '2h ago',
        day: 'Day 3 of 10-Day Course',
        requirements: 'Need extra meditation cushion and blanket for evening sessions. Also requesting vegetarian meal options for remaining course days.'
    },
    {
        id: '2',
        name: 'Priya Sharma',
        roomNo: 'B-205',
        timeAgo: '5h ago',
        day: 'Day 7 of Satipatthana Course',
        requirements: 'Requesting room heater as temperature drops significantly during early morning meditation. Also need assistance with hot water supply.'
    },
    {
        id: '3',
        name: 'Amit Patel',
        roomNo: 'C-303',
        timeAgo: '1d ago',
        day: 'Day 1 of 3-Day Course',
        requirements: 'Need help with meditation posture guidance. Experiencing back pain during long sitting sessions. Would appreciate consultation with course manager.'
    }
];

const MeditatorDashboard: React.FC = () => {
    return (
        <div className="meditator-dashboard-root">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Meditator Requests</h1>
                <p className="dashboard-subtitle">Dhamma-pattan Department</p>
            </header>

            <div className="requests-container">
                {mockRequests.map((request) => (
                    <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.12)' }}
                        className="request-card"
                    >
                        <div className="card-content">
                            {/* Avatar */}
                            <div className="avatar-section">
                                <div className="avatar-circle">
                                    <User size={28} color="#3b82f6" strokeWidth={2} />
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="info-section">
                                {/* Row 1 - Highlighted */}
                                <div className="info-row highlighted">
                                    <span className="info-text">{request.name}</span>
                                    <span className="separator">|</span>
                                    <span className="info-text">{request.roomNo}</span>
                                    <span className="separator">|</span>
                                    <span className="info-text time">{request.timeAgo}</span>
                                </div>

                                {/* Row 2 - Day */}
                                <div className="info-row">
                                    <span className="day-text">{request.day}</span>
                                </div>

                                {/* Row 3 - Requirements */}
                                <div className="info-row requirements">
                                    <p className="requirements-text">{request.requirements}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="card-footer">
                            <div className="action-icons">
                                <button className="icon-btn" title="Comment">
                                    <MessageSquare size={18} />
                                </button>
                                <button className="icon-btn" title="Share">
                                    <Share2 size={18} />
                                </button>
                                <button className="icon-btn" title="Refresh">
                                    <RefreshCw size={18} />
                                </button>
                                <button className="icon-btn" title="Voice">
                                    <Volume2 size={18} />
                                </button>
                            </div>
                            <div className="status-indicator">
                                <CheckCircle size={22} className="check-icon" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
        .meditator-dashboard-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 2.5rem 2rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dashboard-header {
          margin-bottom: 2.5rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .dashboard-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
          font-weight: 600;
        }

        .requests-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .request-card {
          background: #ffffff;
          border: 2px solid #3b82f6;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .card-content {
          display: flex;
          gap: 1.5rem;
          padding: 1.75rem;
        }

        .avatar-section {
          flex-shrink: 0;
        }

        .avatar-circle {
          width: 56px;
          height: 56px;
          background: #eff6ff;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-row {
          padding: 0.85rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .info-row.highlighted {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .info-row.requirements {
          background: #ffffff;
          border: 2px solid #3b82f6;
          padding: 1.25rem;
        }

        .info-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e293b;
        }

        .info-text.time {
          color: #3b82f6;
        }

        .separator {
          color: #cbd5e1;
          font-weight: 400;
        }

        .day-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
        }

        .requirements-text {
          font-size: 0.95rem;
          color: #1e293b;
          line-height: 1.6;
          margin: 0;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.75rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .action-icons {
          display: flex;
          gap: 1.5rem;
        }

        .icon-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          color: #3b82f6;
          transform: scale(1.15);
        }

        .status-indicator {
          display: flex;
          align-items: center;
        }

        .check-icon {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .meditator-dashboard-root {
            padding: 1.5rem 1rem;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .card-content {
            flex-direction: column;
            align-items: center;
            padding: 1.5rem;
          }

          .info-section {
            width: 100%;
          }

          .info-row.highlighted {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .separator {
            display: none;
          }

          .card-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .status-indicator {
            align-self: flex-end;
          }
        }
      `}</style>
        </div>
    );
};

export default MeditatorDashboard;
