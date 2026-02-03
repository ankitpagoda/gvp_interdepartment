import BaseRecordCard from './BaseRecordCard';

const AnnouncementsWindowSection = () => {
    const announcements = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'Administration' },
            to: { name: 'All Staff', dept: 'Global Vipassana Pagoda' },
            time: '22 Hour Ago',
            description: 'Please note that the monthly staff meeting will be held today at 4:30 PM in the Main Hall. Attendance is mandatory for all department heads and available staff members. We will be discussing the upcoming Mega Course logistics.'
        },
        {
            from: { name: 'Dr. John Doe', dept: 'Management' },
            to: { name: 'Reception & Security', dept: 'GVP' },
            time: 'Yesterday',
            description: 'New security protocol updates for the South Gate entry. Please ensure all temporary visitor badges are scanned and recorded in the digital register before entry. This change is effective immediately.'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {announcements.map((item, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`From ${item.from.name} | ${item.from.dept} | ${item.time}`}
                    fields={[
                        { label: 'To', value: `${item.to.name} (${item.to.dept})` },
                        { label: 'Description', value: item.description, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default AnnouncementsWindowSection;
