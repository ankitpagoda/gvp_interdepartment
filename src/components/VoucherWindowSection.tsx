import BaseRecordCard from './BaseRecordCard';

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
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {vouchers.map((voucher, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`By ${voucher.name} | ${voucher.dept} | ${voucher.time}`}
                    fields={[
                        { label: 'Amount', value: `₹ ${voucher.amount}/-` },
                        { label: 'Given For', value: voucher.givenFor },
                        { label: 'Description', value: voucher.description, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default VoucherWindowSection;
