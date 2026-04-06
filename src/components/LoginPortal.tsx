import React, { useState } from 'react';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Building2,
    ShieldCheck
} from 'lucide-react';
import { apiLogin, type RBACUser } from '../api/rbacApi';

interface LoginPortalProps {
    onLogin: (userData: any) => void;
    onRBACLogin: (token: string, user: RBACUser, roles: string[], perms: string[]) => void;
}

const LoginPortal: React.FC<LoginPortalProps> = ({ onRBACLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showForgotPop, setShowForgotPop] = useState(false);
    const [resetMode, setResetMode] = useState<'notify' | 'reset'>('notify');
    const [forgotIdentifier, setForgotIdentifier] = useState('');
    const [resetData, setResetData] = useState({
        tempPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // ── Real RBAC API Login ──────────────────────────────────────────────
        apiLogin(formData.identifier, formData.password)
            .then(data => {
                onRBACLogin(data.token, data.user, data.roles, data.permissions);
            })
            .catch(err => {
                // Fallback to simulation for demo users? Or just error.
                // For this task, we want production login.
                if (err.code === 'AUTH_FAILED') {
                     setError('Invalid email or password.');
                } else {
                     setError(err.message || 'Server connection failed.');
                }
                setIsLoading(false);
            });
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setForgotLoading(true);
        setError('');
        setSuccess('');

        import('../api/rbacApi').then(api => {
            if (resetMode === 'notify') {
                api.apiForgotPassword(forgotIdentifier)
                    .then(() => {
                        setSuccess('Request sent to admin.');
                        setForgotIdentifier('');
                        setTimeout(() => setShowForgotPop(false), 2000);
                    })
                    .catch(err => setError(err.message || 'Request failed.'))
                    .finally(() => setForgotLoading(false));
            } else {
                if (resetData.newPassword !== resetData.confirmPassword) {
                    setError('Passwords do not match.');
                    setForgotLoading(false);
                    return;
                }
                api.apiResetPasswordSelf({
                    identifier: forgotIdentifier,
                    tempPassword: resetData.tempPassword,
                    newPassword: resetData.newPassword
                })
                    .then(() => {
                        setSuccess('Password updated successfully. You can now login.');
                        setResetData({ tempPassword: '', newPassword: '', confirmPassword: '' });
                        setTimeout(() => {
                            setShowForgotPop(false);
                            setResetMode('notify');
                        }, 2500);
                    })
                    .catch(err => setError(err.message || 'Reset failed.'))
                    .finally(() => setForgotLoading(false));
            }
        });
    };

    return (
        <div className="auth-wrapper">
            <div className={`auth-card fade-in`}>
                <header className="auth-header">
                    <div className="auth-logo">
                        <Building2 className="text-primary" size={32} />
                    </div>
                    <h1 className="auth-title">
                        GVP Inter-Department
                    </h1>
                    <p className="auth-subtitle">
                        Sign in to access your portal
                    </p>
                </header>

                <main className="auth-body">
                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={18} /> {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Staff ID / Email ID</label>
                            <div className="form-input-wrapper">
                                <User className="form-icon-left" size={18} />
                                <input
                                    type="text"
                                    name="identifier"
                                    className="form-control with-icon"
                                    placeholder="e.g. GVP-12345 or amit@gvp.com"
                                    value={formData.identifier}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="form-input-wrapper">
                                <Lock className="form-icon-left" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-control with-icon"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn-primary ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                            style={{ height: '52px', fontSize: '1rem', marginTop: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <button 
                                type="button" 
                                onClick={() => setShowForgotPop(true)} 
                                className="auth-link" 
                                style={{ fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>

                    {showForgotPop && (
                        <div style={{
                            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            zIndex: 100, backdropFilter: 'blur(4px)'
                        }}>
                            <div className="auth-card" style={{ maxWidth: '400px', width: '90%', padding: '2rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Reset Password</h2>
                                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                                    <button 
                                        type="button"
                                        style={{ 
                                            flex: 1, padding: '0.75rem', border: 'none', background: 'none', 
                                            fontWeight: resetMode === 'notify' ? 800 : 500,
                                            color: resetMode === 'notify' ? '#3b82f6' : '#64748b',
                                            borderBottom: resetMode === 'notify' ? '2px solid #3b82f6' : 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => { setResetMode('notify'); setError(''); setSuccess(''); }}
                                    >
                                        Notify Admin
                                    </button>
                                    <button 
                                        type="button"
                                        style={{ 
                                            flex: 1, padding: '0.75rem', border: 'none', background: 'none', 
                                            fontWeight: resetMode === 'reset' ? 800 : 500,
                                            color: resetMode === 'reset' ? '#3b82f6' : '#64748b',
                                            borderBottom: resetMode === 'reset' ? '2px solid #3b82f6' : 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => { setResetMode('reset'); setError(''); setSuccess(''); }}
                                    >
                                        I have a Reset Password
                                    </button>
                                </div>

                                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                    {resetMode === 'notify' 
                                        ? 'Enter your Email or Staff ID. We will notify the admin to reset your password.' 
                                        : 'Enter the temporary password provided by the admin to set your new password.'}
                                </p>
                                
                                {success && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>{success}</div>}
                                {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>{error}</div>}

                                <form onSubmit={handleForgotSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Email or Staff ID</label>
                                        <input 
                                            className="form-control"
                                            value={forgotIdentifier}
                                            onChange={e => setForgotIdentifier(e.target.value)}
                                            placeholder="e.g. amit@gvp.org"
                                            required
                                        />
                                    </div>

                                    {resetMode === 'reset' && (
                                        <>
                                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                                <label className="form-label">Reset Password (from Admin)</label>
                                                <input 
                                                    className="form-control"
                                                    type="password"
                                                    value={resetData.tempPassword}
                                                    onChange={e => setResetData(d => ({ ...d, tempPassword: e.target.value }))}
                                                    placeholder="Enter temporary password"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                                <label className="form-label">New Password</label>
                                                <input 
                                                    className="form-control"
                                                    type="password"
                                                    value={resetData.newPassword}
                                                    onChange={e => setResetData(d => ({ ...d, newPassword: e.target.value }))}
                                                    placeholder="Minimum 4 characters"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                                <label className="form-label">Confirm Password</label>
                                                <input 
                                                    className="form-control"
                                                    type="password"
                                                    value={resetData.confirmPassword}
                                                    onChange={e => setResetData(d => ({ ...d, confirmPassword: e.target.value }))}
                                                    placeholder="Confirm new password"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => { setShowForgotPop(false); setResetMode('notify'); }}
                                            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={forgotLoading}
                                            style={{ 
                                                flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', 
                                                background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer'
                                            }}
                                        >
                                            {forgotLoading ? 'Processing...' : (resetMode === 'notify' ? 'Notify Admin' : 'Reset Password')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                            Privacy Policy • Terms of Use
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'right' }}>
                            © 2026 Global Vipassana Pagoda<br />All Rights Reserved
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LoginPortal;
