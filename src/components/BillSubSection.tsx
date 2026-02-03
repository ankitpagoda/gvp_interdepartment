import { Plus, Upload } from 'lucide-react';

const BillSubSection = () => {
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
        marginBottom: '0.5rem',
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
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Bill Sub (Voucher) :- BS00</h1>
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
                        <label style={labelStyle}>By :- Department / Center / Person</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>from :- Person Name</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Date :- DD/MM/YYYY</label>
                            <input type="text" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>MR :- MR Number</label>
                            <input type="text" style={inputStyle} />
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Item :- Department / Center / Person</label>
                        <div style={{ position: 'relative', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="text" style={inputStyle} />
                            <button style={{
                                flexShrink: 0,
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                border: '2px solid #1a1a1a',
                                background: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Bill Amount :-</label>
                        <input type="text" style={inputStyle} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Particular :-</label>
                        <textarea rows={5} style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Clarification :-</label>
                        <textarea rows={4} style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <label style={labelStyle}>Upload :-</label>
                        <div style={{
                            border: '2px dashed #1a1a1a',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            color: '#666',
                            cursor: 'pointer'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Upload size={24} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Choose file or drag here to upload voucher/bill</span>
                            </div>
                        </div>
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

export default BillSubSection;
