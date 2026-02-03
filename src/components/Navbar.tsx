import { Search } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="header-container">
            {/* Left: Logo */}
            <div className="flex items-center">
                <img src="https://www.vridhamma.org/sites/all/themes/vriomega/logo.png" alt="Pagoda Logo" className="logo-img" />
            </div>

            {/* Center: Title */}
            <div className="header-title">
                <h1>GVP</h1>
                <p>Inter-Department</p>
            </div>

            {/* Right: Search and Login */}
            <div className="header-actions">
                <div className="search-box">
                    <input type="text" />
                    <Search size={14} className="text-gray-600" />
                </div>
                <button className="login-btn">Login</button>
            </div>
        </header>
    );
};

export default Navbar;
