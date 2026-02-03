import { Plus, ChevronDown } from 'lucide-react';

const IssueSection = () => {
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
        color: '#1a1a1a',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '700',
        marginBottom: '0.4rem',
        color: '#1a1a1a',
    };

    const fieldGroupStyle = {
        marginBottom: '1.25rem',
    };

    const plusButtonStyle = {
        flexShrink: 0,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: '2px solid #1a1a1a',
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
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
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Issue :- IS00</h1>
            </div>

            {/* Form Container */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    border: '2px solid #1a1a1a',
                    borderRadius: '16px',
                    padding: '3rem',
                    backgroundColor: '#fff'
                }}>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Issue By :- Department / Center / Person</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Issue from :- Person Name</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Issue Date :- DD/MM/YYYY</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Issue to :- Person Name</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Issue To :- Department / Center / Person</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Type :- Material</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                    <option value="">Select Material Type</option>
                                    <option value="stationery">Stationery</option>
                                    <option value="electronic">Electronic</option>
                                    <option value="medical">Medical</option>
                                    <option value="furniture">Furniture</option>
                                    <option value="tools">Tools</option>
                                </select>
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                            <button style={plusButtonStyle}>
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Particular :-</label>
                        <textarea rows={5} style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <label style={labelStyle}>Clarification :-</label>
                        <textarea rows={4} style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button style={{
                            background: 'none',
                            border: '2px solid #1a1a1a',
                            borderRadius: '30px',
                            padding: '0.75rem 4rem',
                            fontSize: '1.1rem',
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

export default IssueSection;
