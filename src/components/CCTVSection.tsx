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
    Type,
    ZoomIn,
    Camera,
    Circle,
    Maximize
} from 'lucide-react';

const CCTVSection = () => {
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

    const cameraList = Array.from({ length: 6 }, (_, i) => i + 1);

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

            {/* CENTER — Camera Grid (3 x 2) */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#1a1a1a',
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '1rem',
                }}
            >
                {cameraList.map((id) => (
                    <div key={id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                border: '1px solid #333',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Visual reference instead of video */}
                            <div style={{ color: '#eee' }}>
                                <Video size={64} strokeWidth={0.5} />
                            </div>

                            {/* OSD - Mini Label inside frame */}
                            <div style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'rgba(0,0,0,0.5)',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                color: '#fff',
                                fontSize: '0.7rem',
                                fontWeight: '600'
                            }}>
                                CH{id}
                            </div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '0.25rem 0',
                            backgroundColor: '#0f0f1a',
                            color: '#ccc',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            border: '1px solid #333',
                            borderTop: 'none'
                        }}>
                            CCTV {id}
                        </div>
                    </div>
                ))}
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
                        <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>ADMIN</span>
                    </div>
                </div>

                {/* Center controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#ccc' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>1</span>
                    <Grid size={18} style={{ cursor: 'pointer' }} /> {/* 4 Grid */}
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <Maximize size={18} />
                        <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: '8px' }}>6</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>9</span>

                    <div style={{ width: '1px', height: '20px', backgroundColor: '#333' }} />

                    <RefreshCcw size={18} style={{ cursor: 'pointer' }} />
                    <Type size={18} style={{ cursor: 'pointer' }} /> {/* OSD Toggle */}
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#ccc' }}>
                    <ZoomIn size={18} style={{ cursor: 'pointer' }} />
                    <Volume2 size={18} style={{ cursor: 'pointer' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Circle size={10} fill="#ff0000" style={{ color: '#ff0000' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#ff0000' }}>REC</span>
                    </div>

                    <Camera size={18} style={{ cursor: 'pointer' }} />
                    <Database size={18} style={{ cursor: 'pointer' }} />

                    <div style={{ width: '1px', height: '20px', backgroundColor: '#333' }} />

                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', textAlign: 'right', minWidth: '150px' }}>
                        {timestamp}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CCTVSection;
