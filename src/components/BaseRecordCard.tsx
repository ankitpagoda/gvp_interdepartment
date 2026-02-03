import React from 'react';
import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Volume2, CheckCheck } from 'lucide-react';

interface Field {
    label: string;
    value: string;
    fullWidth?: boolean;
}

interface BaseRecordCardProps {
    header: string;
    fields: Field[];
    showApproval?: boolean;
}

const BaseRecordCard: React.FC<BaseRecordCardProps> = ({
    header,
    fields,
    showApproval = true,
}) => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            gap: '1.5rem',
            fontFamily: systemFont,
            border: '1px solid #f0f0f0',
            transition: 'transform 0.2s ease',
            position: 'relative',
        }}>
            {/* Three-dot menu */}
            <div style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', cursor: 'pointer', color: '#64748b' }}>
                <MoreVertical size={20} />
            </div>

            {/* Left Section: Avatar */}
            <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)',
                }}>
                    <User size={32} />
                </div>
            </div>

            {/* Right Section: Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Pill Header */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '30px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.875rem',
                    color: '#475569',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'fit-content',
                    border: '1px solid #e2e8f0',
                }}>
                    {header}
                </div>

                {/* Info Fields Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '0.75rem',
                }}>
                    {fields.map((field, idx) => (
                        <div key={idx} style={{
                            gridColumn: field.fullWidth ? '1 / -1' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#fcfcfc',
                            border: '1px solid #eef2f6',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            gap: '0.5rem',
                        }}>
                            <span style={{ fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                                {field.label}:
                            </span>
                            <span style={{ color: '#475569', fontSize: '0.9rem' }}>
                                {field.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bottom Action Bar */}
                <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9',
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b' }}>
                        <ThumbsUp size={20} style={{ cursor: 'pointer' }} className="hover-blue" />
                        <ThumbsDown size={20} style={{ cursor: 'pointer' }} className="hover-red" />
                        <MessageSquare size={20} style={{ cursor: 'pointer' }} className="hover-blue" />
                        <Link size={20} style={{ cursor: 'pointer' }} />
                        <RotateCw size={20} style={{ cursor: 'pointer' }} />
                        <Volume2 size={20} style={{ cursor: 'pointer' }} />
                    </div>

                    {showApproval && (
                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700', fontSize: '0.85rem' }}>
                            <CheckCheck size={24} strokeWidth={3} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BaseRecordCard;
