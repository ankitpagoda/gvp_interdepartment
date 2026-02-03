import BaseRecordCard from './BaseRecordCard';

const TaskReportsSection = () => {
    const reports = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept' },
            givenBy: { name: 'Dr. Manager', dept: 'Admin' },
            task: 'Complete the migration of the database to the new server environment.',
            status: 'In Progress',
            reason: 'Waiting for vendor confirmation on firewall rules.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mr. John Doe', dept: 'Accounts' },
            givenBy: { name: 'Finance Head', dept: 'Management' },
            task: 'Audit the voucher entries for the month of January.',
            status: 'Pending',
            reason: 'Data collection from DPVT department is still under review.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {reports.map((report, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`From ${report.from.name} | ${report.from.dept} | ${report.time}`}
                    fields={[
                        { label: 'Given By', value: `${report.givenBy.name} (${report.givenBy.dept})` },
                        { label: 'Status', value: report.status },
                        { label: 'Task', value: report.task, fullWidth: true },
                        { label: 'Reason', value: report.reason, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default TaskReportsSection;
