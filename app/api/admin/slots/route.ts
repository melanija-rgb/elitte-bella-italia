import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import {
  addSlot,
  deleteSlot,
  getAllSlots,
  getAvailableSlots,
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
    const [slots, available] = await Promise.all([
      getAllSlots(),
      getAvailableSlots(),
    ]);
    return NextResponse.json({
      slots,
      availableCount: available.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Greška pri učitavanju termina." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const date = String(body.date || "");
    const time = String(body.time || "");
    if (!date || !time) {
      return NextResponse.json(
        { error: "Unesite datum i vrijeme." },
        { status: 400 }
      );
    }
    const slot = await addSlot(date, time);
    return NextResponse.json({ slot });
  } catch {
    return NextResponse.json(
      { error: "Greška pri dodavanju termina." },
      { status: 500 }
    );
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
        { error: "Nedostaje ID termina." },
        { status: 400 }
      );
    }
    await deleteSlot(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Greška pri brisanju termina." },
      { status: 500 }
    );
  }
}
