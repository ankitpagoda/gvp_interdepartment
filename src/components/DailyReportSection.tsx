import { CheckCheck } from 'lucide-react';
import { useRBACAuth } from '../hooks/useRBACAuth';

const DailyReportSection = () => {
    const { reportSections } = useRBACAuth();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const formattedTime = today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const rawSections = [
        {
            title: 'MR/MRI',
            items: [
                { label: 'VRI', value: '12R/4I', time: '4:58 pm', verified: true },
                { label: 'DPVT', value: '8R/2I', time: '4:52 pm', verified: true },
                { label: 'SVCT', value: '15R/6I', time: '4:45 pm', verified: true },
                { label: 'GVP', value: '20R/10I', time: '4:30 pm', verified: false },
            ]
        },
        {
            title: 'Visitor',
            items: [
                { label: 'Dhamalay', value: '45M/32F', time: '5:02 pm', verified: true },
                { label: 'Anapana', value: '110 M/85 F', time: '5:00 pm', verified: true },
                { label: 'Museum', value: '240 M/180 F', time: '4:55 pm', verified: true },
                { label: 'GVP', value: '850 Total', time: '4:50 pm', verified: true },
            ]
        },
        {
            title: 'Staff/DS',
            items: [
                { label: 'VRI', value: '28M/14F', time: '9:05 am', verified: true },
                { label: 'DPVT', value: '12M/8F', time: '8:55 am', verified: true },
                { label: 'SVCT', value: '45M/30F', time: '9:15 am', verified: true },
                { label: 'GVP', value: '120 Total', time: '9:20 am', verified: true },
            ]
        },
        {
            title: 'Vouchers',
            items: [
                { label: 'VRI', value: '04 Nos.', time: '5:10 pm', verified: true },
                { label: 'DPVT', value: '02 Nos.', time: '5:08 pm', verified: true },
                { label: 'SVCT', value: '07 Nos.', time: '5:15 pm', verified: true },
                { label: 'GVP', value: '12 Nos.', time: '5:20 pm', verified: true },
            ]
        },
        {
            title: 'Task',
            items: [
                { label: 'VRI', value: '08 Done', time: '5:30 pm', verified: true },
                { label: 'DPVT', value: '05 Done', time: '5:25 pm', verified: true },
                { label: 'SVCT', value: '14 Done', time: '5:35 pm', verified: true },
                { label: 'GVP', value: '22 Done', time: '5:40 pm', verified: true },
            ]
        },
        {
            title: 'Maintenance',
            items: [
                { label: 'Electrician', value: '03 Resolved', time: '4:40 pm', verified: true },
                { label: 'Water Man', value: '02 Resolved', time: '4:35 pm', verified: true },
                { label: 'Construction', value: '01 In-Progress', time: '4:50 pm', verified: false },
                { label: 'Driver', value: '05 Trips', time: '4:55 pm', verified: true },
            ]
        },
        {
            title: 'Water Con.',
            items: [
                { label: 'VRI', value: '1200 litter', time: '8:00 am', verified: true },
                { label: 'DPVT', value: '800 litter', time: '8:10 am', verified: true },
                { label: 'SVCT', value: '2500 litter', time: '8:05 am', verified: true },
                { label: 'GVP', value: '5000 litter', time: '8:15 am', verified: true },
            ]
        },
        {
            title: 'Power Con.',
            items: [
                { label: 'VRI', value: '45.2 kWh', time: '10:00 am', verified: true },
                { label: 'DPVT', value: '32.1 kWh', time: '10:05 am', verified: true },
                { label: 'SVCT', value: '88.5 kWh', time: '10:10 am', verified: true },
                { label: 'GVP', value: '210.0 kWh', time: '10:15 am', verified: true },
            ]
        }
    ];

    // Filter sections based on user's authorized widgets
    const filteredSections = rawSections.map(section => {
        // If mapping is not available or empty (e.g., legacy users), show all
        if (!reportSections || reportSections.length === 0) return section;

        // Special case: MR/MRI category was not in user's request but in code.
        // If it's a category we track mapping for, filter it.
        const filteredItems = section.items.filter(item => {
            const key = `${section.title}:${item.label}`;
            return reportSections.includes(key);
        });

        // For MR/MRI which isn't in mapping right now, let's keep all until admin decides otherwise
        if (section.title === 'MR/MRI') return section;

        return { ...section, items: filteredItems };
    }).filter(section => section.items.length > 0);

    return (
        <div style={{
            backgroundColor: '#fff',
            minHeight: '100%',
            padding: '2rem',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            color: '#1a1a1a'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#002855', // Navy
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>Today’s Report</h1>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    <div style={{ border: '1.5px solid #002855', borderRadius: '8px', padding: '0.4rem 1rem' }}>
                        Day :- <span style={{ color: '#002855' }}>Today</span>
                    </div>
                    <div style={{ border: '1.5px solid #002855', borderRadius: '8px', padding: '0.4rem 1rem' }}>
                        Date :- <span style={{ color: '#002855' }}>{formattedDate}</span>
                    </div>
                    <div style={{ border: '1.5px solid #002855', borderRadius: '8px', padding: '0.4rem 1rem' }}>
                        Time :- <span style={{ color: '#002855' }}>{formattedTime}</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredSections.map((section, idx) => (
                    <div key={idx} style={{ position: 'relative', marginTop: '1rem' }}>
                        {/* Section Title Label */}
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '20px',
                            backgroundColor: '#002855',
                            color: '#fff',
                            padding: '0.2rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            zIndex: 1
                        }}>
                            {section.title}
                        </div>

                        {/* Section Container */}
                        <div style={{
                            border: '1.5px solid #002855',
                            borderRadius: '12px',
                            padding: '1.5rem 1rem 0.5rem 1rem',
                            backgroundColor: '#fff'
                        }}>
                            {section.items.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.6rem 0.8rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    marginBottom: '0.6rem',
                                    fontSize: '0.85rem'
                                }}>
                                    <div style={{ fontWeight: 700, minWidth: '80px' }}>{item.label}</div>
                                    <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: '#002855' }}>
                                        {item.value}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            backgroundColor: '#f3f4f6',
                                            padding: '0.1rem 0.4rem',
                                            borderRadius: '4px',
                                            color: '#6b7280',
                                            fontWeight: 500
                                        }}>
                                            {item.time}
                                        </div>
                                        {item.verified && (
                                            <CheckCheck size={14} color="#0d9488" strokeWidth={3} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyReportSection;
