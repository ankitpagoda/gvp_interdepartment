import { getRequests, saveRequests } from './mockDb';

export const checkSLAs = () => {
    const requests = getRequests();
    let changed = false;

    const updatedRequests = requests.map(req => {
        if (req.status !== 'Pending Approval') return req;

        const hoursSince = (Date.now() - req.createdAt) / (1000 * 60 * 60);

        // After 24 hours: Auto-send reminder (Simulation)
        if (hoursSince >= 24 && !req.slaReminderSent) {
            console.log(`[SLA] Reminder sent for ${req.id} to ${req.department}`);
            req.slaReminderSent = true;
            req.history.push({
                timestamp: Date.now(),
                actorId: 'system-sla',
                actorName: 'System (SLA)',
                action: 'Auto-Reminder',
                comments: 'Auto-reminder sent to department (24h SLA)'
            });
            changed = true;
        }

        // After 48 hours: Escalate to Higher Authority
        if (hoursSince >= 48 && !req.slaEscalated) {
            console.log(`[SLA] Escalated ${req.id} to Higher Authority`);
            req.slaEscalated = true;
            req.status = 'Escalated';
            req.history.push({
                timestamp: Date.now(),
                actorId: 'system-sla',
                actorName: 'System (SLA)',
                action: 'Auto-Escalation',
                comments: 'Request escalated to Super Admin (48h SLA)'
            });
            changed = true;
        }

        return req;
    });

    if (changed) {
        saveRequests(updatedRequests);
    }
};

