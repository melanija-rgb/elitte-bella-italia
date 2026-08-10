import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/bookings-store";

export async function GET() {
  try {
    const slots = await getAvailableSlots();
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json(
      { error: "Greška pri učitavanju termina." },
      { status: 500 }
    );
  }
}
