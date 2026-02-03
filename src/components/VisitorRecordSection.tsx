const VisitorRecordSection = () => {
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
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Visitor :- VS00</h1>
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
                        <label style={labelStyle}>Name :- Person Name</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Department :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Date :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Location :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Indian Visitor :- 00M / 00F</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Foreign Visitor :- 00M / 00F</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Total Visitor :- 00M / 00F</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <label style={labelStyle}>Clarification :-</label>
                        <textarea rows={5} style={{ ...inputStyle, resize: 'none' }} />
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

export default VisitorRecordSection;
