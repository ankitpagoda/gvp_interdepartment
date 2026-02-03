import BaseRecordCard from './BaseRecordCard';

const ConsumptionReportWindowSection = () => {
    const reports = [
        {
            location: 'Museum / Anapan / Dhammalay',
            water: '1,200 Liters (Daily usage)',
            power: '450 kWh (NVR & Lighting)',
            reportedBy: 'Mr. ABC P XYZ | Maintenance Dept',
            time: '22 Hour Ago'
        },
        {
            location: 'Main Pagoda / Souvenir',
            water: '3,500 Liters (Tank B)',
            power: '1,250 kWh (Central A/C)',
            reportedBy: 'Mrs. Jane Smith | Electrical Dept',
            time: 'Yesterday'
        }
    ];

    return (
        <div style={{ backgroundColor: '#f0f9ff', minHeight: '100%', width: '100%', overflowY: 'auto', padding: '1.5rem' }}>
            {reports.map((report, idx) => (
                <BaseRecordCard
                    key={idx}
                    header={`Location: ${report.location} | ${report.time}`}
                    fields={[
                        { label: 'Water Consumption', value: report.water },
                        { label: 'Power Consumption', value: report.power },
                        { label: 'Report By', value: report.reportedBy, fullWidth: true },
                    ]}
                />
            ))}
        </div>
    );
};

export default ConsumptionReportWindowSection;
