import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import bookingStore from '../bookingStore.js';

beforeEach(() => {
    bookingStore.resetBookings();
});

describe('Assistant endpoint E2E', () => {
    it('books a room via assistant (happy path)', async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().slice(0, 10);
        const msg = `Book a room for dhammasevak Samanera Nirodha on ${dateStr} at 18:00 for 2 hours.`;

        const res = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u1', name: 'User One' }, message: msg });
        expect(res.status).toBe(200);
        expect(res.body.action).toBe('book_room');
        expect(res.body.booking).toBeDefined();
    });

    it('returns clarify when date missing', async () => {
        const msg = `Book a room for dhammasevak Samanera Nirodha at 18:00 for 2 hours.`;
        const res = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u1', name: 'User One' }, message: msg });
        expect(res.status).toBe(200);
        expect(res.body.action).toBe('clarify');
        expect(Array.isArray(res.body.questions)).toBe(true);
    });

    it('prevents double booking', async () => {
        const D = new Date(); D.setDate(D.getDate() + 2);
        const dateStr = D.toISOString().slice(0, 10);
        const msg1 = `Book a room for dhammasevak A on ${dateStr} at 10:00 for 2 hours.`;
        const r1 = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u1' }, message: msg1 });
        expect(r1.status).toBe(200);

        const msg2 = `Book a room for dhammasevak B on ${dateStr} at 11:00 for 2 hours.`;
        const r2 = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u2' }, message: msg2 });
        expect(r2.status).toBe(400);
        expect(r2.body.error).toMatch(/Time slot not available/);
    });

    it('modify and cancel lifecycle via bookings endpoints', async () => {
        const day = new Date(); day.setDate(day.getDate() + 3);
        const dateStr = day.toISOString().slice(0, 10);
        const msg = `Book a room for dhammasevak Lifecycle on ${dateStr} at 09:00 for 1 hours.`;
        const r = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u3' }, message: msg });
        expect(r.status).toBe(200);
        const id = r.body.booking.id;

        const patch = await request(app).patch(`/api/bookings/${id}`).send({ start_time: '10:00' });
        expect(patch.status).toBe(200);
        expect(patch.body.start_time).toBe('10:00');

        const del = await request(app).delete(`/api/bookings/${id}`);
        expect(del.status).toBe(200);
        expect(del.body.canceled).toBe(true);

        const list = await request(app).get('/api/bookings').query({ date: dateStr });
        expect(Array.isArray(list.body)).toBe(true);
        const found = list.body.find(b => b.id === id);
        expect(found).toBeUndefined();
    });

    it('rejects past date or invalid duration', async () => {
        const past = new Date(); past.setDate(past.getDate() - 1);
        const pastDate = past.toISOString().slice(0, 10);
        const msg = `Book a room for dhammasevak Past on ${pastDate} at 08:00 for 1 hours.`;
        const r = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u5' }, message: msg });
        expect(r.status).toBe(400);

        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const tdate = tomorrow.toISOString().slice(0, 10);
        const zeroDur = `Book a room for dhammasevak Zero on ${tdate} at 09:00 for 0 hours.`;
        const r2 = await request(app).post('/api/assistant/message').send({ user: { staffId: 'u6' }, message: zeroDur });
        expect(r2.status).toBe(400);
    });
});