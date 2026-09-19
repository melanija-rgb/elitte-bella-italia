import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type { Booking, TimeSlot } from "@/lib/types";

const STORE_NAME = "reservations";
const STATE_KEY = "state";
const DATA_DIR = path.join(process.cwd(), "data");
const STATE_PATH = path.join(DATA_DIR, "reservations.json");
const SEED_VERSION = "through-2027-12";
const BOOKING_END = new Date(2027, 11, 31); // 31.12.2027

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

export type ReservationsState = {
  seedVersion: string;
  slots: TimeSlot[];
  bookings: Booking[];
};

function useNetlifyBlobs(): boolean {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayKey(): string {
  return toDateKey(new Date());
}

function buildSeedSlots(): TimeSlot[] {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const demo: TimeSlot[] = [];
  const stamp = todayKey().replace(/-/g, "");
  let dayIndex = 0;

  for (
    let date = new Date(start);
    date <= BOOKING_END;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  ) {
    const dateStr = toDateKey(date);
    BOOKING_TIMES.forEach((time, i) => {
      demo.push({
        id: `demo-${stamp}-${dayIndex}-${i}`,
        date: dateStr,
        time,
      });
    });
    dayIndex += 1;
  }

  return demo;
}

function emptyState(): ReservationsState {
  return {
    seedVersion: SEED_VERSION,
    slots: buildSeedSlots(),
    bookings: [],
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readStateFs(): Promise<ReservationsState | null> {
  try {
    const raw = await fs.readFile(STATE_PATH, "utf8");
    const parsed = JSON.parse(raw) as ReservationsState;
    if (Array.isArray(parsed.slots) && Array.isArray(parsed.bookings)) {
      return parsed;
    }
  } catch {
    /* missing */
  }
  return null;
}

async function writeStateFs(state: ReservationsState) {
  await ensureDataDir();
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

async function readStateBlobs(): Promise<ReservationsState | null> {
  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const data = await store.get(STATE_KEY, { type: "json" });
    if (
      data &&
      Array.isArray((data as ReservationsState).slots) &&
      Array.isArray((data as ReservationsState).bookings)
    ) {
      return data as ReservationsState;
    }
  } catch {
    /* unavailable */
  }
  return null;
}

async function writeStateBlobs(state: ReservationsState) {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  await store.setJSON(STATE_KEY, state);
}

async function persistState(state: ReservationsState) {
  let saved = false;

  try {
    await writeStateFs(state);
    saved = true;
  } catch {
    /* Netlify FS may be read-only */
  }

  if (useNetlifyBlobs()) {
    try {
      await writeStateBlobs(state);
      saved = true;
    } catch {
      /* ignore if blobs not configured locally */
    }
  }

  if (!saved) {
    throw new Error("Nije moguće sačuvati podatke o rezervacijama.");
  }
}

function withSeed(state: ReservationsState): ReservationsState {
  const today = todayKey();
  const hasFutureSlots = state.slots.some((s) => s.date >= today);
  if (
    state.seedVersion === SEED_VERSION &&
    state.slots.length > 0 &&
    hasFutureSlots
  ) {
    return state;
  }

  return {
    ...state,
    seedVersion: SEED_VERSION,
    slots: buildSeedSlots(),
  };
}

export async function getReservationsState(): Promise<ReservationsState> {
  let state: ReservationsState | null = null;

  if (useNetlifyBlobs()) {
    state = await readStateBlobs();
  }
  if (!state) {
    state = await readStateFs();
  }
  if (!state) {
    state = emptyState();
    await persistState(state);
    return state;
  }

  const seeded = withSeed(state);
  if (
    seeded.seedVersion !== state.seedVersion ||
    seeded.slots.length !== state.slots.length ||
    seeded.slots[0]?.date !== state.slots[0]?.date
  ) {
    await persistState(seeded);
  }
  return seeded;
}

export async function getAllSlots(): Promise<TimeSlot[]> {
  const state = await getReservationsState();
  return state.slots;
}

export async function getAllBookings(): Promise<Booking[]> {
  const state = await getReservationsState();
  return state.bookings;
}

export async function getAvailableSlots(): Promise<TimeSlot[]> {
  const state = await getReservationsState();
  const bookedIds = new Set(state.bookings.map((b) => b.slotId));
  return state.slots
    .filter((s) => !bookedIds.has(s.id))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export async function addSlot(date: string, time: string): Promise<TimeSlot> {
  const state = await getReservationsState();
  const slot: TimeSlot = {
    id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    time,
  };
  state.slots.push(slot);
  await persistState(state);
  return slot;
}

export async function deleteSlot(id: string): Promise<void> {
  const state = await getReservationsState();
  state.slots = state.slots.filter((s) => s.id !== id);
  await persistState(state);
}

export async function createBooking(
  slotId: string,
  data: { fullName: string; phone: string; guests: number }
): Promise<Booking> {
  const state = await getReservationsState();
  const slot = state.slots.find((s) => s.id === slotId);
  if (!slot) {
    throw new Error("Termin nije pronađen.");
  }
  if (state.bookings.some((b) => b.slotId === slotId)) {
    throw new Error("Ovaj termin je već rezervisan. Izaberite drugi.");
  }

  const booking: Booking = {
    id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slotId: slot.id,
    date: slot.date,
    time: slot.time,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    guests: data.guests,
    createdAt: new Date().toISOString(),
  };

  state.bookings.push(booking);
  await persistState(state);
  return booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const state = await getReservationsState();
  state.bookings = state.bookings.filter((b) => b.id !== id);
  await persistState(state);
}
