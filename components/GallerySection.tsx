"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { GALLERY } from "@/lib/restaurant";
import type { GalleryItem } from "@/lib/types";

const FALLBACK: GalleryItem[] = GALLERY.map((item, index) => ({
  id: `static-${index + 1}`,
  src: item.src,
  alt: item.alt,
}));

function protectImage(e: React.SyntheticEvent) {
  e.preventDefault();
  return false;
}

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (activeIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) =>
          i === null ? null : (i - 1 + items.length) % items.length
        );
      }
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, items.length]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  const lightbox =
    mounted && active && activeIndex !== null
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={() => setActiveIndex(null)}
            onContextMenu={protectImage}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 z-10 rounded-md p-2 text-white transition-colors hover:text-primary"
              aria-label="Zatvori pregled"
            >
              <X className="h-7 w-7" />
            </button>

            <div
              className="relative h-[min(80svh,900px)] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={protectImage}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={active.alt}
                draggable={false}
                onContextMenu={protectImage}
                onDragStart={protectImage}
                className="mx-auto h-full w-full select-none object-contain"
                style={{ WebkitUserDrag: "none", userSelect: "none" }}
              />
            </div>
          </div>,
          document.body
        )
      : null;

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
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                onContextMenu={protectImage}
                className={`relative block w-full cursor-pointer overflow-hidden border-0 p-0 text-left ${
                  i === 0
                    ? "col-span-2 aspect-[16/10] md:aspect-[4/3]"
                    : "aspect-square sm:aspect-[4/3]"
                } ${i === 5 ? "md:col-span-2" : ""}`}
                aria-label={`Otvori fotografiju: ${item.alt}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  draggable={false}
                  unoptimized={item.src.startsWith("/api/")}
                  onContextMenu={protectImage}
                  onDragStart={protectImage}
                  className="pointer-events-none select-none object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ WebkitUserDrag: "none", userSelect: "none" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox}
    </section>
  );
}
