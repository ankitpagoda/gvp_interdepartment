import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';

interface Department {
    id: string;
    name: string;
}

interface DepartmentSwitcherProps {
    assignedDepartments: Department[];
    currentDepartment: string | null;
    onSwitch: (departmentId: string | null) => void;
    showAllOption?: boolean;
}

const DepartmentSwitcher: React.FC<DepartmentSwitcherProps> = ({
    assignedDepartments,
    currentDepartment,
    onSwitch,
    showAllOption = true
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (assignedDepartments.length === 0) {
        return null;
    }

    // If user has only one department, don't show switcher
    if (assignedDepartments.length === 1 && !showAllOption) {
        return null;
    }

    const getCurrentDepartmentName = () => {
        if (!currentDepartment) return 'All Departments';
        const dept = assignedDepartments.find(d => d.id === currentDepartment);
        return dept?.name || 'Unknown';
    };

    const handleSelect = (deptId: string | null) => {
        onSwitch(deptId);
        setIsOpen(false);
    };

    return (
        <div className="dept-switcher-root">
            <button
                className="switcher-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Building2 size={18} className="switcher-icon" />
                <div className="switcher-text">
                    <span className="switcher-label">Viewing as:</span>
                    <span className="switcher-value">{getCurrentDepartmentName()}</span>
                </div>
                <ChevronDown size={18} className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="switcher-overlay" onClick={() => setIsOpen(false)} />
                    <div className="switcher-dropdown">
                        {showAllOption && assignedDepartments.length > 1 && (
                            <>
                                <button
                                    className={`dropdown-option ${!currentDepartment ? 'active' : ''}`}
                                    onClick={() => handleSelect(null)}
                                >
                                    <Building2 size={16} />
                                    <span>All Departments</span>
                                    {!currentDepartment && <div className="active-indicator" />}
                                </button>
                                <div className="dropdown-divider" />
                            </>
                        )}

                        {assignedDepartments.map(dept => (
                            <button
                                key={dept.id}
                                className={`dropdown-option ${currentDepartment === dept.id ? 'active' : ''}`}
                                onClick={() => handleSelect(dept.id)}
                            >
                                <Building2 size={16} />
                                <span>{dept.name}</span>
                                {currentDepartment === dept.id && <div className="active-indicator" />}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <style>{`
        .dept-switcher-root {
          position: relative;
        }

        .switcher-button {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 220px;
        }

        .switcher-button:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .switcher-icon {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .switcher-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.15rem;
        }

        .switcher-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .switcher-value {
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 700;
        }

        .chevron {
          color: #64748b;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .switcher-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
        }

        .switcher-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 999;
          overflow: hidden;
        }

        .dropdown-option {
          width: 100%;
          padding: 0.85rem 1rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background 0.2s;
          color: #1e293b;
          font-size: 0.9rem;
          font-weight: 600;
          position: relative;
        }

        .dropdown-option:hover {
          background: #f8fafc;
        }

        .dropdown-option.active {
          background: #eff6ff;
          color: #3b82f6;
        }

        .dropdown-option svg {
          color: #64748b;
          flex-shrink: 0;
        }

        .dropdown-option.active svg {
          color: #3b82f6;
        }

        .dropdown-option span {
          flex: 1;
        }

        .active-indicator {
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0.25rem 0;
        }

        @media (max-width: 640px) {
          .switcher-button {
            min-width: 180px;
            padding: 0.5rem 0.75rem;
          }

          .switcher-value {
            font-size: 0.85rem;
          }
        }
      `}</style>
        </div>
    );
};

export default DepartmentSwitcher;
