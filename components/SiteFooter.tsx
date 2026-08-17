import { RESTAURANT } from "@/lib/restaurant";

export default function SiteFooter() {
  return (
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
  );
}
