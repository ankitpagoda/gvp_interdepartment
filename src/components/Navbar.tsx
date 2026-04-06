import { Search, User as UserIcon, LogOut } from 'lucide-react';
import type { User as AuthUser } from '../types.ts';

const Navbar = ({ user, onLogout }: { user: AuthUser | null, onLogout?: () => void }) => {
    return (
        <header className="header-container">
            {/* Left: Logo Section */}
            <div className="flex items-center">
                <div className="logo-container">
                    <img src="https://pattana.dhamma.org/KDP/GVP_Logo.png" alt="Pagoda Logo" className="logo-img" />
                </div>
            </div>

            {/* Center: Authority Anchor */}
            <div className="header-identity">
                <h1>GVP</h1>
                <p>Inter-Department</p>
            </div>

            {/* Right: Actions Section */}
            <div className="header-actions">
                {/* Search Bar */}
                <div className="search-pill">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search staff, reports, issues..."
                    />
                </div>

                {/* User Area */}
                <div className="user-area" style={{ cursor: 'default' }}>
                    <div className="avatar-circle">
                        {user?.name ? (
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{user.name[0]}</span>
                        ) : (
                            <UserIcon size={18} fill="white" />
                        )}
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                            {user?.name || 'Admin'}
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {user?.role || 'System'}
                        </span>
                    </div>

                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.75rem' }} />

                    <button
                        onClick={onLogout}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
