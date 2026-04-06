// Minimal LLM client substitute: parses user text into structured booking actions or clarifying questions
export function parseMessage({ user, message }) {
    const text = (message || '').trim();
    const lower = text.toLowerCase();

    if ((lower.includes('book') || lower.includes('reserve')) && (lower.includes('dhammasevak') || lower.includes('room'))) {
        // Try to extract name after 'for' optionally preceded by 'dhammasevak'
        const nameMatch = text.match(/for(?:\s+dhammasevak)?\s+([A-Za-z][A-Za-z ]+?)(?:\s+on|\s+at|\s+for|$)/i);
        const dhammasevak_name = nameMatch ? nameMatch[1].trim() : null;

        // ISO date like 2026-02-14
        const isoMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
        let date = isoMatch ? isoMatch[1] : null;
        if (!date) {
            if (lower.includes('tomorrow')) {
                const d = new Date(); d.setDate(d.getDate() + 1);
                date = d.toISOString().slice(0, 10);
            } else if (lower.includes('today')) {
                date = new Date().toISOString().slice(0, 10);
            }
        }

        // time like 'at 18:00'
        const timeMatch = text.match(/at\s*(\d{1,2}:\d{2})/i);
        let start_time = timeMatch ? timeMatch[1] : null;
        if (!start_time) {
            if (lower.includes('morning')) start_time = '09:00';
            else if (lower.includes('evening') || lower.includes('night')) start_time = '18:00';
        }

        // duration e.g., 'for 2 hours'
        const durMatch = text.match(/for\s*(\d+)\s*(?:hours|hrs?|hour|h)/i);
        const duration_minutes = durMatch ? parseInt(durMatch[1], 10) * 60 : null;

        const slots = { dhammasevak_name, date, start_time, duration_minutes };
        const missing = [];
        if (!dhammasevak_name) missing.push('dhammasevak_name');
        if (!date) missing.push('date');
        if (!start_time) missing.push('start_time');
        if (duration_minutes === null || duration_minutes === undefined) missing.push('duration_minutes');

        if (missing.length > 0) {
            return { action: 'clarify', questions: missing.map(m => `Please provide ${m.replace('_', ' ')}`) };
        }

        return { action: 'book_room', slots: { dhammasevak_name, date, start_time, duration_minutes } };
    }

    return { assistant: "Sorry, I can only help with room bookings for now. Try: 'Book a room for dhammasevak Name on 2026-02-14 at 18:00 for 2 hours'." };
}

export default { parseMessage };