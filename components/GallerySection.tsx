"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GALLERY } from "@/lib/restaurant";
import type { GalleryItem } from "@/lib/types";

const FALLBACK: GalleryItem[] = GALLERY.map((item, index) => ({
  id: `static-${index + 1}`,
  src: item.src,
  alt: item.alt,
}));

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      } catch {
        /* keep fallback photos */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="galerija" className="bg-black px-4 py-14 sm:px-5 sm:py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs tracking-[0.25em] text-primary uppercase sm:text-sm sm:tracking-[0.3em]">
            Galerija
          </p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Ukus koji se vidi
          </h2>
          <p className="mt-3 text-sm text-[var(--color-muted)] sm:mt-4 sm:text-base">
            Pizza, deserti, ambijent i trenuci iz Elitte Bella Italia.
          </p>
        </div>

        {loading && items.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Učitavanje galerije...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            Galerija je trenutno prazna.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`relative overflow-hidden ${
                  i === 0
                    ? "col-span-2 aspect-[16/10] md:aspect-[4/3]"
                    : "aspect-square sm:aspect-[4/3]"
                } ${i === 5 ? "md:col-span-2" : ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized={item.src.startsWith("/api/")}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
