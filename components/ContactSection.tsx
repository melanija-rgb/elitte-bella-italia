import { Clock3, MapPin, Phone } from "lucide-react";
import { RESTAURANT } from "@/lib/restaurant";

export default function ContactSection() {
  return (
    <section id="kontakt" className="bg-page px-4 py-14 sm:px-5 sm:py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs tracking-[0.25em] text-primary uppercase sm:text-sm sm:tracking-[0.3em]">
            Kontakt
          </p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Dobrodošli
          </h2>
          <p className="mt-3 text-sm text-[var(--color-muted)] sm:mt-4 sm:text-base">
            Tu smo svaki dan — za kafu, pizzu, desert ili večernje piće.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <a
              href={RESTAURANT.phoneHref}
              className="flex items-start gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-primary sm:gap-4 sm:p-5"
            >
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm text-[var(--color-muted)]">Telefon</p>
                <p className="mt-1 break-words text-base text-white sm:text-lg">
                  {RESTAURANT.phone}
                </p>
              </div>
            </a>

            <div className="flex items-start gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:gap-4 sm:p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm text-[var(--color-muted)]">Adresa</p>
                <p className="mt-1 break-words text-base text-white sm:text-lg">
                  {RESTAURANT.address}
                </p>
                <p className="text-[var(--color-muted)]">{RESTAURANT.country}</p>
                <a
                  href={RESTAURANT.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block py-1 text-sm text-primary hover:underline"
                >
                  Otvori u Google Maps
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:gap-4 sm:p-5">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm text-[var(--color-muted)]">Radno vrijeme</p>
                <p className="mt-1 text-base text-white sm:text-lg">
                  {RESTAURANT.hours}
                </p>
              </div>
            </div>

            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-block py-2 text-sm tracking-wide text-white/70 uppercase transition-colors hover:text-primary"
            >
              Instagram · @elitte_bella_italia
            </a>
          </div>

          <div className="min-h-[260px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] sm:min-h-[320px] lg:min-h-[420px]">
            <iframe
              title="Elitte Bella Italia na mapi"
              src={RESTAURANT.mapEmbed}
              className="h-full min-h-[260px] w-full border-0 sm:min-h-[320px] lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
