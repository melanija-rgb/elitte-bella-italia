"use client";

import { format } from "date-fns";
import { sr } from "date-fns/locale";
import {
  Plus,
  Trash2,
  Calendar,
  Users,
  ArrowLeft,
  LogOut,
  Palette,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import {
  addSlot,
  deleteSlot,
  deleteBooking,
  getAllSlots,
  getAllBookings,
  getAvailableSlots,
} from "@/lib/storage";
import {
  getTheme,
  saveTheme,
  resetTheme,
  THEME_PRESETS,
  type Theme,
} from "@/lib/theme";
import { Booking, TimeSlot } from "@/lib/types";

type Tab = "slots" | "bookings" | "settings";

export default function AdminPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("19:00");
  const [tab, setTab] = useState<Tab>("bookings");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(getTheme());
  const [themeSaved, setThemeSaved] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
    setTheme(getTheme());
    refresh();
  }, []);

  function refresh() {
    const allSlots = getAllSlots();
    const allBookings = getAllBookings();
    setSlots(allSlots);
    setBookings(allBookings);
    setBookedIds(new Set(allBookings.map((b) => b.slotId)));
    setAvailableCount(getAvailableSlots().length);
  }

  function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate || !newTime) return;
    addSlot(newDate, newTime);
    setNewDate("");
    setNewTime("19:00");
    refresh();
  }

  function handleDeleteSlot(id: string) {
    if (!confirm("Obrisati ovaj termin?")) return;
    deleteSlot(id);
    refresh();
  }

  function handleDeleteBooking(id: string) {
    if (!confirm("Obrisati rezervaciju? Termin će ponovo biti slobodan."))
      return;
    deleteBooking(id);
    refresh();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function handleThemeChange(field: keyof Theme, value: string) {
    setTheme((prev) => ({ ...prev, [field]: value }));
    setThemeSaved(false);
  }

  function handleSaveTheme() {
    saveTheme(theme);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2000);
  }

  function handleResetTheme() {
    const defaults = resetTheme();
    setTheme(defaults);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2000);
  }

  function applyPreset(preset: Theme) {
    setTheme(preset);
    saveTheme(preset);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2000);
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="text-[var(--color-muted)]">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-[var(--color-border)] bg-black/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Nazad na sajt
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Odjava
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-white">
            Admin — šef restorana
          </h1>
          <p className="mt-1 text-[var(--color-muted)]">
            Pregledajte rezervacije stolova i upravljajte slobodnim terminima
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Ukupno termina", value: slots.length, icon: Calendar },
            { label: "Slobodnih", value: availableCount, icon: Calendar },
            { label: "Rezervacija", value: bookings.length, icon: Users },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { id: "bookings", label: "Rezervacije" },
              { id: "slots", label: "Termini" },
              { id: "settings", label: "Izgled" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                tab === t.id
                  ? "tab-active"
                  : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {t.id === "settings" && (
                <Palette className="mr-1.5 inline h-4 w-4" />
              )}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "slots" && (
          <>
            <form
              onSubmit={handleAddSlot}
              className="mb-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <h2 className="mb-4 font-display text-xl text-white">
                Dodaj novi termin
              </h2>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Datum
                  </label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-44"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Vrijeme
                  </label>
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-36"
                  />
                </div>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj termin
                </Button>
              </div>
            </form>

            <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="border-b border-[var(--color-border)] px-6 py-4">
                <h2 className="font-display text-xl text-white">
                  Svi termini ({slots.length})
                </h2>
              </div>
              {slots.length === 0 ? (
                <p className="p-8 text-center text-sm text-[var(--color-muted)]">
                  Nema kreiranih termina. Dodajte prvi termin iznad.
                </p>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {[...slots]
                    .sort((a, b) =>
                      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
                    )
                    .map((slot) => {
                      const isBooked = bookedIds.has(slot.id);
                      return (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between px-6 py-4"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {format(new Date(slot.date), "EEEE, d. MMMM yyyy.", {
                                locale: sr,
                              })}
                            </p>
                            <p className="text-sm text-[var(--color-muted)]">
                              {slot.time}{" "}
                              {isBooked ? (
                                <span className="text-orange-400">
                                  · Rezervisan
                                </span>
                              ) : (
                                <span className="text-green-400">
                                  · Slobodan
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="rounded-md p-2 text-[var(--color-muted)] hover:bg-red-950/40 hover:text-red-400"
                            title="Obriši termin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "bookings" && (
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-display text-xl text-white">
                Rezervacije stolova ({bookings.length})
              </h2>
            </div>
            {bookings.length === 0 ? (
              <p className="p-8 text-center text-sm text-[var(--color-muted)]">
                Još nema rezervacija.
              </p>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {[...bookings]
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start justify-between px-6 py-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {booking.fullName}
                        </p>
                        <p className="text-sm text-[var(--color-muted)]">
                          {booking.phone}
                          {booking.guests
                            ? ` · ${booking.guests} ${booking.guests === 1 ? "osoba" : "osobe"}`
                            : ""}
                        </p>
                        <p className="mt-1 text-sm text-primary">
                          {format(new Date(booking.date), "d. MMMM yyyy.", {
                            locale: sr,
                          })}{" "}
                          u {booking.time}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="rounded-md p-2 text-[var(--color-muted)] hover:bg-red-950/40 hover:text-red-400"
                        title="Obriši rezervaciju"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-6">
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="mb-4 font-display text-xl text-white">
                Brzi šabloni
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset.theme)}
                    className="border border-[var(--color-border)] p-4 text-left transition-colors hover:border-primary"
                  >
                    <div className="mb-2 flex gap-1.5">
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: preset.theme.primary }}
                      />
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: preset.theme.background }}
                      />
                    </div>
                    <p className="text-sm font-medium text-white">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="mb-4 font-display text-xl text-white">
                Prilagođene boje
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Naziv brenda
                  </label>
                  <Input
                    value={theme.brandName}
                    onChange={(e) =>
                      handleThemeChange("brandName", e.target.value)
                    }
                  />
                </div>
                {(
                  [
                    { key: "primary", label: "Primarna boja" },
                    { key: "primaryHover", label: "Primarna (hover)" },
                    { key: "dark", label: "Boja teksta" },
                    { key: "background", label: "Pozadina stranice" },
                    { key: "light", label: "Akcent pozadina" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-sm font-medium text-white/80">
                      {label}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={theme[key]}
                        onChange={(e) => handleThemeChange(key, e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-md border border-[var(--color-border)] bg-transparent"
                      />
                      <Input
                        value={theme[key]}
                        onChange={(e) => handleThemeChange(key, e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={handleSaveTheme}>Sačuvaj izgled</Button>
                <Button variant="secondary" onClick={handleResetTheme}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Vrati podrazumevano
                </Button>
                {themeSaved && (
                  <span className="text-sm text-green-400">Sačuvano!</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
