import BaseRecordCard from './BaseRecordCard';

const VisitorReportWindowSection = () => {
    const reports = [
        {
            from: 'Mr. ABC P XYZ',
            dept: 'Reception',
            time: '22 Hour Ago',
            location: 'Main Pagoda Reception',
            visitorCount: '45 People (General Entry)'
        },
        {
            from: 'Mrs. Jane Smith',
            dept: 'PR Dept',
            time: 'Yesterday',
            location: 'Museum Entrance',
            visitorCount: '120 People (School Group)'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {reports.map((report, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`Location: Museum / Anapan / Dhammalay | ${report.time}`}
                    fields={[
                        { label: 'Report From', value: `${report.from} (${report.dept})` },
                        { label: 'Location', value: report.location },
                        { label: 'Visitor', value: report.visitorCount },
                    ]}
                />
            ))}
        </div>
    );
};

export default VisitorReportWindowSection;
