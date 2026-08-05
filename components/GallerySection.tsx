"use client";

import Image from "next/image";
import { GALLERY } from "@/lib/restaurant";

export default function GallerySection() {
  return (
    <section id="galerija" className="bg-black px-5 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm tracking-[0.3em] text-primary uppercase">
            Galerija
          </p>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
            Ukus koji se vidi
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Pizza, deserti, ambijent i trenuci iz Elitte Bella Italia.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GALLERY.map((item, i) => (
            <div
              key={item.src}
              className={`relative overflow-hidden ${
                i === 0 || i === 5 ? "md:col-span-2 md:row-span-1" : ""
              } aspect-[4/3]`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
