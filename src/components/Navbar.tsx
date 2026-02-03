import { Search, ChevronDown, User } from 'lucide-react';

const Navbar = () => {
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
                <div className="user-area">
                    <div className="avatar-circle">
                        <User size={18} fill="white" />
                    </div>
                    <div className="flex items-center gap-1">
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>Admin</span>
                        <ChevronDown size={14} className="text-slate-500" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
