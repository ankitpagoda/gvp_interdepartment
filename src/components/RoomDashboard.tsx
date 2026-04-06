import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRequests } from '../lib/mockDb';

interface RoomEntry {
    id: string;
    name: string;
    department: string;
    status: string;
    checkIn: string;
    checkOut: string;
    roomNumber?: string;
}

const RoomDashboard: React.FC = () => {
    const [rooms, setRooms] = useState<RoomEntry[]>([]);

    useEffect(() => {
        const reqs = getRequests().filter(r => r.type === 'Room Booking');
        const mapped: RoomEntry[] = reqs.map((r: any) => ({
            id: r.id,
            name: r.requesterName || r.title || 'Unknown',
            department: r.department || r.assignedToDept || 'General',
            status: r.status === 'Approved' ? 'Confirmed' : (r.status || 'Requested'),
            checkIn: r.checkIn || (r.description && (r.description.match(/Check-in:\s*(\d{4}-\d{2}-\d{2})/) || [])[1]) || '',
            checkOut: r.checkOut || (r.description && (r.description.match(/Check-out:\s*(\d{4}-\d{2}-\d{2})/) || [])[1]) || '',
            roomNumber: r.roomNumber || 'Unassigned'
        }));
        setRooms(mapped);
    }, []);


    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Teacher': return '#10b981';
            case 'Dhammasevak': return '#3b82f6';
            case 'Guest': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <div className="room-dashboard-root">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Room Management</h1>
                    <p className="dashboard-subtitle">Manage room allocations and bookings</p>
                </div>
            </header>

            <div className="dashboard-content">
                {rooms.length === 0 ? (
                    <div className="empty-state">
                        <Building2 size={64} className="empty-icon" />
                        <h3 className="empty-title">No Rooms Allocated</h3>
                        <p className="empty-text">No room bookings found.</p>
                    </div>
                ) : (
                    <div className="room-grid">
                        {rooms.map((room) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.12)' }}
                                className="room-card"
                            >
                                <div className="card-header">
                                    <div className="room-number-badge">
                                        {room.roomNumber || 'Unassigned'}
                                    </div>
                                    <div
                                        className="status-dot"
                                        style={{ backgroundColor: getStatusColor(room.status) }}
                                    />
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <User size={16} className="info-icon" />
                                        <div className="info-content">
                                            <span className="info-label">Name</span>
                                            <span className="info-value">{room.name}</span>
                                        </div>
                                    </div>

                                    <div className="info-row">
                                        <Building2 size={16} className="info-icon" />
                                        <div className="info-content">
                                            <span className="info-label">Department</span>
                                            <span className="info-value">{room.department}</span>
                                        </div>
                                    </div>

                                    <div className="info-row">
                                        <Calendar size={16} className="info-icon" />
                                        <div className="info-content">
                                            <span className="info-label">Duration</span>
                                            <span className="info-value">
                                                {formatDate(room.checkIn)} - {formatDate(room.checkOut)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="status-badge" style={{ backgroundColor: `${getStatusColor(room.status)}15`, color: getStatusColor(room.status) }}>
                                        {room.status}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="floating-add-btn"
            >
                <Plus size={28} />
            </motion.button>

            <style>{`
        .room-dashboard-root {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100%;
          width: 100%;
          padding: 2.5rem 2rem;
          font-family: 'Inter', 'Poppins', system-ui, sans-serif;
          position: relative;
        }

        .dashboard-header {
          margin-bottom: 2.5rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .header-content {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .dashboard-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .room-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .room-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .room-number-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .info-icon {
          color: #94a3b8;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .info-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
        }

        .status-badge {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .empty-state {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 4rem 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .empty-icon {
          color: rgba(255, 255, 255, 0.6);
          margin: 0 auto 1.5rem;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
        }

        .empty-text {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .floating-add-btn {
          position: fixed;
          bottom: 3rem;
          right: 3rem;
          width: 64px;
          height: 64px;
          background: #ffffff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          color: #667eea;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .room-dashboard-root {
            padding: 1.5rem 1rem;
          }

          .room-grid {
            grid-template-columns: 1fr;
          }

          .floating-add-btn {
            bottom: 2rem;
            right: 2rem;
            width: 56px;
            height: 56px;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default RoomDashboard;
