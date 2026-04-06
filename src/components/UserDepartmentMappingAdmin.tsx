import React, { useState, useEffect } from 'react';
import { Search, User, Save, X, Check, RefreshCw, AlertCircle, Star, Layout, UserCircle, ClipboardList, ShieldCheck, ChevronRight, Hash, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    apiGetMembers, apiGetDepartments, apiUpdateUserDepartments,
    type Member
} from '../api/rbacApi';

interface ExtendedUserProfile extends Member {
    assigned_departments_list: { id: number; name: string }[];
}

interface Department {
    id: number;
    name: string;
    trustId: string;
    color: string;
}

const PROFILE_SECTIONS = [
    'My Task', 'Unified Request', 'Task Status', 'Bill Submit', 'Room Form', 
    'Meditator Request', 'Course Summary', 'Schedule', 'Meditation', 'Survey', 
    'Purchase Order', 'Pay-slip', 'Announcements', 'Feedback', 'Suggestion', 
    'Chat', 'Leave', 'Movement'
];

const DEPARTMENT_PAGE_SECTIONS = [
    'Task Status', 'Staff Status', 'Meditation Done', 'Received Request', 
    'Store Dashboard', 'Reception Bills', 'Purchase Order', 'Feedback', 
    'Survey', 'Announcements', 'Policies'
];

const REPORT_SECTIONS = {
    'Visitor': ['Dhamalay', 'Anapana', 'Museum', 'GVP'],
    'Staff/DS': ['VRI', 'DPVT', 'SVCT', 'GVP'],
    'Vouchers': ['VRI', 'DPVT', 'SVCT', 'GVP'],
    'Task': ['VRI', 'DPVT', 'SVCT', 'GVP'],
    'Maintenance': ['Electrician', 'Water Man', 'Construction', 'Driver'],
    'Water Con.': ['VRI', 'DPVT', 'SVCT', 'GVP'],
    'Power Con.': ['VRI', 'DPVT', 'SVCT', 'GVP']
};

const CCTV_REGIONS = {
    'DPVT': ['Dhamma Hall', 'Male Dinning Hall', 'Female Dinning Hall', 'Male walking area', 'Female walking area', 'Male Residence', 'Female Residence'],
    'SVCT-Food Court': ['Dinning Area', 'Kitchen Area'],
    'SVCT-Souvenir': ['First Floor', 'Ground Floor', 'Billing Area', 'Store Area'],
    'SVCT-Dhammalay': ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Forth Floor', 'Garden Area'],
    'VRI-Library': ['Book Area', 'Office Area'],
    'VRI-Pariyatti': ['Ground Floor', 'First Floor', 'Second Floor'],
    'VRI-Other': ['Archive', 'Conservation', 'Preservation', 'Publication'],
    'GVP-Zone1: Arrival': ['Main Entrance Gate', 'Ashoka Pillar', 'Information Centre', 'Statue of S.N. Goenka', 'Bell Tower'],
    'GVP-Zone2: Dome': ['Main Dome', 'North Pagoda', 'South Pagoda', 'Relic Enshrinement Point', 'Grand Wooden Doors', 'Visitors’ Gallery', 'Meditation Hall Floor'],
    'GVP-Zone3: Gallery': ['Painting Gallery', 'Spread of Dhamma Map', 'Bodhi Tree', 'Buddha’s Journey Exhibit', 'Video Orientation Room', 'Library'],
    'GVP-Zone4: Grounds': ['Circumambulation Path', 'Viewpoint over Gorai Creek', 'Dhamma Pattana Meditation Centre', 'Vipassana Research Institute', 'Souvenir', 'Food Plaza', 'Fountain of Peace']
};

const TRUST_COLORS: Record<string, string> = {
    'GVP': '#3b82f6', // blue
    'VRI': '#10b981', // green
    'DPVT': '#f59e0b', // amber
    'SVCT': '#8b5cf6'  // purple
};

const UserDepartmentMappingAdmin: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
    const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
    const [selectedUser, setSelectedUser] = useState<ExtendedUserProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'assignments' | 'profile' | 'report' | 'cctv'>('assignments');
    
    // Temp states for real-time interaction
    const [tempDepartments, setTempDepartments] = useState<number[]>([]);
    const [tempPrimary, setTempPrimary] = useState<number | null>(null);
    const [tempProfileSections, setTempProfileSections] = useState<string[]>([]);
    const [tempDepartmentSections, setTempDepartmentSections] = useState<string[]>([]);
    const [tempReportSections, setTempReportSections] = useState<string[]>([]);
    const [tempAssignmentSections, setTempAssignmentSections] = useState<string[]>([]);
    const [tempCCTVSections, setTempCCTVSections] = useState<string[]>([]);
    
    const [hasChanges, setHasChanges] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const getTrustForDept = (name: string) => {
        if (['Dhamma-Pattana'].includes(name)) return 'DPVT';
        if (['Food-Court', 'Souvenir', 'Dhammalay'].includes(name)) return 'SVCT';
        if (['Library', 'Academic', 'Pariyatti', 'Publication', 'Archive', 'Conservation', 'Preservation'].includes(name)) return 'VRI';
        return 'GVP';
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [membersRes, deptsRes] = await Promise.all([
                apiGetMembers(),
                apiGetDepartments()
            ]);

            const extendedMembers = membersRes.members.map(m => ({
                ...m,
                assigned_departments_list: m.assigned_departments 
                    ? m.assigned_departments.split(', ').map(name => {
                        const d = deptsRes.departments.find(dx => dx.name === name);
                        return d ? { id: d.id, name: d.name } : null;
                    }).filter(Boolean) as { id: number; name: string }[]
                    : []
            }));

            setUsers(extendedMembers);

            const enhancedDepts = deptsRes.departments.map(d => ({
                id: d.id,
                name: d.name,
                trustId: getTrustForDept(d.name),
                color: TRUST_COLORS[getTrustForDept(d.name)] || '#64748b'
            }));
            setAvailableDepartments(enhancedDepts);
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectUser = (user: ExtendedUserProfile) => {
        setSelectedUser(user);
        const deptIds = user.assigned_departments_list.map(d => d.id);
        setTempDepartments(deptIds);
        setTempPrimary(user.primary_department_id || (deptIds.length > 0 ? deptIds[0] : null));
        setTempProfileSections(user.profile_sections || PROFILE_SECTIONS);
        setTempDepartmentSections(user.department_sections || []);
        setTempReportSections(user.report_sections || Object.entries(REPORT_SECTIONS).flatMap(([cat, items]) => items.map(i => `${cat}:${i}`)));
        setTempAssignmentSections(user.assignment_sections || []); 
        setTempCCTVSections(user.cctv_sections || []);
        setHasChanges(false);
        setSaveSuccess(false);
    };

    const handleToggleDepartment = (deptId: number) => {
        let newDepts: number[];
        if (tempDepartments.includes(deptId)) {
            newDepts = tempDepartments.filter(d => d !== deptId);
            if (tempPrimary === deptId) {
                setTempPrimary(newDepts.length > 0 ? newDepts[0] : null);
            }
        } else {
            newDepts = [...tempDepartments, deptId];
            if (newDepts.length === 1) {
                setTempPrimary(deptId);
            }
        }
        setTempDepartments(newDepts);
        setHasChanges(true);
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        if (selectedUser) {
            setSaving(true);
            try {
                await apiUpdateUserDepartments(selectedUser.id, {
                    departmentIds: tempDepartments,
                    primaryDepartmentId: tempPrimary || undefined,
                    profileSections: tempProfileSections,
                    departmentSections: tempDepartmentSections,
                    reportSections: tempReportSections,
                    assignmentSections: tempAssignmentSections,
                    cctvSections: tempCCTVSections
                });
                setHasChanges(true); // reset visually
                setSaveSuccess(true);
                setTimeout(() => {
                    setSaveSuccess(false);
                    setHasChanges(false);
                }, 2000);
                loadData();
            } catch (err: any) {
                setError(err.message || 'Failed to save changes');
            } finally {
                setSaving(false);
            }
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="erp-admin-root">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
            
            {/* Top Toolbar - Sticky */}
            <header className="sticky-toolbar">
                <div className="toolbar-inner">
                    <div className="toolbar-left">
                        <Layout className="text-primary" size={24} />
                        <div>
                            <h1>Department Mapping</h1>
                            <p>Organizational ERP System Access Management</p>
                        </div>
                    </div>
                    <div className="toolbar-right">
                        {error && <span className="error-msg">{error}</span>}
                        <button 
                            className={`save-action-btn ${(!hasChanges || saving) ? 'disabled' : ''} ${saveSuccess ? 'success' : ''}`}
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                        >
                            {saving ? <RefreshCw className="animate-spin" size={18} /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
                            {saving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Mapping'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="erp-layout">
                {/* Left Sidebar - Searchable Users */}
                <aside className="users-sidebar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by name, ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="users-scroller">
                        {loading && !users.length ? (
                            <div className="sidebar-loading">
                                <RefreshCw className="animate-spin" />
                                <span>Syncing Data...</span>
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <button 
                                    key={user.id}
                                    className={`sidebar-user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <div className="user-avatar-small" style={{ background: selectedUser?.id === user.id ? 'white' : '#f1f5f9' }}>
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name-label">{user.name}</span>
                                        <span className="user-id-label">{user.employee_id || 'ID-TBD'}</span>
                                    </div>
                                    <div className="dept-badge">
                                        {user.assigned_departments_list.length}
                                    </div>
                                    {selectedUser?.id === user.id && <ChevronRight size={16} className="active-arrow" />}
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Right Main Area */}
                <section className="main-configurator">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div 
                                key={selectedUser.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="config-inner"
                            >
                                {/* User Profile Card */}
                                <div className="user-master-card">
                                    <div className="user-card-large-avatar">
                                        {getInitials(selectedUser.name)}
                                    </div>
                                    <div className="user-card-info">
                                        <div className="user-id-row">
                                            <Hash size={12} />
                                            <span>{selectedUser.employee_id || 'NOT_ASSIGNED'}</span>
                                        </div>
                                        <h2>{selectedUser.name}</h2>
                                        <div className="user-card-meta">
                                            <span className="meta-email">{selectedUser.email}</span>
                                            <span className="dot">•</span>
                                            <span className="meta-dept">{selectedUser.department || 'No Primary'}</span>
                                            <div className="role-pill">
                                                <ShieldCheck size={12} />
                                                {selectedUser.roles?.split(',')[0] || 'Staff'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs Navigation */}
                                <nav className="tab-navigation">
                                    <button className={activeTab === 'assignments' ? 'active' : ''} onClick={() => setActiveTab('assignments')}>
                                        <Layout size={18} />
                                        Dept. Assignments
                                    </button>
                                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                                        <UserCircle size={18} />
                                        Profile Sections
                                    </button>
                                    <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>
                                        <ClipboardList size={18} />
                                        Today's Report
                                    </button>
                                    <button className={activeTab === 'cctv' ? 'active' : ''} onClick={() => setActiveTab('cctv')}>
                                        <Camera size={18} />
                                        CCTV Mapping
                                    </button>
                                </nav>

                                {/* Tab Panels */}
                                <div className="tab-content-area">
                                    {activeTab === 'assignments' && (
                                        <div className="assignments-grid">
                                            {availableDepartments.map(dept => (
                                                <div 
                                                    key={dept.id} 
                                                    className={`dept-modern-card ${tempDepartments.includes(dept.id) ? 'selected' : ''}`}
                                                    onClick={() => handleToggleDepartment(dept.id)}
                                                >
                                                    <div className="dept-trust-label">
                                                        <span className="trust-dot" style={{ background: dept.color }} />
                                                        {dept.trustId}
                                                    </div>
                                                    <div className="dept-name-full">{dept.name}</div>
                                                    {tempDepartments.includes(dept.id) && (
                                                        <>
                                                            <div className="dept-granular-options" onClick={e => e.stopPropagation()}>
                                                                <div className="granular-header">Operations Sections</div>
                                                                <div className="granular-list">
                                                                    {DEPARTMENT_PAGE_SECTIONS.map(section => {
                                                                        const key = `${dept.trustId}-${dept.name}:${section}`;
                                                                        const isActive = tempDepartmentSections.includes(key);
                                                                        return (
                                                                            <button
                                                                                key={section}
                                                                                className={`granular-item ${isActive ? 'active' : ''}`}
                                                                                onClick={() => {
                                                                                    const next = isActive ? tempDepartmentSections.filter(x => x !== key) : [...tempDepartmentSections, key];
                                                                                    setTempDepartmentSections(next);
                                                                                    setHasChanges(true);
                                                                                }}
                                                                            >
                                                                                {isActive ? <Check size={10} /> : <X size={10} />}
                                                                                {section}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div className="dept-card-actions" onClick={e => e.stopPropagation()}>
                                                                {tempPrimary === dept.id ? (
                                                                    <button className="primary-btn-filled">PRIMARY</button>
                                                                ) : (
                                                                    <button className="primary-set-btn" onClick={() => {setTempPrimary(dept.id); setHasChanges(true);}}>SET PRIMARY</button>
                                                                )}
                                                                <div className="selected-check">
                                                                    <Check size={12} />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'profile' && (
                                        <div className="profile-sections-tab">
                                            <div className="section-group">
                                                <h3>My Profile Page Sections</h3>
                                                <div className="chips-grid">
                                                    {PROFILE_SECTIONS.map(s => (
                                                        <button 
                                                            key={s} 
                                                            className={`toggle-chip ${tempProfileSections.includes(s) ? 'enabled' : ''}`}
                                                            onClick={() => {
                                                                const next = tempProfileSections.includes(s) ? tempProfileSections.filter(x => x !== s) : [...tempProfileSections, s];
                                                                setTempProfileSections(next);
                                                                setHasChanges(true);
                                                            }}
                                                        >
                                                            {tempProfileSections.includes(s) && <Check size={14} />}
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'report' && (
                                        <div className="reports-tab-grid">
                                            {Object.entries(REPORT_SECTIONS).map(([category, items]) => {
                                                const someInCat = items.some(i => tempReportSections.includes(`${category}:${i}`));
                                                const allInCat = items.every(i => tempReportSections.includes(`${category}:${i}`));
                                                
                                                return (
                                                    <div key={category} className="report-cat-card">
                                                        <div className="report-cat-header">
                                                            <button 
                                                                className={`modern-checkbox ${allInCat ? 'checked' : someInCat ? 'partial' : ''}`}
                                                                onClick={() => {
                                                                    let next = [...tempReportSections];
                                                                    if (allInCat) {
                                                                        next = next.filter(s => !s.startsWith(`${category}:`));
                                                                    } else {
                                                                        items.forEach(i => {
                                                                            if (!next.includes(`${category}:${i}`)) next.push(`${category}:${i}`);
                                                                        });
                                                                    }
                                                                    setTempReportSections(next);
                                                                    setHasChanges(true);
                                                                }}
                                                            >
                                                                {allInCat ? <Check size={12} /> : someInCat ? <div className="partial-mark" /> : null}
                                                            </button>
                                                            <span className="cat-title">{category.toUpperCase()}</span>
                                                        </div>
                                                        <div className="report-tags-container">
                                                            {items.map(item => (
                                                                <div 
                                                                    key={item} 
                                                                    className={`report-tag ${tempReportSections.includes(`${category}:${item}`) ? 'active' : ''}`}
                                                                    onClick={() => {
                                                                        const key = `${category}:${item}`;
                                                                        const next = tempReportSections.includes(key) ? tempReportSections.filter(x => x !== key) : [...tempReportSections, key];
                                                                        setTempReportSections(next);
                                                                        setHasChanges(true);
                                                                    }}
                                                                >
                                                                    {item}
                                                                    {tempReportSections.includes(`${category}:${item}`) && <X size={10} className="tag-remove" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {activeTab === 'cctv' && (
                                        <div className="reports-tab-grid">
                                            {Object.entries(CCTV_REGIONS).map(([zone, cameras]) => {
                                                const someInZone = cameras.some(c => tempCCTVSections.includes(`${zone}:${c}`));
                                                const allInZone = cameras.every(c => tempCCTVSections.includes(`${zone}:${c}`));
                                                
                                                return (
                                                    <div key={zone} className="report-cat-card">
                                                        <div className="report-cat-header">
                                                            <button 
                                                                className={`modern-checkbox ${allInZone ? 'checked' : someInZone ? 'partial' : ''}`}
                                                                onClick={() => {
                                                                    let next = [...tempCCTVSections];
                                                                    if (allInZone) {
                                                                        next = next.filter(s => !s.startsWith(`${zone}:`));
                                                                    } else {
                                                                        cameras.forEach(c => {
                                                                            if (!next.includes(`${zone}:${c}`)) next.push(`${zone}:${c}`);
                                                                        });
                                                                    }
                                                                    setTempCCTVSections(next);
                                                                    setHasChanges(true);
                                                                }}
                                                            >
                                                                {allInZone ? <Check size={12} /> : someInZone ? <div className="partial-mark" /> : null}
                                                            </button>
                                                            <span className="cat-title">{zone.toUpperCase()}</span>
                                                        </div>
                                                        <div className="report-tags-container">
                                                            {cameras.map(camera => (
                                                                <div 
                                                                    key={camera} 
                                                                    className={`report-tag ${tempCCTVSections.includes(`${zone}:${camera}`) ? 'active' : ''}`}
                                                                    onClick={() => {
                                                                        const key = `${zone}:${camera}`;
                                                                        const next = tempCCTVSections.includes(key) ? tempCCTVSections.filter(x => x !== key) : [...tempCCTVSections, key];
                                                                        setTempCCTVSections(next);
                                                                        setHasChanges(true);
                                                                    }}
                                                                >
                                                                    {camera}
                                                                    {tempCCTVSections.includes(`${zone}:${camera}`) && <X size={10} className="tag-remove" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Mapping Summary Footer */}
                                <div className="mapping-summary-footer">
                                    <div className="summary-header-row">
                                        <h4>Mapping Summary</h4>
                                        {tempPrimary && (
                                            <div className="primary-dept-badge">
                                                <Star size={12} fill="#f59e0b" />
                                                Primary: {availableDepartments.find(d => d.id === tempPrimary)?.name}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="summary-sections">
                                        <div className="summary-dept-row">
                                            {tempDepartments.map(id => {
                                                const d = availableDepartments.find(x => x.id === id);
                                                if (!d) return null;
                                                const opsCount = tempDepartmentSections.filter(s => s.startsWith(`${d.trustId}-${d.name}:`)).length;
                                                return (
                                                    <div key={id} className="dept-summary-pill" style={{ borderColor: d.color, color: d.color }}>
                                                        <span className="pill-name">{d.name}</span>
                                                        {opsCount > 0 && <span className="pill-ops-badge" style={{ background: d.color }}>{opsCount} Ops</span>}
                                                    </div>
                                                );
                                            })}
                                            {tempDepartments.length === 0 && <span className="placeholder-txt">No departments selected.</span>}
                                        </div>
                                        
                                        <div className="summary-stats-grid">
                                            <div className="stat-unit">
                                                <span className="stat-num">{tempProfileSections.length}/18</span>
                                                <span className="stat-desc">Profile Tabs</span>
                                            </div>
                                            <div className="stat-unit">
                                                <span className="stat-num">{tempDepartmentSections.length}</span>
                                                <span className="stat-desc">Total Ops Active</span>
                                            </div>
                                            <div className="stat-unit">
                                                <span className="stat-num">{tempReportSections.length}/28</span>
                                                <span className="stat-desc">Report Data</span>
                                            </div>
                                            <div className="stat-unit">
                                                <span className="stat-num">{tempCCTVSections.length}</span>
                                                <span className="stat-desc">CCTV Areas</span>
                                            </div>
                                            <div className="stat-unit">
                                                <span className="stat-num">{new Set(tempDepartments.map(id => availableDepartments.find(x => x.id === id)?.trustId)).size}</span>
                                                <span className="stat-desc">Trusts</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="refresh-warning">
                                        <AlertCircle size={14} />
                                        <span>Changes require a dashboard refresh for full propagation. Please save correctly.</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="select-user-placeholder">
                                <User size={64} />
                                <h2>Select a staff member from the sidebar</h2>
                                <p>Load a profile to begin granular department and section mapping.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <style>{`
                .erp-admin-root {
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'DM Sans', sans-serif;
                    color: #1e293b;
                }

                /* Sticky Toolbar */
                .sticky-toolbar {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(8px);
                    border-bottom: 1px solid #e2e8f0;
                    padding: 0.75rem 2rem;
                }
                .toolbar-inner {
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .toolbar-left { display: flex; align-items: center; gap: 1rem; }
                .toolbar-left h1 { font-size: 1.1rem; font-weight: 800; margin: 0; color: #012855; }
                .toolbar-left p { font-size: 0.75rem; color: #64748b; margin: 0; font-weight: 500; }
                
                .save-action-btn {
                    padding: 0.6rem 1.5rem;
                    border-radius: 10px;
                    background: #3b82f6;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .save-action-btn:hover:not(.disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
                .save-action-btn.disabled { opacity: 0.5; background: #94a3b8; cursor: not-allowed; }
                .save-action-btn.success { background: #10b981; }

                /* Main Layout */
                .erp-layout {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    height: calc(100vh - 64px);
                    max-width: 1600px;
                    margin: 0 auto;
                }

                /* Sidebar */
                .users-sidebar {
                    background: #fff;
                    border-right: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                }
                .search-box {
                    padding: 1.5rem;
                    position: relative;
                }
                .search-box input {
                    width: 100%;
                    padding: 0.7rem 1rem 0.7rem 2.8rem;
                    border-radius: 12px;
                    border: 1.5px solid #e2e8f0;
                    background: #f8fafc;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .search-box input:focus { border-color: #3b82f6; outline: none; background: #fff; }
                .search-icon { position: absolute; left: 2.25rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }

                .users-scroller {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0 1rem 1.5rem 1rem;
                }
                .sidebar-user-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 0.4rem;
                    position: relative;
                }
                .sidebar-user-item:hover { background: #f1f5f9; }
                .sidebar-user-item.active { background: #3b82f6; color: #fff; }
                
                .user-avatar-small {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.85rem;
                    color: #3b82f6;
                    flex-shrink: 0;
                }
                .sidebar-user-item.active .user-avatar-small { color: #3b82f6; background: #fff; }

                .user-details { flex: 1; display: flex; flex-direction: column; text-align: left; }
                .user-name-label { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.1rem; }
                .user-id-label { font-size: 0.75rem; opacity: 0.7; font-weight: 600; }
                
                .dept-badge {
                    background: #f1f5f9;
                    color: #64748b;
                    font-size: 0.7rem;
                    font-weight: 800;
                    width: 22px;
                    height: 22px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sidebar-user-item.active .dept-badge { background: rgba(255,255,255,0.2); color: white; }
                .active-arrow { color: #fff; opacity: 0.5; }

                /* Main configurator */
                .main-configurator {
                    padding: 2rem;
                    overflow-y: auto;
                    background: #f8fafc;
                }
                .config-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* Profile Card */
                .user-master-card {
                    background: #fff;
                    border-radius: 20px;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .user-card-large-avatar {
                    width: 80px;
                    height: 80px;
                    background: #3b82f6;
                    color: #fff;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    font-weight: 900;
                }
                .user-card-info h2 { font-size: 1.6rem; font-weight: 800; margin: 0.2rem 0 0.5rem 0; color: #0f172a; }
                .user-id-row { display: flex; align-items: center; gap: 0.4rem; color: #64748b; font-weight: 800; font-size: 0.8rem; }
                .user-card-meta { display: flex; align-items: center; gap: 0.8rem; font-size: 0.9rem; color: #64748b; }
                .role-pill { background: #3b82f610; color: #3b82f6; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 0.4rem; text-transform: uppercase; }

                /* Tab Navigation */
                .tab-navigation {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    background: #fff;
                    padding: 0.4rem;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                }
                .tab-navigation button {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    font-weight: 700;
                    color: #64748b;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .tab-navigation button:hover { background: #f8fafc; color: #1e293b; }
                .tab-navigation button.active { background: #f1f5f9; color: #3b82f6; }

                /* Tab Content */
                .tab-content-area { min-height: 400px; padding: 0.5rem 0; }

                /* Assignments Grid */
                .assignments-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                }
                .dept-modern-card {
                    background: #fff;
                    border: 2px solid transparent;
                    border-radius: 16px;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
                    position: relative;
                }
                .dept-modern-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
                .dept-modern-card.selected { border-color: #3b82f6; background: #fff; min-height: 200px; }

                .dept-granular-options { margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; }
                .granular-header { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.5rem; }
                .granular-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
                .granular-item { display: flex; align-items: center; gap: 0.3rem; font-size: 0.65rem; font-weight: 700; color: #64748b; padding: 0.2rem 0.4rem; border-radius: 4px; border: 1px solid transparent; background: #f8fafc; cursor: pointer; transition: all 0.2s; text-align: left; }
                .granular-item:hover { border-color: #cbd5e1; }
                .granular-item.active { background: #3b82f610; color: #3b82f6; border-color: #3b82f6; }

                .dept-card-actions { margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
                .primary-btn-filled { flex: 1; background: #f59e0b; color: #fff; border: none; padding: 0.4rem; border-radius: 8px; font-weight: 800; font-size: 0.7rem; }
                .primary-set-btn { flex: 1; background: transparent; border: 1.5px solid #f59e0b; color: #f59e0b; padding: 0.4rem; border-radius: 8px; font-weight: 800; font-size: 0.7rem; cursor: pointer; transition: all 0.2s; }
                .primary-set-btn:hover { background: #f59e0b; color: #fff; }
                .selected-check { width: 24px; height: 24px; background: #3b82f6; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

                /* Summary Area Enhancements */
                .dept-summary-pill { 
                    display: flex; 
                    align-items: center; 
                    gap: 0.5rem; 
                    padding: 0.4rem 0.6rem 0.4rem 1rem; 
                    border-radius: 20px; 
                    border: 1.5px solid; 
                    font-size: 0.8rem; 
                    font-weight: 700; 
                }
                .pill-ops-badge { 
                    font-size: 0.65rem; 
                    color: #fff; 
                    padding: 0.1rem 0.5rem; 
                    border-radius: 10px; 
                    font-weight: 800; 
                }

                /* Profile Tab */
                .profile-sections-tab { background: #fff; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; }
                .section-group h3 { font-size: 0.95rem; font-weight: 800; color: #475569; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .chips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.8rem; }
                .toggle-chip {
                    padding: 0.6rem 1rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .toggle-chip:hover { border-color: #3b82f6; color: #3b82f6; }
                .toggle-chip.enabled { background: #3b82f610; color: #3b82f6; border-color: #3b82f6; }
                .divider { height: 1px; background: #f1f5f9; margin: 2rem 0; }

                /* Reports Tab */
                .reports-tab-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
                .report-cat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.5rem; }
                .report-cat-header { display: flex; align-items: center; gap: 0.8rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem; }
                .modern-checkbox { width: 22px; height: 22px; border: 2px solid #e2e8f0; border-radius: 7px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .modern-checkbox.checked { background: #3b82f6; border-color: #3b82f6; color: #fff; }
                .modern-checkbox.partial { border-color: #3b82f6; }
                .partial-mark { width: 10px; height: 10px; background: #3b82f6; border-radius: 2px; }
                .cat-title { font-weight: 900; font-size: 0.8rem; color: #0f172a; letter-spacing: 0.05em; }
                
                .report-tags-container { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .report-tag {
                    padding: 0.4rem 0.8rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .report-tag.active { background: #3b82f610; border-color: #3b82f6; color: #3b82f6; }
                .tag-remove { opacity: 0.5; }

                /* Trusts Tab */
                .trusts-tab-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
                .trust-overview-card { background: #fff; border-radius: 18px; padding: 1.5rem; border: 1px solid #e2e8f0; }
                .trust-ov-header { display: flex; align-items: center; gap: 0.8rem; font-weight: 800; font-size: 1rem; margin-bottom: 1.5rem; }
                .trust-depts-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .mini-dept-tag { padding: 0.35rem 0.7rem; border-radius: 8px; font-size: 0.75rem; font-weight: 800; }

                /* Mapping Summary Footer */
                .mapping-summary-footer { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 2rem; margin-top: 3rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
                .summary-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .summary-header-row h4 { font-size: 1.1rem; font-weight: 800; margin: 0; }
                .primary-dept-badge { display: flex; align-items: center; gap: 0.5rem; background: #fdf2f2; color: #991b1b; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 800; font-size: 0.85rem; border: 1.5px solid #fee2e2; }
                .primary-dept-badge span { background: #f59e0b15; color: #f59e0b; }

                .summary-sections { display: flex; flex-direction: column; gap: 1.5rem; }
                .summary-dept-row { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .dept-pill { padding: 0.4rem 1rem; border-radius: 20px; border: 1.5px solid; font-size: 0.8rem; font-weight: 700; }
                
                .summary-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; background: #f8fafc; padding: 1.25rem; border-radius: 16px; }
                .stat-unit { display: flex; flex-direction: column; align-items: center; }
                .stat-num { font-size: 1.2rem; font-weight: 900; color: #012855; }
                .stat-desc { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-top: 0.2rem; }

                .refresh-warning { display: flex; align-items: center; gap: 0.8rem; background: #fffbeb; color: #92400e; padding: 0.8rem 1.25rem; border-radius: 12px; margin-top: 1.5rem; font-size: 0.85rem; font-weight: 600; border: 1px solid #fef3c7; }

                .placeholder-txt { color: #94a3b8; font-style: italic; font-size: 0.9rem; }
                .select-user-placeholder { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; text-align: center; }
                .select-user-placeholder h2 { color: #475569; margin: 1.5rem 0 0.5rem 0; font-weight: 800; }
                
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default UserDepartmentMappingAdmin;
