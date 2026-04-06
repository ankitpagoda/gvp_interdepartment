import React, { useState } from 'react';
import { User, Star, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserDepartmentMapping {
    userId: string;
    name: string;
    staffId: string;
    role: string;
    assignedDepartments: string[];
    primaryDepartment: string | null;
}

interface Department {
    id: string;
    name: string;
}

const availableDepartments: Department[] = [
    // DPVT
    { id: 'dhamma-pattana', name: 'Dhamma-Pattana' },
    // SVCT
    { id: 'food-court', name: 'Food-Court' },
    { id: 'souvenir', name: 'Souvenir' },
    { id: 'dhammalay', name: 'Dhammalay' },
    // VRI
    { id: 'library', name: 'Library' },
    { id: 'academic', name: 'Academic' },
    { id: 'pariyatti', name: 'Pariyatti' },
    { id: 'archive', name: 'Archive' },
    { id: 'conservation', name: 'Conservation' },
    { id: 'preservation', name: 'Preservation' },
    { id: 'publication', name: 'Publication' },
    // GVP
    { id: 'reception', name: 'Reception' },
    { id: 'museum', name: 'Museum' },
    { id: 'pr', name: 'PR' },
    { id: 'maintains', name: 'Maintains' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'water', name: 'Water' },
    { id: 'civil', name: 'Civil' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'one-day', name: 'One-Day' },
    { id: 'garden', name: 'Garden' },
    { id: 'housekeeping', name: 'Housekeeping' },
    { id: 'security', name: 'Security' },
    { id: 'accounts', name: 'Accounts' },
    { id: 'it', name: 'IT' },
    { id: 'purchase', name: 'Purchase' },
    { id: 'store', name: 'Store' },
];

const mockUsers: UserDepartmentMapping[] = [
    {
        userId: '1',
        name: 'Rajesh Kumar',
        staffId: 'EMP001',
        role: 'Department Manager',
        assignedDepartments: ['kitchen', 'housekeeping'],
        primaryDepartment: 'kitchen'
    },
    {
        userId: '2',
        name: 'Priya Sharma',
        staffId: 'EMP002',
        role: 'Senior Staff',
        assignedDepartments: ['reception'],
        primaryDepartment: 'reception'
    },
    {
        userId: '3',
        name: 'Amit Patel',
        staffId: 'EMP003',
        role: 'Coordinator',
        assignedDepartments: ['security', 'reception', 'housekeeping'],
        primaryDepartment: 'security'
    }
];

const AdminDepartmentMapping: React.FC = () => {
    const [users, setUsers] = useState<UserDepartmentMapping[]>(mockUsers);
    const [editingUser, setEditingUser] = useState<string | null>(null);

    const getDepartmentName = (deptId: string) => {
        return availableDepartments.find(d => d.id === deptId)?.name || deptId;
    };

    const handleAddDepartment = (userId: string, deptId: string) => {
        setUsers(users.map(user => {
            if (user.userId === userId && !user.assignedDepartments.includes(deptId)) {
                const newDepts = [...user.assignedDepartments, deptId];
                return {
                    ...user,
                    assignedDepartments: newDepts,
                    primaryDepartment: user.primaryDepartment || deptId
                };
            }
            return user;
        }));
    };

    const handleRemoveDepartment = (userId: string, deptId: string) => {
        setUsers(users.map(user => {
            if (user.userId === userId) {
                const newDepts = user.assignedDepartments.filter(d => d !== deptId);
                return {
                    ...user,
                    assignedDepartments: newDepts,
                    primaryDepartment: user.primaryDepartment === deptId
                        ? (newDepts.length > 0 ? newDepts[0] : null)
                        : user.primaryDepartment
                };
            }
            return user;
        }));
    };

    const handleSetPrimary = (userId: string, deptId: string) => {
        setUsers(users.map(user => {
            if (user.userId === userId) {
                return { ...user, primaryDepartment: deptId };
            }
            return user;
        }));
    };

    return (
        <div className="admin-mapping-root">
            <header className="admin-header">
                <h1 className="admin-title">User Department Management</h1>
                <p className="admin-subtitle">Manage department access for all users</p>
            </header>

            <div className="users-container">
                {users.map((user) => (
                    <motion.div
                        key={user.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="user-card"
                    >
                        {/* User Info Header */}
                        <div className="user-header">
                            <div className="user-avatar">
                                <User size={24} />
                            </div>
                            <div className="user-info">
                                <h3 className="user-name">{user.name}</h3>
                                <div className="user-meta">
                                    <span className="staff-id">{user.staffId}</span>
                                    <span className="separator">•</span>
                                    <span className="user-role">{user.role}</span>
                                </div>
                            </div>
                            <button
                                className="edit-btn"
                                onClick={() => setEditingUser(editingUser === user.userId ? null : user.userId)}
                            >
                                <Edit2 size={18} />
                                {editingUser === user.userId ? 'Done' : 'Edit'}
                            </button>
                        </div>

                        {/* Department Assignments */}
                        <div className="dept-section">
                            <div className="dept-header">
                                <span className="dept-label">Assigned Departments ({user.assignedDepartments.length})</span>
                                {editingUser === user.userId && (
                                    <select
                                        className="dept-select"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleAddDepartment(user.userId, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">+ Add Department</option>
                                        {availableDepartments
                                            .filter(d => !user.assignedDepartments.includes(d.id))
                                            .map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))
                                        }
                                    </select>
                                )}
                            </div>

                            <div className="dept-chips">
                                {user.assignedDepartments.length === 0 ? (
                                    <div className="no-departments">No departments assigned</div>
                                ) : (
                                    user.assignedDepartments.map(deptId => (
                                        <div
                                            key={deptId}
                                            className={`dept-chip ${user.primaryDepartment === deptId ? 'primary' : ''}`}
                                        >
                                            {user.primaryDepartment === deptId && (
                                                <Star size={14} fill="currentColor" className="star-icon" />
                                            )}
                                            <span>{getDepartmentName(deptId)}</span>

                                            {editingUser === user.userId && (
                                                <div className="chip-actions">
                                                    {user.primaryDepartment !== deptId && (
                                                        <button
                                                            className="action-btn primary"
                                                            onClick={() => handleSetPrimary(user.userId, deptId)}
                                                            title="Set as primary"
                                                        >
                                                            <Star size={12} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="action-btn remove"
                                                        onClick={() => handleRemoveDepartment(user.userId, deptId)}
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
        .admin-mapping-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 2.5rem 2rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .admin-header {
          margin-bottom: 2.5rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .admin-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
        }

        .users-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .user-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .user-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        .staff-id {
          font-weight: 600;
        }

        .separator {
          color: #cbd5e1;
        }

        .edit-btn {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          background: #2563eb;
        }

        .dept-section {
          padding: 1.5rem;
        }

        .dept-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .dept-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .dept-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          background: #ffffff;
        }

        .dept-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .no-departments {
          color: #94a3b8;
          font-size: 0.9rem;
          font-style: italic;
        }

        .dept-chip {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          transition: all 0.2s;
        }

        .dept-chip.primary {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #1e40af;
        }

        .star-icon {
          color: #3b82f6;
        }

        .chip-actions {
          display: flex;
          gap: 0.25rem;
          margin-left: 0.25rem;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .action-btn.primary {
          color: #94a3b8;
        }

        .action-btn.primary:hover {
          color: #3b82f6;
          background: #eff6ff;
        }

        .action-btn.remove {
          color: #94a3b8;
        }

        .action-btn.remove:hover {
          color: #ef4444;
          background: #fef2f2;
        }

        @media (max-width: 768px) {
          .admin-mapping-root {
            padding: 1.5rem 1rem;
          }

          .user-header {
            flex-wrap: wrap;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }

          .dept-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .dept-select {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminDepartmentMapping;
