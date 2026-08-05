import ContactSection from "@/components/ContactSection";
import GallerySection from "@/components/GallerySection";
import Hero from "@/components/Hero";
import ReservationSection from "@/components/ReservationSection";
import SiteHeader from "@/components/SiteHeader";
import { RESTAURANT } from "@/lib/restaurant";

export default function HomePage() {
  return (
    <div className="bg-page text-dark">
      <SiteHeader />
      <Hero />

      <section id="o-nama" className="relative overflow-hidden px-4 py-14 sm:px-5 sm:py-20 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(196,163,90,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(139,30,45,0.12),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
          <div>
            <p className="text-xs tracking-[0.25em] text-primary uppercase sm:text-sm sm:tracking-[0.3em]">
              O nama
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Okus Italije u Kotor Varošu
            </h2>
            <div className="section-rule mt-6 w-40" />
            <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
              U srcu Kotor Varoša, na adresi {RESTAURANT.address}, Elitte Bella
              Italia donosi toplinu italijanske kuhinje — od jutarnje kafe do
              večernje pizze i deserta. Atmosfera je mirna i ugodna, a osoblje
              pažljivo i ljubazno.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
              Pizza je naš ponos: hrskava korica, bogati preljevi i svježi
              sastojci. Uz to imamo odličnu kafu, slatke deserte i pića za
              druženje — za doručak, ručak ili večeru.
            </p>
          </div>
          <div className="space-y-4 border border-[var(--color-border)] bg-black/40 p-5 sm:p-6 md:p-8">
            <p className="font-display text-xl text-white sm:text-2xl">Zašto nas biraju</p>
            {[
              "Autentična pizza i italijanski duh",
              "Odlična kafa i deserti",
              "Ugodan ambijent na dva sprata i bašti",
              "Radimo svaki dan od 07:00 do ponoći",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                <p className="text-[var(--color-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GallerySection />
      <ReservationSection />
      <ContactSection />

      <footer className="border-t border-[var(--color-border)] px-4 py-8 sm:px-5 sm:py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg tracking-[0.12em] text-white uppercase sm:text-xl sm:tracking-[0.15em]">
              {RESTAURANT.name}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {RESTAURANT.address}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center">
            <a href={RESTAURANT.phoneHref} className="py-1 hover:text-primary">
              {RESTAURANT.phone}
            </a>
            <span className="hidden sm:inline">·</span>
            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noreferrer"
              className="py-1 hover:text-primary"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
