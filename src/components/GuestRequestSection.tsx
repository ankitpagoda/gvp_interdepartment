import { Plus, ChevronDown } from 'lucide-react';

const GuestRequestSection = () => {
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
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Guest Request :- MR00</h1>
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
                        <label style={labelStyle}>Request By :- Department</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Request from :- Person Name</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Request Date :- DD/MM/YYYY</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Request To :- Person Name</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="text" style={inputStyle} />
                            <button style={plusButtonStyle}>
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Request To :- Department</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="text" style={inputStyle} />
                            <button style={plusButtonStyle}>
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Person Name :-</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="text" style={inputStyle} />
                            <button style={plusButtonStyle}>
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Request Type :- Leave / Book / Vehicle / Medicine</label>
                        <div style={{ position: 'relative' }}>
                            <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                <option value="">Select Request Type</option>
                                <option value="leave">Leave</option>
                                <option value="book">Book</option>
                                <option value="vehicle">Vehicle</option>
                                <option value="medicine">Medicine</option>
                            </select>
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Description :-</label>
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

export default GuestRequestSection;
