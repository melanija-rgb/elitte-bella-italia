import { NextResponse } from "next/server";
import { getGalleryFile } from "@/lib/gallery-store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const file = await getGalleryFile(id);

  if (!file) {
    return NextResponse.json({ error: "Nije pronađeno." }, { status: 404 });
  }

  const body =
    file.data instanceof Buffer
      ? new Uint8Array(file.data)
      : new Uint8Array(file.data);

  return new NextResponse(body, {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
