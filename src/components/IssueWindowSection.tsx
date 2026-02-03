import BaseRecordCard from './BaseRecordCard';

const IssueWindowSection = () => {
    const issues = [
        {
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept' },
            to: { name: 'Mr. Manager', dept: 'Reception' },
            description: 'Connectivity issues reported in the main lobby access points. Need immediate technical inspection as it is affecting guest check-ins.',
            time: '22 Hour Ago'
        },
        {
            from: { name: 'Mrs. Jane Smith', dept: 'Housekeeping' },
            to: { name: 'Mr. Supervisor', dept: 'Maintenance' },
            description: 'Leakage observed in the block C corridor ceiling. Probable pipe burst in the upper floor washroom area.',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {issues.map((issue, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`From ${issue.from.name} | ${issue.from.dept} | ${issue.time}`}
                    fields={[
                        { label: 'Issue To', value: `${issue.to.name} (${issue.to.dept})` },
                        { label: 'Description', value: issue.description, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default IssueWindowSection;
