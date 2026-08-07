import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import { GALLERY } from "@/lib/restaurant";
import type { GalleryItem } from "@/lib/types";

const MANIFEST_KEY = "manifest";
const STORE_NAME = "gallery";
const DATA_DIR = path.join(process.cwd(), "data");
const MANIFEST_PATH = path.join(DATA_DIR, "gallery.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "galerija", "uploads");

function defaultItems(): GalleryItem[] {
  return GALLERY.map((item, index) => ({
    id: `static-${index + 1}`,
    src: item.src,
    alt: item.alt,
  }));
}

function useNetlifyBlobs(): boolean {
  // Only on Netlify runtime / Netlify Dev blobs context — not mere local link env
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
}

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function readManifestFs(): Promise<GalleryItem[] | null> {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    const parsed = JSON.parse(raw) as { items?: GalleryItem[] };
    if (Array.isArray(parsed.items)) return parsed.items;
  } catch {
    /* missing or invalid */
  }
  return null;
}

async function writeManifestFs(items: GalleryItem[]) {
  await ensureDirs();
  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify({ items }, null, 2),
    "utf8"
  );
}

async function readManifestBlobs(): Promise<GalleryItem[] | null> {
  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const data = await store.get(MANIFEST_KEY, { type: "json" });
    if (data && Array.isArray((data as { items?: GalleryItem[] }).items)) {
      return (data as { items: GalleryItem[] }).items;
    }
  } catch {
    /* blobs unavailable */
  }
  return null;
}

async function writeManifestBlobs(items: GalleryItem[]) {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  await store.setJSON(MANIFEST_KEY, { items });
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    if (useNetlifyBlobs()) {
      const fromBlobs = await readManifestBlobs();
      if (fromBlobs) return fromBlobs;
    }

    const fromFs = await readManifestFs();
    if (fromFs) return fromFs;
  } catch {
    /* fall through to defaults */
  }

  const seeded = defaultItems();

  try {
    await writeManifestFs(seeded);
  } catch {
    /* Netlify filesystem is read-only — ignore */
  }

  if (useNetlifyBlobs()) {
    try {
      await writeManifestBlobs(seeded);
    } catch {
      /* ignore */
    }
  }

  return seeded;
}

async function saveManifest(items: GalleryItem[]) {
  try {
    await writeManifestFs(items);
  } catch {
    /* ignore read-only FS */
  }
  if (useNetlifyBlobs()) {
    try {
      await writeManifestBlobs(items);
    } catch {
      /* local without blob credentials */
    }
  }
}

function extensionFromType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function addGalleryImage(
  file: File,
  alt = "Elitte Bella Italia"
): Promise<GalleryItem> {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    throw new Error("Dozvoljeni formati: JPG, PNG, WEBP, GIF.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Slika je prevelika (max 8 MB).");
  }

  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ext = extensionFromType(file.type);
  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  let src: string;

  if (useNetlifyBlobs()) {
    try {
      const store = getStore({ name: STORE_NAME, consistency: "strong" });
      await store.set(`img-${id}`, arrayBuffer, {
        metadata: { contentType: file.type, alt },
      });
      src = `/api/gallery/file/${id}`;
    } catch {
      await ensureDirs();
      const filename = `${id}.${ext}`;
      await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
      src = `/galerija/uploads/${filename}`;
    }
  } else {
    await ensureDirs();
    const filename = `${id}.${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
    src = `/galerija/uploads/${filename}`;
  }

  const item: GalleryItem = {
    id,
    src,
    alt: alt.trim() || "Elitte Bella Italia",
    uploaded: true,
  };

  const items = await getGalleryItems();
  items.push(item);
  await saveManifest(items);
  return item;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const items = await getGalleryItems();
  const target = items.find((item) => item.id === id);
  if (!target) {
    throw new Error("Fotografija nije pronađena.");
  }

  if (target.uploaded) {
    if (target.src.startsWith("/api/gallery/file/") && useNetlifyBlobs()) {
      try {
        const store = getStore({ name: STORE_NAME, consistency: "strong" });
        await store.delete(`img-${id}`);
      } catch {
        /* ignore */
      }
    }

    if (target.src.startsWith("/galerija/uploads/")) {
      const filename = path.basename(target.src);
      try {
        await fs.unlink(path.join(UPLOAD_DIR, filename));
      } catch {
        /* already gone */
      }
    }
  }

  await saveManifest(items.filter((item) => item.id !== id));
}

export async function getGalleryFile(
  id: string
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  if (useNetlifyBlobs()) {
    try {
      const store = getStore({ name: STORE_NAME, consistency: "strong" });
      const result = await store.getWithMetadata(`img-${id}`, {
        type: "arrayBuffer",
      });
      if (result?.data) {
        const contentType =
          (result.metadata?.contentType as string) || "image/jpeg";
        return {
          data: result.data as ArrayBuffer,
          contentType,
        };
      }
    } catch {
      /* fall through */
    }
  }

  const items = await getGalleryItems();
  const item = items.find((entry) => entry.id === id);
  if (!item?.src.startsWith("/galerija/uploads/")) return null;

  const filename = path.basename(item.src);
  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    const buf = await fs.readFile(filePath);
    const data = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    ) as ArrayBuffer;
    const ext = path.extname(filename).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : "image/jpeg";
    return { data, contentType };
  } catch {
    return null;
  }
}
