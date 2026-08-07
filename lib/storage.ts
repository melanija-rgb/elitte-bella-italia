import { Booking, TimeSlot } from "./types";

const SLOTS_KEY = "elitte_slots";
const BOOKINGS_KEY = "elitte_bookings";
const SEED_VERSION_KEY = "elitte_slots_seed_version";
const SEED_VERSION = "9-21-hourly";

const BOOKING_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function seedIfEmpty(): void {
  if (typeof window === "undefined") return;

  const version = localStorage.getItem(SEED_VERSION_KEY);
  const slots = read<TimeSlot[]>(SLOTS_KEY, []);
  if (slots.length > 0 && version === SEED_VERSION) return;

  const today = new Date();
  const demo: TimeSlot[] = [];

  for (let d = 0; d <= 21; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    BOOKING_TIMES.forEach((time, i) => {
      demo.push({
        id: `demo-${d}-${i}`,
        date: dateStr,
        time,
      });
    });
  }

  write(SLOTS_KEY, demo);
  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
}

export function getAllSlots(): TimeSlot[] {
  seedIfEmpty();
  return read<TimeSlot[]>(SLOTS_KEY, []);
}

export function getAvailableSlots(): TimeSlot[] {
  const slots = getAllSlots();
  const bookings = getAllBookings();
  const bookedIds = new Set(bookings.map((b) => b.slotId));
  return slots
    .filter((s) => !bookedIds.has(s.id))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export function addSlot(date: string, time: string): TimeSlot {
  const slots = getAllSlots();
  const slot: TimeSlot = {
    id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    time,
  };
  write(SLOTS_KEY, [...slots, slot]);
  return slot;
}

export function deleteSlot(id: string): void {
  const slots = getAllSlots().filter((s) => s.id !== id);
  write(SLOTS_KEY, slots);
}

export function getAllBookings(): Booking[] {
  return read<Booking[]>(BOOKINGS_KEY, []);
}

export function createBooking(
  slot: TimeSlot,
  data: { fullName: string; phone: string; guests: number }
): Booking {
  const bookings = getAllBookings();
  const booking: Booking = {
    id: `booking-${Date.now()}`,
    slotId: slot.id,
    date: slot.date,
    time: slot.time,
    fullName: data.fullName,
    phone: data.phone,
    guests: data.guests,
    createdAt: new Date().toISOString(),
  };
  write(BOOKINGS_KEY, [...bookings, booking]);
  return booking;
}

export function deleteBooking(id: string): void {
  const bookings = getAllBookings().filter((b) => b.id !== id);
  write(BOOKINGS_KEY, bookings);
}
