import BaseRecordCard from './BaseRecordCard';

const MovementViewSection = () => {
    const mvRecords = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept' },
            item: 'Laptop Dell Latitude 5420 (Asset ID: IT-042)',
            description: 'Item being moved from main server room to the new IT workspace on the 2nd floor for user assignment.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. John Doe', dept: 'Souvenir' },
            item: 'Wooden Buddha Statue (Box of 12)',
            description: 'Transferring stock from warehouse to the retail counter for weekend display.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {mvRecords.map((record, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`From ${record.from.name} | ${record.from.dept} | ${record.time}`}
                    fields={[
                        { label: 'Item', value: record.item },
                        { label: 'Description', value: record.description, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default MovementViewSection;
