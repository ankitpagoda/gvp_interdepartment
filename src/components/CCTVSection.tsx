import { useMemo } from 'react';
import {
    Video,
    Monitor,
    Volume2,
    User,
    Globe,
    Settings,
    Database,
    Bell,
    Grid,
    RefreshCcw,
    Camera,
    Circle,
    Maximize,
    AlertCircle
} from 'lucide-react';
import { useRBACAuth } from '../hooks/useRBACAuth';

const CCTVSection = () => {
    const { cctvSections, roles } = useRBACAuth();
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const topTabs = [
        { icon: Video, label: 'CAMERA', active: true },
        { icon: Monitor, label: 'DISPLAY' },
        { icon: Volume2, label: 'AUDIO' },
        { icon: User, label: 'USER' },
        { icon: Globe, label: 'NETWORK' },
        { icon: Settings, label: 'SYSTEM' },
        { icon: Database, label: 'STORAGE' },
        { icon: Bell, label: 'EVENT' },
    ];

    // Filter cameras based on RBAC mapping
    const visibleCameras = useMemo(() => {
        // If Admin or no sections mapped (assuming default access for old accounts), show something
        // In a strict mode, if not admin and no sections, show nothing.
        // Let's be strict.
        if (roles.includes('Admin')) {
            // For admin, show a sample wide set for demo
            return [
                { id: 1, zone: 'GVP-Zone1', area: 'Main Entrance' },
                { id: 2, zone: 'GVP-Zone2', area: 'Main Dome' },
                { id: 3, zone: 'GVP-Zone3', area: 'Bodhi Tree' },
                { id: 4, zone: 'DPVT', area: 'Dhamma Hall' },
                { id: 5, zone: 'SVCT-Food Court', area: 'Kitchen' },
                { id: 6, zone: 'SVCT-Souvenir', area: 'Store' },
            ];
        }

        return cctvSections.map((s, idx) => {
            const [zone, area] = s.split(':');
            return { id: idx + 1, zone, area };
        }).slice(0, 12); // Limit to 12 for grid layout
    }, [cctvSections, roles]);

    const timestamp = new Date().toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\//g, '-');

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#000',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: systemFont,
                overflow: 'hidden'
            }}
        >
            {/* TOP BAR — System Menu */}
            <div
                style={{
                    height: '80px',
                    background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1a)',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    padding: '0 1rem',
                    gap: '1.5rem',
                    alignItems: 'center'
                }}
            >
                {topTabs.map((tab) => (
                    <div
                        key={tab.label}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderBottom: tab.active ? '3px solid #0056b3' : 'none',
                            opacity: tab.active ? 1 : 0.7
                        }}
                    >
                        <tab.icon
                            size={24}
                            style={{
                                color: tab.active ? '#007bff' : '#ccc',
                                filter: 'drop-shadow(0 0 5px rgba(0,123,255,0.3))'
                            }}
                        />
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            color: tab.active ? '#007bff' : '#ccc',
                            marginTop: '0.25rem',
                            letterSpacing: '0.5px'
                        }}>
                            {tab.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* CENTER — Camera Grid */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#1a1a1a',
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: visibleCameras.length > 4 ? 'repeat(4, 1fr)' : visibleCameras.length > 1 ? 'repeat(2, 1fr)' : '1fr',
                    gridTemplateRows: visibleCameras.length > 4 ? 'repeat(3, 1fr)' : visibleCameras.length > 2 ? 'repeat(2, 1fr)' : '1fr',
                    gap: '1rem',
                }}
            >
                {visibleCameras.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        gridRow: '1 / -1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        gap: '1rem'
                    }}>
                        <AlertCircle size={48} />
                        <h3 style={{ fontWeight: 800 }}>NO AUTHORIZED CAMERAS</h3>
                        <p style={{ fontSize: '0.9rem' }}>Contact administration to request access to specific security zones.</p>
                    </div>
                ) : (
                    visibleCameras.map((cam) => (
                        <div key={cam.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                                style={{
                                    flex: 1,
                                    backgroundColor: '#000',
                                    border: '1px solid #333',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Static / Visual reference */}
                                <div style={{ color: '#222' }}>
                                    <Video size={64} strokeWidth={0.5} />
                                </div>

                                {/* OSD - Camera Details */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    background: 'rgba(0,0,0,0.6)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderLeft: '2px solid #007bff'
                                }}>
                                    <span style={{ opacity: 0.7 }}>{cam.zone}</span>
                                    <span>{cam.area}</span>
                                </div>

                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    opacity: 0.5
                                }}>
                                    Live
                                </div>
                            </div>
                            <div style={{
                                padding: '0.4rem 0.75rem',
                                backgroundColor: '#0f0f1a',
                                color: '#aaa',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                border: '1px solid #333',
                                borderTop: 'none',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>CAM-00{cam.id}</span>
                                <span style={{ color: '#007bff' }}>● Active</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* BOTTOM BAR — Control Panel */}
            <div
                style={{
                    height: '60px',
                    background: '#0f0f1a',
                    borderTop: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem'
                }}
            >
                {/* Left side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button style={{
                        backgroundColor: '#0056b3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 1.2rem',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}>
                        MENU
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
                        <User size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{roles[0] || 'GUEST'}</span>
                    </div>
                </div>

                {/* Center controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#ccc' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>1</span>
                    <Grid size={18} style={{ cursor: 'pointer', color: '#007bff' }} /> {/* 4 Grid */}
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <Maximize size={18} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>9</span>

                    <div style={{ width: '1px', height: '20px', backgroundColor: '#333' }} />

                    <RefreshCcw size={18} style={{ cursor: 'pointer' }} />
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Circle size={10} fill="#ff0000" style={{ color: '#ff0000' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#ff0000' }}>REC</span>
                    </div>

                    <Camera size={18} style={{ cursor: 'pointer' }} />
                    <Database size={18} style={{ cursor: 'pointer' }} />

                    <div style={{ width: '1px', height: '20px', backgroundColor: '#333' }} />

                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', textAlign: 'right', minWidth: '150px', fontVariantNumeric: 'tabular-nums' }}>
                        {timestamp}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CCTVSection;
