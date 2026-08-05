import { Clock3, MapPin, Phone } from "lucide-react";
import { RESTAURANT } from "@/lib/restaurant";

export default function ContactSection() {
  return (
    <section id="kontakt" className="bg-page px-5 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm tracking-[0.3em] text-primary uppercase">
            Kontakt
          </p>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
            Dobrodošli
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Tu smo svaki dan — za kafu, pizzu, desert ili večernje piće.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <a
              href={RESTAURANT.phoneHref}
              className="flex items-start gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-primary"
            >
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-[var(--color-muted)]">Telefon</p>
                <p className="mt-1 text-lg text-white">{RESTAURANT.phone}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-[var(--color-muted)]">Adresa</p>
                <p className="mt-1 text-lg text-white">{RESTAURANT.address}</p>
                <p className="text-[var(--color-muted)]">{RESTAURANT.country}</p>
                <a
                  href={RESTAURANT.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Otvori u Google Maps
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-[var(--color-muted)]">Radno vrijeme</p>
                <p className="mt-1 text-lg text-white">{RESTAURANT.hours}</p>
              </div>
            </div>

            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm tracking-wide text-white/70 uppercase transition-colors hover:text-primary"
            >
              Instagram · @elitte_bella_italia
            </a>
          </div>

          <div className="min-h-[320px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] lg:min-h-[420px]">
            <iframe
              title="Elitte Bella Italia na mapi"
              src={RESTAURANT.mapEmbed}
              className="h-full min-h-[320px] w-full border-0 lg:min-h-[420px]"
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
