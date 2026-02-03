import { Plus } from 'lucide-react';

const IssueSubmissionSection = () => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const cardStyle = {
        width: '100%',
        maxWidth: '850px',
        backgroundColor: '#fff',
        border: '2px solid #1e3a8a', // Dark blue
        borderRadius: '32px',
        padding: '3rem',
        margin: '2rem auto',
    };

    const headerStyle = {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#000',
        marginBottom: '2.5rem',
        textAlign: 'left' as const,
    };

    const fieldContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        border: '2.5px solid #1e3a8a',
        borderRadius: '40px',
        padding: '0.8rem 1.75rem',
        marginBottom: '1.25rem',
        width: '100%',
    };

    const labelStyle = {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#000',
        marginRight: '0.5rem',
        whiteSpace: 'nowrap' as const,
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        flex: 1,
        fontSize: '0.95rem',
        color: '#000',
        backgroundColor: 'transparent',
        fontFamily: systemFont,
    };

    const textAreaContainerStyle = {
        border: '2.5px solid #1e3a8a',
        borderRadius: '24px',
        padding: '1.25rem 1.75rem',
        marginBottom: '1.25rem',
        width: '100%',
    };

    const textAreaStyle = {
        border: 'none',
        outline: 'none',
        width: '100%',
        minHeight: '120px',
        fontSize: '0.95rem',
        color: '#000',
        backgroundColor: 'transparent',
        fontFamily: systemFont,
        resize: 'none' as const,
    };

    const submitButtonStyle = {
        backgroundColor: '#fff',
        border: '2.5px solid #1e3a8a',
        borderRadius: '30px',
        padding: '0.75rem 5rem',
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#000',
        cursor: 'pointer',
        marginTop: '2rem',
        fontFamily: systemFont,
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', padding: '2rem', fontFamily: systemFont }}>
            <div style={cardStyle}>
                <h1 style={headerStyle}>Issue :- IS00</h1>

                {/* Issue By */}
                <div style={fieldContainerStyle}>
                    <span style={labelStyle}>Issue By:-</span>
                    <input style={inputStyle} placeholder="Department / Center / Person" />
                </div>

                {/* Issue From */}
                <div style={fieldContainerStyle}>
                    <span style={labelStyle}>Issue from:-</span>
                    <input style={inputStyle} placeholder="Person Name" />
                </div>

                {/* Issue Date */}
                <div style={fieldContainerStyle}>
                    <span style={labelStyle}>Issue Date:-</span>
                    <input style={inputStyle} placeholder="DD/MM/YYYY" />
                </div>

                {/* Issue To (Person) */}
                <div style={fieldContainerStyle}>
                    <span style={labelStyle}>Issue to:-</span>
                    <input style={inputStyle} placeholder="Person Name" />
                </div>

                {/* issue To (Department) */}
                <div style={fieldContainerStyle}>
                    <span style={labelStyle}>issue To:-</span>
                    <input style={inputStyle} placeholder="Department / Center / Person" />
                </div>

                {/* Type */}
                <div style={fieldContainerStyle}>
                    <span style={labelStyle}>Type:-</span>
                    <span style={{ ...inputStyle, color: '#666' }}>Material</span>
                    <Plus size={24} color="#1e3a8a" style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                </div>

                {/* Particular */}
                <div style={textAreaContainerStyle}>
                    <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Particular:-</div>
                    <textarea style={textAreaStyle} />
                </div>

                {/* Clarification */}
                <div style={textAreaContainerStyle}>
                    <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Clarification:-</div>
                    <textarea style={textAreaStyle} />
                </div>

                {/* Submit */}
                <div style={{ textAlign: 'center' }}>
                    <button style={submitButtonStyle}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default IssueSubmissionSection;
