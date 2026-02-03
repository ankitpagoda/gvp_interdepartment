import BaseRecordCard from './BaseRecordCard';

const MeditationWindowSection = () => {
    const meditationRecords = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'Development' },
            today: 'Morning: 1hr | Evening: 45min',
            lastCourse: '10-Day Course, Dhamma Giri (Jan 2026)',
            totalCourse: '05 Courses',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mrs. Jane Smith', dept: 'Admin' },
            today: 'Morning: 1hr | Evening: 1hr',
            lastCourse: 'Satipatthana Course, Pagoda (Nov 2025)',
            totalCourse: '12 Courses',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {meditationRecords.map((record, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`From ${record.from.name} | ${record.from.dept} | ${record.time}`}
                    fields={[
                        { label: 'Meditation Today', value: record.today, fullWidth: true },
                        { label: 'Last Course', value: record.lastCourse },
                        { label: 'Total Course', value: record.totalCourse },
                    ]}
                />
            ))}
        </div>
    );
};

export default MeditationWindowSection;
