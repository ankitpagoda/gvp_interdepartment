import { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart,
    Activity,
    TrendingUp,
    Filter,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { getRequestAnalytics, getMeditationEntries } from '../lib/mockDb';

const AnalyticsDashboard = (_props: { user?: any }) => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [meditationStats, setMeditationStats] = useState<any>(null);
    const [selectedDept, setSelectedDept] = useState('All');

    useEffect(() => {
        const data = getRequestAnalytics();
        const medData = getMeditationEntries();
        setAnalytics(data);
        setMeditationStats({
            count: medData.length,
            totalMinutes: medData.reduce((acc, entry) => acc + entry.sessions.reduce((sAcc, s) => sAcc + (s.attended ? s.durationMinutes : 0), 0), 0)
        });
    }, []);

    if (!analytics) return <div style={{ padding: '2rem' }}>Loading Analytics...</div>;

    const statsCards = [
        { label: 'Total Requests', value: analytics.total, icon: <Activity size={20} />, color: '#3b82f6' },
        { label: 'Pending Action', value: analytics.pending, icon: <Clock size={20} />, color: '#f59e0b' },
        { label: 'Total Approved', value: analytics.approved, icon: <CheckCircle2 size={20} />, color: '#22c55e' },
        { label: 'Total Rejected', value: analytics.rejected, icon: <XCircle size={20} />, color: '#ef4444' }
    ];

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>System Analytics</h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Real-time operational insights and performance tracking.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '0.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Filter size={16} /> Filter:
                    </div>
                    <select
                        className="form-control"
                        style={{ width: '180px', border: 'none', background: 'transparent', fontWeight: 700 }}
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {Object.keys(analytics.byDept).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statsCards.map((card, i) => (
                    <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ color: card.color, background: card.color + '10', padding: '0.5rem', borderRadius: '12px' }}>{card.icon}</div>
                            <TrendingUp size={16} color="#22c55e" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{card.value}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Charts Mockup */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* Department Workload */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BarChart3 size={20} color="var(--primary)" /> Departmental Workload
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {Object.entries(analytics.byDept).map(([dept, count]: any, i) => (
                            <div key={dept} style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <span>{dept}</span>
                                    <span style={{ color: 'var(--primary)' }}>{count} Tasks</span>
                                </div>
                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(count / analytics.total) * 100}%`,
                                        background: `hsl(${220 + (i * 15)}, 70%, 50%)`,
                                        borderRadius: '4px'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Meditation & Engagement */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', padding: '2rem', borderRadius: '24px', color: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity size={20} /> Meditation Stats
                        </h3>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{meditationStats?.count || 0}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Entries Recorded</div>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{Math.round((meditationStats?.totalMinutes || 0) / 60)}h</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total Hours Sat</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem', height: '40px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <PieChart size={20} color="#f59e0b" /> Priority Distribution
                        </h3>
                        {Object.entries(analytics.byPriority).map(([p, count]: any, i) => (
                            <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#3b82f6' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p}</span>
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
