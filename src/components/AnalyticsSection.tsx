import { useState } from 'react';
import {
    TrendingUp,
    Users,
    AlertCircle,
    CheckCircle2,
    Clock,
    MessageSquare,
    Activity,
    Filter,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

// --- Mock Data ---
const KPI_DATA = [
    { label: 'Total Requests', value: '1,284', trend: '+12%', isUp: true, color: '#3b82f6', icon: Activity },
    { label: 'Pending Requests', value: '42', trend: '-5%', isUp: false, color: '#f59e0b', icon: Clock },
    { label: 'Tasks Completed', value: '856', trend: '+18%', isUp: true, color: '#10b981', icon: CheckCircle2 },
    { label: 'Open Issues', value: '12', trend: '-2%', isUp: false, color: '#ef4444', icon: AlertCircle },
    { label: 'Feedback Sentiment', value: '88%', trend: '+4%', isUp: true, color: '#8b5cf6', icon: MessageSquare },
    { label: 'Active Staff', value: '312', trend: 'Stable', isUp: true, color: '#6366f1', icon: Users },
];

const DEPT_LOAD = [
    { dept: 'Reception', requests: 45, tasks: 12, issues: 2 },
    { dept: 'IT-Dept', requests: 28, tasks: 15, issues: 5 },
    { dept: 'Accounts', requests: 12, tasks: 8, issues: 1 },
    { dept: 'Kitchen', requests: 35, tasks: 22, issues: 0 },
    { dept: 'Security', requests: 20, tasks: 18, issues: 3 },
    { dept: 'Admin', requests: 15, tasks: 10, issues: 1 },
];

const RECENT_ACTIVITY = [
    { user: 'Mr. Rajesh K.', dept: 'IT Dept', action: 'Issue raised', status: 'High Priority', time: '10:42 AM' },
    { user: 'Mrs. Suman P.', dept: 'Accounts', action: 'Voucher approved', status: 'Completed', time: '10:35 AM' },
    { user: 'Mr. Amit S.', dept: 'Kitchen', action: 'Consumption report', status: 'Pending', time: '10:15 AM' },
    { user: 'Mr. Vijay L.', dept: 'Security', action: 'Shift handover', status: 'Completed', time: '09:50 AM' },
    { user: 'Mrs. Anjali R.', dept: 'Reception', action: 'Guest check-in', status: 'In-progress', time: '09:30 AM' },
];

// --- Simple SVG Chart Components ---

const MiniLineChart = ({ color }: { color: string }) => (
    <svg width="60" height="30" viewBox="0 0 60 30" style={{ opacity: 0.6 }}>
        <path
            d="M0 25 Q15 5 30 20 T60 10"
            fill="none"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

const BarChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.requests, d.tasks, d.issues)));
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '200px', padding: '1rem 0' }}>
            {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%', width: '100%' }}>
                        <div style={{ flex: 1, background: '#3b82f6', height: `${(d.requests / maxValue) * 100}%`, borderRadius: '4px 4px 0 0' }} />
                        <div style={{ flex: 1, background: '#10b981', height: `${(d.tasks / maxValue) * 100}%`, borderRadius: '4px 4px 0 0' }} />
                        <div style={{ flex: 1, background: '#ef4444', height: `${(d.issues / maxValue) * 100}%`, borderRadius: '4px 4px 0 0' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{d.dept}</span>
                </div>
            ))}
        </div>
    );
};

const DonutChart = () => (
    <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="60, 100" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="25, 100" strokeDashoffset="-60" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10, 100" strokeDashoffset="-85" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5, 100" strokeDashoffset="-95" />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>78%</span>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>Efficiency</p>
        </div>
    </div>
);

import type { User as AuthUser } from '../types.ts';

const AnalyticsSection = ({ user }: { user: AuthUser | null }) => {
    const [dateRange, setDateRange] = useState('Today');

    return (
        <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100%', overflowY: 'auto' }}>

            {/* 1. Global Filter Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                background: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a', fontWeight: 700 }}>
                        <TrendingUp size={20} />
                        Unified Analytics
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b', marginLeft: '1rem' }}>Welcome, {user?.name}</span>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['Today', 'Week', 'Month', 'Custom'].map(r => (
                            <button
                                key={r}
                                onClick={() => setDateRange(r)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    border: '1px solid #e2e8f0',
                                    background: dateRange === r ? '#1e3a8a' : '#ffffff',
                                    color: dateRange === r ? '#ffffff' : '#475569',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                        <Filter size={16} /> All Departments <ChevronDown size={14} />
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', background: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', border: 'none', cursor: 'pointer' }}>
                        Export Report <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>

            {/* 2. KPI Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
            }}>
                {KPI_DATA.map((kpi, idx) => (
                    <div key={idx} style={{
                        background: '#ffffff',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: `${kpi.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: kpi.color
                            }}>
                                <kpi.icon size={22} />
                            </div>
                            <MiniLineChart color={kpi.color} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: 0 }}>{kpi.label}</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0.25rem 0' }}>{kpi.value}</h2>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: kpi.isUp ? '#10b981' : '#ef4444' }}>
                            {kpi.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {kpi.trend} <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '0.25rem' }}>vs last period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Core Visual Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Departmental Workload</h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Requests</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Tasks</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Issues</div>
                        </div>
                    </div>
                    <BarChart data={DEPT_LOAD} />
                </div>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', textAlign: 'left' }}>Status Distribution</h3>
                    <DonutChart />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
                        {[
                            { label: 'Completed', color: '#10b981', val: '60%' },
                            { label: 'In-Progress', color: '#3b82f6', val: '25%' },
                            { label: 'Pending', color: '#f59e0b', val: '10%' },
                            { label: 'Rejected', color: '#ef4444', val: '5%' },
                        ].map(s => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '10px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, flex: 1, textAlign: 'left' }}>{s.label}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b' }}>{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Specialized Analytics & Activity Feed */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem' }}>Resource Consumption</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Water Consumption</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b82f6' }}>8.5k L</span>
                            </div>
                            <div style={{ height: '8px', background: '#eff6ff', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '65%', height: '100%', background: '#3b82f6' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Power Consumption</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>124 kWh</span>
                            </div>
                            <div style={{ height: '8px', background: '#fffbeb', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '42%', height: '100%', background: '#f59e0b' }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem', padding: '1rem', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <AlertCircle color="#ef4444" size={20} />
                            <div style={{ fontSize: '0.75rem', color: '#991b1b', lineHeight: '1.4' }}>
                                <span style={{ fontWeight: 800 }}>Spike Alert:</span> Water usage in Dhammalay is 15% above threshold for this hour.
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Live Activities</h3>
                        <button style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {RECENT_ACTIVITY.map((act, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                background: '#f8fafc',
                                borderRadius: '16px',
                                gap: '1rem',
                                border: '1px solid #f1f5f9'
                            }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                    {act.user.charAt(4)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                                        {act.user} <span style={{ fontWeight: 400, color: '#64748b' }}>from {act.dept}</span>
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#1e3a8a', margin: 0, fontWeight: 600 }}>{act.action}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '20px',
                                        background: act.status === 'Completed' ? '#dcfce7' : act.status === 'High Priority' ? '#fee2e2' : '#eff6ff',
                                        color: act.status === 'Completed' ? '#166534' : act.status === 'High Priority' ? '#991b1b' : '#1e40af',
                                        marginBottom: '0.2rem'
                                    }}>
                                        {act.status}
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
