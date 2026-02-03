import BaseRecordCard from './BaseRecordCard';

const ReceivedRequestsSection = ({ department }: { department?: string }) => {
    // Mock data with "to" field for filtering
    const allRequests = [
        {
            to: 'Reception',
            category: 'Guest',
            from: { name: 'Mr. ABC P XYZ', dept: 'IT Dept', time: '22 Hour Ago' },
            givenBy: { name: 'Dr. John Doe', dept: 'PR Dept', time: 'Yesterday' },
            task: 'Register VIP Guest (Suite 101)',
            status: 'Pending',
            reason: 'High priority guest arrival for management meeting.'
        },
        {
            to: 'Reception',
            category: 'Visitor',
            from: { name: 'Mrs. Jane Smith', dept: 'PR Dept', time: 'Yesterday' },
            givenBy: { name: 'Mr. X Manager', dept: 'Admin', time: '2 Days Ago' },
            task: 'Coordinate badges for Group Visit',
            status: 'In Progress',
            reason: 'School group of 120 people expected at Museum.'
        },
        {
            to: 'Transport',
            category: 'Vehicle',
            from: { name: 'Driver X', dept: 'Reception', time: '5 Hour Ago' },
            givenBy: { name: 'Transport Head', dept: 'Logistics', time: 'Morning' },
            task: 'Airport pickup for Trustee Members (Bus-04)',
            status: 'Dispatched',
            reason: 'Scheduled arrival at 2:00 PM.'
        },
        {
            to: 'Kitchen',
            category: 'Meal',
            from: { name: 'Mr. Chef', dept: 'Dhammalay', time: '10 Hour Ago' },
            givenBy: { name: 'Supervisor', dept: 'Catering', time: 'Today' },
            task: 'Special Satvic Meal preparation for 200 guests',
            status: 'In Progress',
            reason: 'Arrival of international delegation.'
        },
        {
            to: 'Dhammalay',
            category: 'Course',
            from: { name: 'Mr. ABC P XYZ', dept: 'Reception', time: '22 Hour Ago' },
            givenBy: { name: 'Teacher A', dept: 'C-Section', time: 'Yesterday' },
            task: 'Register 50 students for 10-Day Dhamma Course',
            status: 'Processing',
            reason: 'High demand for upcoming meditation retreat.'
        }
    ];

    const filteredRequests = department
        ? allRequests.filter(req => req.to === department)
        : allRequests;

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {filteredRequests.length > 0 ? (
                filteredRequests.map((req, idx) => (
                    <BaseRecordCard
                        key={idx}
                        header={`${req.category} Request | ${req.from.dept} | ${req.from.time}`}
                        fields={[
                            { label: 'From', value: req.from.name },
                            { label: 'Given By', value: `${req.givenBy.name} (${req.givenBy.dept})` },
                            { label: 'Task', value: req.task },
                            { label: 'Status', value: req.status },
                            { label: 'Reason', value: req.reason, fullWidth: true },
                        ]}
                    />
                ))
            ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: '700' }}>
                    No incoming requests for {department || 'this department'}.
                </div>
            )}
        </div>
    );
};

export default ReceivedRequestsSection;
