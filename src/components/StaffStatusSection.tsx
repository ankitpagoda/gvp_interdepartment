import BaseRecordCard from './BaseRecordCard';

const StaffStatusSection = () => {
    const staffData = [
        { name: 'Mr. ABC P XYZ', status: 'Present', reason: 'N/A', task: 'TK-402', dept: 'Development', time: '2 Hour Ago' },
        { name: 'Mrs. JKL M NOP', status: 'Seek Leave', reason: 'Medical Emergency', task: 'N/A', dept: 'Admin', time: '5 Hour Ago' },
        { name: 'Mr. QRS T UVW', status: 'Present', reason: 'Late Entry (15 mins)', task: 'TK-105', dept: 'Reception', time: 'Yesterday' },
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {staffData.map((staff, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`By ${staff.name} | ${staff.dept} | ${staff.time}`}
                    fields={[
                        { label: 'Name', value: staff.name },
                        { label: 'Status', value: staff.status },
                        { label: 'Working On', value: staff.task },
                        { label: 'Reason', value: staff.reason, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default StaffStatusSection;
