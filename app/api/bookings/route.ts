import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
} from "@/lib/bookings-store";

async function requireAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 401 });
  }

  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Greška pri učitavanju rezervacija." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slotId = String(body.slotId || "");
    const fullName = String(body.fullName || "");
    const phone = String(body.phone || "");
    const guests = Number(body.guests);

    if (!slotId) {
      return NextResponse.json(
        { error: "Označite termin rezervacije." },
        { status: 400 }
      );
    }
    if (!fullName.trim() || !phone.trim()) {
      return NextResponse.json(
        { error: "Unesite ime i prezime, kao i broj telefona." },
        { status: 400 }
      );
    }
    if (!guests || guests < 1) {
      return NextResponse.json(
        { error: "Unesite broj osoba za koje vam treba sto." },
        { status: 400 }
      );
    }

    const booking = await createBooking(slotId, { fullName, phone, guests });
    return NextResponse.json({ booking });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Greška pri rezervaciji.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Nedostaje ID rezervacije." },
        { status: 400 }
      );
    }
    await deleteBooking(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Greška pri brisanju rezervacije." },
      { status: 500 }
    );
  }
}
