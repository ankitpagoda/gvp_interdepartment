import React, { useState } from 'react';
import { Star, X, Plus } from 'lucide-react';

interface Department {
    id: string;
    name: string;
    trustId: string;
}

interface UserDepartmentMapping {
    userId: string;
    name: string;
    staffId: string;
    role: string;
    assignedDepartments: string[];
    primaryDepartment: string | null;
}

const availableDepartments: Department[] = [
    // DPVT
    { id: 'dhamma-pattana', name: 'Dhamma-Pattana', trustId: 'DPVT' },
    // SVCT
    { id: 'food-court', name: 'Food-Court', trustId: 'SVCT' },
    { id: 'souvenir', name: 'Souvenir', trustId: 'SVCT' },
    { id: 'dhammalay', name: 'Dhammalay', trustId: 'SVCT' },
    // VRI
    { id: 'library', name: 'Library', trustId: 'VRI' },
    { id: 'academic', name: 'Academic', trustId: 'VRI' },
    { id: 'pariyatti', name: 'Pariyatti', trustId: 'VRI' },
    { id: 'archive', name: 'Archive', trustId: 'VRI' },
    { id: 'conservation', name: 'Conservation', trustId: 'VRI' },
    { id: 'preservation', name: 'Preservation', trustId: 'VRI' },
    { id: 'publication', name: 'Publication', trustId: 'VRI' },
    // GVP
    { id: 'reception', name: 'Reception', trustId: 'GVP' },
    { id: 'museum', name: 'Museum', trustId: 'GVP' },
    { id: 'pr', name: 'PR', trustId: 'GVP' },
    { id: 'maintains', name: 'Maintains', trustId: 'GVP' },
    { id: 'electrical', name: 'Electrical', trustId: 'GVP' },
    { id: 'water', name: 'Water', trustId: 'GVP' },
    { id: 'civil', name: 'Civil', trustId: 'GVP' },
    { id: 'kitchen', name: 'Kitchen', trustId: 'GVP' },
    { id: 'one-day', name: 'One-Day', trustId: 'GVP' },
    { id: 'garden', name: 'Garden', trustId: 'GVP' },
    { id: 'housekeeping', name: 'Housekeeping', trustId: 'GVP' },
    { id: 'security', name: 'Security', trustId: 'GVP' },
    { id: 'accounts', name: 'Accounts', trustId: 'GVP' },
    { id: 'it', name: 'IT', trustId: 'GVP' },
    { id: 'purchase', name: 'Purchase', trustId: 'GVP' },
    { id: 'store', name: 'Store', trustId: 'GVP' },
];

interface DepartmentMappingPanelProps {
    user?: UserDepartmentMapping | null;
    onUpdate?: (departments: string[], primary: string | null) => void;
}

const DepartmentMappingPanel: React.FC<DepartmentMappingPanelProps> = ({
    user = {
        userId: '1',
        name: 'Rajesh Kumar',
        staffId: 'EMP001',
        role: 'Department Manager',
        assignedDepartments: ['kitchen', 'housekeeping'],
        primaryDepartment: 'kitchen'
    },
    onUpdate
}) => {
    const [assignedDepts, setAssignedDepts] = useState<string[]>(user?.assignedDepartments || []);
    const [primaryDept, setPrimaryDept] = useState<string | null>(user?.primaryDepartment || null);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleAddDepartment = (deptId: string) => {
        if (!assignedDepts.includes(deptId)) {
            const newDepts = [...assignedDepts, deptId];
            setAssignedDepts(newDepts);

            // Set as primary if it's the first department
            if (newDepts.length === 1) {
                setPrimaryDept(deptId);
            }

            onUpdate?.(newDepts, primaryDept || deptId);
        }
        setShowDropdown(false);
    };

    const handleRemoveDepartment = (deptId: string) => {
        const newDepts = assignedDepts.filter(d => d !== deptId);
        setAssignedDepts(newDepts);

        // Update primary if removed department was primary
        if (primaryDept === deptId) {
            const newPrimary = newDepts.length > 0 ? newDepts[0] : null;
            setPrimaryDept(newPrimary);
            onUpdate?.(newDepts, newPrimary);
        } else {
            onUpdate?.(newDepts, primaryDept);
        }
    };

    const handleSetPrimary = (deptId: string) => {
        setPrimaryDept(deptId);
        onUpdate?.(assignedDepts, deptId);
    };

    const getDepartmentName = (deptId: string) => {
        return availableDepartments.find(d => d.id === deptId)?.name || deptId;
    };

    const unassignedDepartments = availableDepartments.filter(
        d => !assignedDepts.includes(d.id)
    );

    return (
        <div className="dept-mapping-root">
            <div className="dept-mapping-container">
                <div className="dept-mapping-card">
                    <h1 className="panel-title">Department Mapping</h1>

                    {/* User Identity Section */}
                    <div className="user-identity-section">
                        <h2 className="section-title">User Identity</h2>
                        <div className="identity-grid">
                            <div className="identity-field">
                                <label>Name</label>
                                <div className="readonly-value">{user?.name}</div>
                            </div>
                            <div className="identity-field">
                                <label>Staff ID</label>
                                <div className="readonly-value">{user?.staffId}</div>
                            </div>
                            <div className="identity-field full-width">
                                <label>Role / Designation</label>
                                <div className="readonly-value">{user?.role}</div>
                            </div>
                        </div>
                    </div>

                    {/* Department Assignment Section */}
                    <div className="dept-assignment-section">
                        <div className="section-header">
                            <h2 className="section-title">Assigned Departments</h2>
                            <div className="dropdown-wrapper">
                                <button
                                    className="add-dept-btn"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <Plus size={18} />
                                    Add Department
                                </button>

                                {showDropdown && (
                                    <div className="dept-dropdown">
                                        {unassignedDepartments.length === 0 ? (
                                            <div className="dropdown-empty">All departments assigned</div>
                                        ) : (
                                            unassignedDepartments.map(dept => (
                                                <button
                                                    key={dept.id}
                                                    className="dropdown-item"
                                                    onClick={() => handleAddDepartment(dept.id)}
                                                >
                                                    <span className="dept-name">{dept.name}</span>
                                                    <span className="dept-trust">{dept.trustId}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {assignedDepts.length === 0 ? (
                            <div className="empty-state">
                                <p>No departments assigned</p>
                                <p className="empty-hint">Click "Add Department" to assign departments</p>
                            </div>
                        ) : (
                            <div className="dept-chips-container">
                                {assignedDepts.map(deptId => (
                                    <div
                                        key={deptId}
                                        className={`dept-chip ${primaryDept === deptId ? 'primary' : ''}`}
                                    >
                                        {primaryDept === deptId && (
                                            <Star size={16} className="primary-icon" fill="currentColor" />
                                        )}
                                        <span className="chip-text">{getDepartmentName(deptId)}</span>
                                        {primaryDept !== deptId && assignedDepts.length > 1 && (
                                            <button
                                                className="set-primary-btn"
                                                onClick={() => handleSetPrimary(deptId)}
                                                title="Set as primary"
                                            >
                                                <Star size={14} />
                                            </button>
                                        )}
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveDepartment(deptId)}
                                            title="Remove department"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {assignedDepts.length > 0 && (
                            <div className="dept-legend">
                                <div className="legend-item">
                                    <Star size={14} fill="currentColor" className="legend-icon primary" />
                                    <span>Primary Department</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-icon secondary"></div>
                                    <span>Secondary Department</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Access Summary */}
                    <div className="access-summary">
                        <h3 className="summary-title">Access Summary</h3>
                        <div className="summary-content">
                            <p className="summary-text">
                                You have access to <strong>{assignedDepts.length}</strong> department{assignedDepts.length !== 1 ? 's' : ''}
                            </p>
                            {assignedDepts.length > 1 && (
                                <p className="summary-hint">
                                    Navigation will show combined views from all assigned departments
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .dept-mapping-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 2.5rem 1.5rem;
          display: flex;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dept-mapping-container {
          width: 100%;
          max-width: 800px;
        }

        .dept-mapping-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 2.5rem;
          border: 1px solid #e2e8f0;
        }

        .panel-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2rem 0;
          text-align: center;
        }

        .user-identity-section {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #475569;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .identity-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .identity-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .identity-field.full-width {
          grid-column: 1 / -1;
        }

        .identity-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .readonly-value {
          background: #ffffff;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 600;
        }

        .dept-assignment-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .add-dept-btn {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .add-dept-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .dept-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          min-width: 250px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 100;
        }

        .dropdown-item {
          width: 100%;
          padding: 0.85rem 1rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
          border-bottom: 1px solid #f1f5f9;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .dept-name {
          font-weight: 600;
          color: #1e293b;
        }

        .dept-trust {
          font-size: 0.75rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .dropdown-empty {
          padding: 1.5rem;
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
        }

        .empty-state {
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }

        .empty-state p {
          margin: 0;
          color: #64748b;
        }

        .empty-hint {
          font-size: 0.85rem;
          margin-top: 0.5rem !important;
        }

        .dept-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .dept-chip {
          background: #f1f5f9;
          border: 2px solid #cbd5e1;
          border-radius: 999px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .dept-chip.primary {
          background: #dbeafe;
          border-color: #3b82f6;
        }

        .primary-icon {
          color: #3b82f6;
        }

        .chip-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .set-primary-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .set-primary-btn:hover {
          color: #3b82f6;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .remove-btn:hover {
          color: #ef4444;
        }

        .dept-legend {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        .legend-icon {
          flex-shrink: 0;
        }

        .legend-icon.primary {
          color: #3b82f6;
        }

        .legend-icon.secondary {
          width: 14px;
          height: 14px;
          background: #f1f5f9;
          border: 2px solid #cbd5e1;
          border-radius: 50%;
        }

        .access-summary {
          background: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .summary-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e40af;
          margin: 0 0 0.75rem 0;
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-text {
          font-size: 0.95rem;
          color: #1e293b;
          margin: 0;
        }

        .summary-hint {
          font-size: 0.85rem;
          color: #475569;
          margin: 0;
        }

        @media (max-width: 768px) {
          .dept-mapping-card {
            padding: 1.5rem;
          }

          .identity-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .add-dept-btn {
            width: 100%;
            justify-content: center;
          }

          .dept-dropdown {
            right: auto;
            left: 0;
            width: 100%;
          }

          .dept-legend {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
        </div>
    );
};

export default DepartmentMappingPanel;
