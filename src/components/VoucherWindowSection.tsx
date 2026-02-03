import { User, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Link, RotateCw, Mic, CheckCheck } from 'lucide-react';

const VoucherCard = ({ name, dept, time, amount, givenFor, description }: any) => {
    const systemFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

    const rowContainerStyle = {
        border: '1px solid #1e3a8a',
        borderRadius: '20px',
        padding: '0.6rem 1.25rem',
        marginBottom: '0.75rem',
        fontSize: '0.95rem',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff'
    };

    const labelStyle = {
        fontWeight: '700',
        color: '#1e3a8a',
        marginRight: '0.5rem',
        whiteSpace: 'nowrap' as const
    };

    const descriptionBlockStyle = {
        border: '1px solid #1e3a8a',
        borderRadius: '20px',
        padding: '1.25rem',
        minHeight: '100px',
        backgroundColor: '#fff',
        color: '#1a1a1a'
    };

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderBottom: '2px solid #1e3a8a',
            position: 'relative',
            fontFamily: systemFont,
            margin: '0.5rem 0'
        }}>
            {/* Left Column: Avatar */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: 'center'
            }}>
                <User size={50} color="#000" fill="#000" />
            </div>

            {/* Right Column: Fields */}
            <div style={{ flex: 1 }}>
                {/* Header Row */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{ ...rowContainerStyle, paddingRight: '2.5rem' }}>
                        {name} | {dept} | {time}
                    </div>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <MoreVertical size={20} color="#1e3a8a" />
                    </div>
                </div>

                {/* Amount Row */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Amount:-</span>
                    <span style={{ fontWeight: '800' }}>₹ {amount}/-</span>
                </div>

                {/* Given For Row */}
                <div style={rowContainerStyle}>
                    <span style={labelStyle}>Given For:-</span>
                    <span>{givenFor}</span>
                </div>

                {/* Description Block */}
                <div style={descriptionBlockStyle}>
                    <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Description:-</div>
                    <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{description}</div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', color: '#1e3a8a' }}>
                        <ThumbsUp size={22} style={{ cursor: 'pointer' }} />
                        <ThumbsDown size={22} style={{ cursor: 'pointer' }} />
                        <MessageSquare size={22} style={{ cursor: 'pointer' }} />
                        <Link size={22} style={{ cursor: 'pointer' }} />
                        <RotateCw size={22} style={{ cursor: 'pointer' }} />
                        <Mic size={22} style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ color: '#10b981', cursor: 'pointer' }}>
                        <CheckCheck size={28} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const VoucherWindowSection = () => {
    const vouchers = [
        {
            name: 'Mr. ABC P XYZ',
            dept: 'Maintenance',
            time: '22 Hour Ago',
            amount: '1,500.00',
            givenFor: 'Hardware Supplies',
            description: 'Emergency repair of plumbing fixtures in Block B. Purchased pipes and adhesive from local vendor.'
        },
        {
            name: 'Mrs. Jane Smith',
            dept: 'IT Dept',
            time: 'Yesterday',
            amount: '450.00',
            givenFor: 'Office Stationery',
            description: 'Printing supplies and high-quality paper for administrative reports.'
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', overflowY: 'auto' }}>
            {vouchers.map((voucher, idx) => (
                <VoucherCard key={idx} {...voucher} />
            ))}
        </div>
    );
};

export default VoucherWindowSection;
