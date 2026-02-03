import { ChevronLeft, ChevronRight } from 'lucide-react';

const MeditationSection = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');

    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '2px solid #1a1a1a',
        backgroundColor: '#fff',
        fontSize: '0.95rem',
        outline: 'none',
        fontFamily: systemFont,
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        color: '#1a1a1a',
    };

    const fieldGroupStyle = {
        marginBottom: '1.5rem',
    };

    return (
        <div
            style={{
                backgroundColor: '#fff',
                minHeight: '100%',
                padding: '2rem',
                color: '#1a1a1a',
                fontFamily: systemFont
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Meditation :- MD00</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{
                        border: '2px solid #1a1a1a',
                        borderRadius: '20px',
                        padding: '0.4rem 1.25rem',
                        fontSize: '0.9rem',
                        fontWeight: '700'
                    }}>
                        Today :- {formattedDate}
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
                {/* Spacer for balance */}
                <div style={{ width: '100px', visibility: 'hidden' }} />
            </div>

            {/* Form Container */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    width: '100%',
                    maxWidth: '500px',
                    border: '2px solid #1a1a1a',
                    borderRadius: '16px',
                    padding: '2.5rem'
                }}>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Morning :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Afternoon :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Evening :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Last Course :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Next Course :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={labelStyle}>Total Courses :-</label>
                        <textarea
                            rows={4}
                            style={{ ...inputStyle, resize: 'none' }}
                        />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button style={{
                            background: 'none',
                            border: '2px solid #1a1a1a',
                            borderRadius: '30px',
                            padding: '0.75rem 3rem',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            color: '#1a1a1a',
                            transition: 'all 0.2s'
                        }}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeditationSection;
