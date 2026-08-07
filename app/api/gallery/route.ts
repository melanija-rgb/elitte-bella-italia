import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import {
  addGalleryImage,
  deleteGalleryImage,
  getGalleryItems,
} from "@/lib/gallery-store";

async function requireAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Greška pri učitavanju galerije." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const alt = String(formData.get("alt") || "Elitte Bella Italia");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Odaberite fotografiju." },
        { status: 400 }
      );
    }

    const item = await addGalleryImage(file, alt);
    return NextResponse.json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Greška pri uploadu.";
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
        { error: "Nedostaje ID fotografije." },
        { status: 400 }
      );
    }

    await deleteGalleryImage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Greška pri brisanju.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
