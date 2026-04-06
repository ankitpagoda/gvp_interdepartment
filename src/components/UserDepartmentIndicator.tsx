import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';

interface Department {
    id: string;
    name: string;
    color: string;
}

interface UserDepartmentIndicatorProps {
    assignedDepartments: Department[];
    primaryDepartment: string | null;
    compact?: boolean;
}

const UserDepartmentIndicator: React.FC<UserDepartmentIndicatorProps> = ({
    assignedDepartments,
    primaryDepartment,
    compact = false
}) => {
    if (assignedDepartments.length === 0) {
        return (
            <div className="dept-indicator-root empty">
                <div className="empty-state">
                    <AlertCircle size={compact ? 20 : 32} className="empty-icon" />
                    <div className="empty-content">
                        <p className="empty-title">No Department Assigned</p>
                        {!compact && <p className="empty-text">Contact admin to request department access</p>}
                    </div>
                </div>

                <style>{`
          .dept-indicator-root.empty {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: ${compact ? '8px' : '12px'};
            padding: ${compact ? '0.75rem' : '1.5rem'};
            font-family: 'Inter', system-ui, sans-serif;
          }

          .empty-state {
            display: flex;
            align-items: center;
            gap: ${compact ? '0.75rem' : '1rem'};
          }

          .empty-icon {
            color: #ef4444;
            flex-shrink: 0;
          }

          .empty-content {
            flex: 1;
          }

          .empty-title {
            font-size: ${compact ? '0.9rem' : '1rem'};
            font-weight: 700;
            color: #991b1b;
            margin: 0;
          }

          .empty-text {
            font-size: 0.85rem;
            color: #dc2626;
            margin: 0.25rem 0 0 0;
          }
        `}</style>
            </div>
        );
    }



    return (
        <div className={`dept-indicator-root ${compact ? 'compact' : ''}`}>
            <div className="indicator-header">
                <Building2 size={compact ? 16 : 20} className="header-icon" />
                <span className="header-label">Departments Assigned:</span>
                <span className="dept-count">{assignedDepartments.length}</span>
            </div>

            <div className="dept-list">
                {assignedDepartments.map(dept => {
                    const isPrimary = dept.id === primaryDepartment;

                    return (
                        <div
                            key={dept.id}
                            className={`dept-tag ${isPrimary ? 'primary' : ''}`}
                            style={{
                                backgroundColor: `${dept.color}15`,
                                borderColor: dept.color,
                                color: dept.color
                            }}
                        >
                            <span className="dept-name">{dept.name}</span>
                            {isPrimary && <span className="primary-badge">Primary</span>}
                        </div>
                    );
                })}
            </div>

            {assignedDepartments.length > 1 && (
                <div className="info-note">
                    <span className="info-icon">ℹ️</span>
                    <span className="info-text">
                        You have access to combined views from all assigned departments
                    </span>
                </div>
            )}

            <style>{`
        .dept-indicator-root {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dept-indicator-root.compact {
          padding: 1rem;
          border-radius: 8px;
        }

        .indicator-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .dept-indicator-root.compact .indicator-header {
          margin-bottom: 0.75rem;
        }

        .header-icon {
          color: #3b82f6;
        }

        .header-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .dept-indicator-root.compact .header-label {
          font-size: 0.75rem;
        }

        .dept-count {
          background: #3b82f6;
          color: #ffffff;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .dept-indicator-root.compact .dept-count {
          font-size: 0.7rem;
          padding: 0.1rem 0.4rem;
        }

        .dept-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .dept-indicator-root.compact .dept-list {
          gap: 0.5rem;
        }

        .dept-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 999px;
          border: 2px solid;
          font-size: 0.9rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .dept-indicator-root.compact .dept-tag {
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          border-width: 1.5px;
        }

        .dept-tag.primary {
          border-width: 2.5px;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        }

        .dept-indicator-root.compact .dept-tag.primary {
          border-width: 2px;
        }

        .dept-name {
          font-weight: 700;
        }

        .primary-badge {
          background: currentColor;
          color: #ffffff;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
        }

        .dept-indicator-root.compact .primary-badge {
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
        }

        .info-note {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #eff6ff;
          border-radius: 8px;
        }

        .dept-indicator-root.compact .info-note {
          margin-top: 0.75rem;
          padding: 0.5rem;
        }

        .info-icon {
          flex-shrink: 0;
          font-size: 0.9rem;
        }

        .info-text {
          font-size: 0.85rem;
          color: #1e40af;
          line-height: 1.5;
        }

        .dept-indicator-root.compact .info-text {
          font-size: 0.75rem;
        }
      `}</style>
        </div>
    );
};

export default UserDepartmentIndicator;
