import React from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface AccessDeniedProps {
    departmentName?: string;
    message?: string;
    showRequestButton?: boolean;
    onRequestAccess?: () => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
    departmentName,
    message,
    showRequestButton = false,
    onRequestAccess
}) => {
    const defaultMessage = departmentName
        ? `You don't have access to ${departmentName}`
        : "You don't have access to this department";

    return (
        <div className="access-denied-root">
            <div className="access-denied-container">
                <div className="icon-wrapper">
                    <Lock size={48} className="lock-icon" />
                </div>

                <h2 className="denied-title">Access Restricted</h2>
                <p className="denied-message">{message || defaultMessage}</p>

                {showRequestButton && (
                    <button
                        className="request-access-btn"
                        onClick={onRequestAccess}
                    >
                        <AlertCircle size={18} />
                        Request Access
                    </button>
                )}
            </div>

            <style>{`
        .access-denied-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .access-denied-container {
          max-width: 500px;
          text-align: center;
          background: #ffffff;
          border-radius: 16px;
          padding: 3rem 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .icon-wrapper {
          width: 96px;
          height: 96px;
          background: #fef2f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          border: 2px solid #fee2e2;
        }

        .lock-icon {
          color: #ef4444;
        }

        .denied-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem 0;
        }

        .denied-message {
          font-size: 1rem;
          color: #64748b;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .request-access-btn {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .request-access-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .request-access-btn:active {
          transform: translateY(0);
        }
      `}</style>
        </div>
    );
};

export default AccessDenied;
