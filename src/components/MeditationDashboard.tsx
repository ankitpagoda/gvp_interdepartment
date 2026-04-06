import React from 'react';
import { User, Calendar, Clock, TrendingUp, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MeditationRecord {
    id: string;
    staffName: string;
    department: string;
    date: string;
    morning: string;
    afternoon: string;
    evening: string;
    lastCourse: string;
    nextCourse: string;
    totalCourses: number;
}

const mockRecords: MeditationRecord[] = [
    {
        id: '1',
        staffName: 'Dr. Ramesh Kumar',
        department: 'Kitchen',
        date: '08/02/2026',
        morning: '1 Hour',
        afternoon: '45 Minutes',
        evening: '1 Hour',
        lastCourse: '10-Day Course (Jan 2026)',
        nextCourse: 'Satipatthana (Mar 2026)',
        totalCourses: 15
    },
    {
        id: '2',
        staffName: 'Sanjay Gupta',
        department: 'Security',
        date: '08/02/2026',
        morning: '30 Minutes',
        afternoon: 'Not Done',
        evening: '1 Hour 15 Minutes',
        lastCourse: '3-Day Course (Nov 2025)',
        nextCourse: '10-Day Course (Apr 2026)',
        totalCourses: 8
    },
    {
        id: '3',
        staffName: 'Priya Sharma',
        department: 'Garden',
        date: '08/02/2026',
        morning: '1 Hour 30 Minutes',
        afternoon: '1 Hour',
        evening: '1 Hour 30 Minutes',
        lastCourse: 'Satipatthana Course (Dec 2025)',
        nextCourse: 'Long Course (May 2026)',
        totalCourses: 22
    }
];

const MeditationDashboard: React.FC = () => {
    const selectedDate = new Date();

    const formattedDate = selectedDate.toLocaleDateString('en-GB');

    const getTotalMinutes = (record: MeditationRecord) => {
        const parseTime = (time: string) => {
            if (time === 'Not Done') return 0;
            const hourMatch = time.match(/(\d+)\s*Hour/);
            const minMatch = time.match(/(\d+)\s*Minute/);
            return (hourMatch ? parseInt(hourMatch[1]) * 60 : 0) + (minMatch ? parseInt(minMatch[1]) : 0);
        };
        return parseTime(record.morning) + parseTime(record.afternoon) + parseTime(record.evening);
    };

    return (
        <div className="meditation-dashboard-root">
            {/* Header with Date Navigation */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="title-section">
                        <Sparkles className="title-icon" size={32} />
                        <h1 className="dashboard-title">Meditation Dashboard</h1>
                    </div>

                    <div className="date-navigator">
                        <button className="nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="date-display">
                            <Calendar size={18} />
                            <span>Today :- {formattedDate}</span>
                        </div>
                        <button className="nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Statistics Overview */}
            <div className="stats-grid">
                <motion.div
                    className="stat-card"
                    whileHover={{ y: -4 }}
                >
                    <div className="stat-icon-wrapper blue">
                        <User size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Active Meditators</p>
                        <p className="stat-value">{mockRecords.length}</p>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    whileHover={{ y: -4 }}
                >
                    <div className="stat-icon-wrapper green">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Avg. Daily Time</p>
                        <p className="stat-value">2.5 hrs</p>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    whileHover={{ y: -4 }}
                >
                    <div className="stat-icon-wrapper purple">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Consistency Rate</p>
                        <p className="stat-value">94%</p>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    whileHover={{ y: -4 }}
                >
                    <div className="stat-icon-wrapper gold">
                        <Award size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Courses</p>
                        <p className="stat-value">45</p>
                    </div>
                </motion.div>
            </div>

            {/* Meditation Records Grid */}
            <div className="records-grid">
                {mockRecords.map((record) => {
                    const totalMinutes = getTotalMinutes(record);
                    const totalHours = Math.floor(totalMinutes / 60);
                    const remainingMinutes = totalMinutes % 60;

                    return (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
                            className="meditation-record-card"
                        >
                            {/* Card Header */}
                            <div className="record-header">
                                <div className="user-info">
                                    <div className="avatar-circle">
                                        <User size={24} color="#ffffff" strokeWidth={2} />
                                    </div>
                                    <div className="user-details">
                                        <h3 className="user-name">{record.staffName}</h3>
                                        <p className="user-dept">{record.department}</p>
                                    </div>
                                </div>
                                <div className="total-time-badge">
                                    <Clock size={16} />
                                    <span>{totalHours}h {remainingMinutes}m</span>
                                </div>
                            </div>

                            {/* Session Times */}
                            <div className="session-times">
                                <div className="session-item morning">
                                    <span className="session-label">Morning</span>
                                    <span className="session-value">{record.morning}</span>
                                </div>
                                <div className="session-item afternoon">
                                    <span className="session-label">Afternoon</span>
                                    <span className="session-value">{record.afternoon}</span>
                                </div>
                                <div className="session-item evening">
                                    <span className="session-label">Evening</span>
                                    <span className="session-value">{record.evening}</span>
                                </div>
                            </div>

                            {/* Course Information */}
                            <div className="course-info">
                                <div className="course-row">
                                    <span className="course-label">Last Course:</span>
                                    <span className="course-text">{record.lastCourse}</span>
                                </div>
                                <div className="course-row">
                                    <span className="course-label">Next Course:</span>
                                    <span className="course-text">{record.nextCourse}</span>
                                </div>
                                <div className="course-row highlight">
                                    <span className="course-label">Total Courses:</span>
                                    <span className="course-badge">{record.totalCourses}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <style>{`
        .meditation-dashboard-root {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100%;
          width: 100%;
          padding: 2.5rem 2rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dashboard-header {
          margin-bottom: 2.5rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .header-content {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .title-icon {
          color: #fbbf24;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .date-navigator {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.3);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: scale(1.1);
        }

        .date-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto 2.5rem;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .stat-icon-wrapper.blue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-icon-wrapper.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .stat-icon-wrapper.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .stat-icon-wrapper.gold {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .records-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .meditation-record-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar-circle {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .user-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .user-dept {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          font-weight: 600;
        }

        .total-time-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .session-times {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .session-item {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-left: 4px solid;
        }

        .session-item.morning {
          border-color: #fbbf24;
        }

        .session-item.afternoon {
          border-color: #3b82f6;
        }

        .session-item.evening {
          border-color: #8b5cf6;
        }

        .session-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .session-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .course-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .course-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .course-row.highlight {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .course-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
        }

        .course-text {
          font-size: 0.85rem;
          color: #1e293b;
          font-weight: 600;
        }

        .course-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .meditation-dashboard-root {
            padding: 1.5rem 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .title-section {
            justify-content: center;
          }

          .date-navigator {
            justify-content: center;
          }

          .records-grid {
            grid-template-columns: 1fr;
          }

          .session-times {
            grid-template-columns: 1fr;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default MeditationDashboard;
