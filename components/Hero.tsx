import Image from "next/image";
import { RESTAURANT } from "@/lib/restaurant";

export default function Hero() {
  return (
    <section
      id="pocetna"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/galerija/pizza-closeup.jpg"
          alt="Pizza Elitte Bella Italia"
          fill
          priority
          className="object-cover object-center animate-hero"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-20">
        <p className="animate-rise font-display text-sm tracking-[0.35em] text-primary uppercase">
          Cafe&amp;Pizzeria · Kotor Varoš
        </p>
        <h1 className="animate-rise-delay mt-3 font-display text-5xl leading-[0.95] font-semibold tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {RESTAURANT.name}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          {RESTAURANT.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#rezervacija"
            className="bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-black uppercase transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Rezerviši sto
          </a>
          <a
            href="#galerija"
            className="border border-white/35 px-6 py-3 text-sm tracking-wide text-white uppercase transition-colors hover:border-primary hover:text-primary"
          >
            Pogledaj galeriju
          </a>
        </div>
      </div>
    </section>
  );
}
