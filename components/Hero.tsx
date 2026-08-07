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
          className="object-cover object-[center_40%] animate-hero sm:object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.6)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-28 md:px-8 md:pb-20">
        <p className="animate-rise font-display text-[0.7rem] tracking-[0.22em] text-primary uppercase sm:text-sm sm:tracking-[0.35em]">
          Cafe&amp;Pizzeria · Kotor Varoš
        </p>
        <h1 className="animate-rise-delay mt-2 max-w-[12ch] font-display text-[2.65rem] leading-[0.98] font-semibold tracking-wide text-white sm:mt-3 sm:max-w-none sm:text-6xl md:text-7xl lg:text-8xl">
          {RESTAURANT.name}
        </h1>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
          {RESTAURANT.tagline}
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href="#rezervacija"
            className="bg-primary px-6 py-3.5 text-center text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-[var(--color-primary-hover)] sm:py-3"
          >
            Rezerviši sto
          </a>
          <a
            href="#galerija"
            className="border border-white/35 px-6 py-3.5 text-center text-sm tracking-wide text-white uppercase transition-colors hover:border-primary hover:text-primary sm:py-3"
          >
            Pogledaj galeriju
          </a>
        </div>
      </div>
    </section>
  );
}
