import BaseRecordCard from './BaseRecordCard';

const InProgressSection = () => {
    const activeTasks = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'Maintenence' },
            location: 'Main Pagoda - Area 4',
            task: 'Repairing the lighting fixtures in the meditation hall.',
            status: 'Currently 70% complete',
            reason: 'Extended due to intricate wiring adjustments.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. John Smith', dept: 'IT' },
            location: 'Reception Server Room',
            task: 'Replacing network switches and re-organizing cable management.',
            status: 'Testing connectivity',
            reason: 'Urgent maintenance requested by administration.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {activeTasks.map((task, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`By ${task.from.name} | ${task.from.dept} | ${task.time}`}
                    fields={[
                        { label: 'Location', value: task.location },
                        { label: 'Status', value: task.status },
                        { label: 'Task', value: task.task, fullWidth: true },
                        { label: 'Reason', value: task.reason, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default InProgressSection;
