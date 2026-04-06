// In-memory booking store with validation and conflict detection
const bookings = [];
let nextId = 1;

function isValidDateFormat(dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function isValidTimeFormat(timeStr) {
    return /^\d{1,2}:\d{2}$/.test(timeStr);
}

function toDateTime(dateStr, timeStr) {
    if (!isValidDateFormat(dateStr)) throw new Error('Invalid date format, expected YYYY-MM-DD');
    if (!isValidTimeFormat(timeStr)) throw new Error('Invalid time format, expected HH:MM');
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0).getTime();
}

function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}

export function createBooking({ dhammasevak_name, date, start_time, duration_minutes, room = 'Meditation Hall 1', created_by }) {
    if (!dhammasevak_name) throw new Error('dhammasevak_name is required');
    if (!date) throw new Error('date is required');
    if (!start_time) throw new Error('start_time is required');
    if (!Number.isFinite(duration_minutes) || duration_minutes <= 0) throw new Error('Invalid duration_minutes');

    const start = toDateTime(date, start_time);
    const end = start + duration_minutes * 60 * 1000;

    if (start < Date.now()) throw new Error('Cannot book in the past');

    const conflict = bookings.find(b => b.room === room && overlaps(start, end, b.start, b.end));
    if (conflict) throw new Error('Time slot not available');

    const booking = {
        id: String(nextId++),
        dhammasevak_name,
        date,
        start_time,
        duration_minutes,
        room,
        start,
        end,
        created_by,
        created_at: Date.now(),
        status: 'CONFIRMED'
    };
    bookings.push(booking);
    return booking;
}

export function getBooking(id) {
    return bookings.find(b => b.id === String(id));
}

export function listBookings(filter = {}) {
    return bookings.filter(b => {
        if (filter.dhammasevak_name && b.dhammasevak_name !== filter.dhammasevak_name) return false;
        if (filter.date && b.date !== filter.date) return false;
        return true;
    });
}

export function modifyBooking(id, updates) {
    const booking = getBooking(id);
    if (!booking) throw new Error('Booking not found');

    const newDate = updates.date || booking.date;
    const newStartTime = updates.start_time || booking.start_time;
    const newDuration = (updates.duration_minutes !== undefined && updates.duration_minutes !== null) ? updates.duration_minutes : booking.duration_minutes;
    if (!Number.isFinite(newDuration) || newDuration <= 0) throw new Error('Invalid duration_minutes');

    const newStart = toDateTime(newDate, newStartTime);
    const newEnd = newStart + newDuration * 60 * 1000;
    if (newStart < Date.now()) throw new Error('Cannot move booking to the past');

    const others = bookings.filter(b => b.id !== booking.id);
    const conflict = others.find(b => b.room === (updates.room || booking.room) && overlaps(newStart, newEnd, b.start, b.end));
    if (conflict) throw new Error('Time slot not available for requested update');

    booking.date = newDate;
    booking.start_time = newStartTime;
    booking.duration_minutes = newDuration;
    booking.start = newStart;
    booking.end = newEnd;
    booking.room = updates.room || booking.room;
    booking.updated_at = Date.now();
    return booking;
}

export function cancelBooking(id) {
    const idx = bookings.findIndex(b => b.id === String(id));
    if (idx === -1) throw new Error('Booking not found');
    const [b] = bookings.splice(idx, 1);
    b.status = 'CANCELLED';
    return b;
}

export function resetBookings() {
    bookings.length = 0;
    nextId = 1;
}

export default { createBooking, getBooking, listBookings, modifyBooking, cancelBooking, resetBookings };