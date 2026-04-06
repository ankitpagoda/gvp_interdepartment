import express from 'express';
import cors from 'cors';
import { callLLM } from './llmProvider.js';
import bookingStore from './bookingStore.js';

const app = express();
app.use(cors());
app.use(express.json());

// Assistant message endpoint: routes messages to the llmProvider and executes structured actions
app.post('/api/assistant/message', async (req, res) => {
    const { user, message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message required' });
    try {
        const result = await callLLM({ user, message });
        if (result?.action === 'book_room') {
            const slots = result.slots || {};
            const missing = [];
            if (!slots.dhammasevak_name) missing.push('dhammasevak_name');
            if (!slots.date) missing.push('date');
            if (!slots.start_time) missing.push('start_time');
            if (slots.duration_minutes === null || slots.duration_minutes === undefined) missing.push('duration_minutes');
            if (missing.length > 0) return res.json({ action: 'clarify', questions: missing.map(s => `Please provide ${s}`) });

            try {
                const booking = bookingStore.createBooking({
                    dhammasevak_name: slots.dhammasevak_name,
                    date: slots.date,
                    start_time: slots.start_time,
                    duration_minutes: slots.duration_minutes,
                    room: slots.room || 'Meditation Hall 1',
                    created_by: user
                });
                return res.json({ action: 'book_room', booking, assistant: `Booked ${booking.room}` });
            } catch (e) {
                return res.status(400).json({ error: e.message });
            }
        } else if (result?.action === 'clarify') {
            return res.json(result);
        } else {
            return res.json({ assistant: result.assistant || "I didn't understand that." });
        }
    } catch (e) {
        return res.status(500).json({ error: 'assistant error' });
    }
});

// Basic bookings CRUD used by UI and tests
app.post('/api/bookings', (req, res) => {
    try {
        const b = bookingStore.createBooking(req.body);
        return res.status(201).json(b);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
});

app.get('/api/bookings', (req, res) => {
    const filter = {};
    if (req.query.dhammasevak_name) filter.dhammasevak_name = req.query.dhammasevak_name;
    if (req.query.date) filter.date = req.query.date;
    const list = bookingStore.listBookings(filter);
    res.json(list);
});

app.patch('/api/bookings/:id', (req, res) => {
    try {
        const updated = bookingStore.modifyBooking(req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/api/bookings/:id', (req, res) => {
    try {
        const canceled = bookingStore.cancelBooking(req.params.id);
        res.json({ canceled: true, booking: canceled });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Assistant server running on port ${port}`));
}

export default app;