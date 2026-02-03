import { Landmark } from 'lucide-react';

const FeedbackCategorySection = () => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const categories = [
        { label: 'GVP' },
        { label: 'DPVT' },
        { label: 'Souvenir' },
        { label: 'Food Court' },
        { label: 'Dhammalay' },
        { label: 'Museum' }
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#fff',
        border: '1px solid #003366',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        cursor: 'pointer',
        width: '100%',
        aspectRatio: '1 / 1',
    };

    const iconStyle = {
        color: '#D4AF37', // Gold color
        marginBottom: '1.5rem',
    };

    const labelStyle = {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#000',
        textAlign: 'center' as const,
    };

    return (
        <div
            style={{
                backgroundColor: '#fff',
                minHeight: '100%',
                padding: '4rem 2rem',
                fontFamily: systemFont,
            }}
        >
            {/* Title */}
            <h1
                style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#000',
                    textAlign: 'center',
                    textDecoration: 'underline',
                    marginBottom: '4rem',
                }}
            >
                Feedback & Suggestions
            </h1>

            {/* Grid */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem',
                        width: '100%',
                        maxWidth: '1000px',
                    }}
                >
                    {categories.map((cat, idx) => (
                        <div key={idx} style={cardStyle}>
                            <Landmark size={48} style={iconStyle} />
                            <div style={labelStyle}>{cat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedbackCategorySection;
