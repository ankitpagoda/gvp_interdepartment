import { describe, it, expect, beforeEach } from 'vitest';
import bookingStore from '../bookingStore.js';

beforeEach(() => {
    bookingStore.resetBookings();
});

describe('BookingStore lifecycle (E2E-like)', () => {
    it('creates a booking (happy path)', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().slice(0, 10);

        const b = bookingStore.createBooking({
            dhammasevak_name: 'Samanera Nirodha',
            date: dateStr,
            start_time: '18:00',
            duration_minutes: 120,
            room: 'Meditation Hall 1',
            created_by: 'tester'
        });

        expect(b).toBeDefined();
        expect(b.id).toBeDefined();
        expect(b.dhammasevak_name).toBe('Samanera Nirodha');
        expect(b.status).toBe('CONFIRMED');
    });

    it('detects conflicts and prevents double-booking', () => {
        const D = new Date(); D.setDate(D.getDate() + 2);
        const dateStr = D.toISOString().slice(0, 10);

        bookingStore.createBooking({ dhammasevak_name: 'A', date: dateStr, start_time: '10:00', duration_minutes: 120, room: 'Hall', created_by: 'u1' });
        expect(() => bookingStore.createBooking({ dhammasevak_name: 'B', date: dateStr, start_time: '11:00', duration_minutes: 60, room: 'Hall', created_by: 'u2' })).toThrow(/Time slot not available/);

        // Adjacent booking (ends at 12:00, next starts at 12:00) should be allowed
        const b2 = bookingStore.createBooking({ dhammasevak_name: 'C', date: dateStr, start_time: '12:00', duration_minutes: 60, room: 'Hall', created_by: 'u3' });
        expect(b2).toBeDefined();
    });

    it('modifies a booking to a non-conflicting slot', () => {
        const D = new Date(); D.setDate(D.getDate() + 3);
        const dateStr = D.toISOString().slice(0, 10);

        const b = bookingStore.createBooking({ dhammasevak_name: 'Modder', date: dateStr, start_time: '09:00', duration_minutes: 60, room: 'Hall 2', created_by: 'u3' });
        const updated = bookingStore.modifyBooking(b.id, { start_time: '10:00' });
        expect(updated.start_time).toBe('10:00');
    });

    it('cancels a booking and removes it from list', () => {
        const D = new Date(); D.setDate(D.getDate() + 4);
        const dateStr = D.toISOString().slice(0, 10);
        const b = bookingStore.createBooking({ dhammasevak_name: 'CancelTest', date: dateStr, start_time: '12:00', duration_minutes: 60, room: 'Hall 3', created_by: 'u4' });
        const canceled = bookingStore.cancelBooking(b.id);
        expect(canceled.status).toBe('CANCELLED');
        const listed = bookingStore.listBookings({ date: dateStr });
        expect(listed.find(x => x.id === b.id)).toBeUndefined();
    });

    it('rejects invalid duration and past date bookings', () => {
        const past = new Date(); past.setDate(past.getDate() - 1);
        const pastDate = past.toISOString().slice(0, 10);
        expect(() => bookingStore.createBooking({ dhammasevak_name: 'Past', date: pastDate, start_time: '08:00', duration_minutes: 60, room: 'H', created_by: 'u5' })).toThrow(/Cannot book in the past/);
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const tdate = tomorrow.toISOString().slice(0, 10);
        expect(() => bookingStore.createBooking({ dhammasevak_name: 'Zero', date: tdate, start_time: '09:00', duration_minutes: 0, room: 'H', created_by: 'u6' })).toThrow(/Invalid duration_minutes/);
    });
});
