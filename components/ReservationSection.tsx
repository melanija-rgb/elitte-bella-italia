"use client";

import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  isBefore,
  startOfDay,
} from "date-fns";
import { sr } from "date-fns/locale";
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { TimeSlot } from "@/lib/types";
import { cn, DAYS_SR, MONTHS_SR } from "@/lib/utils";

export default function ReservationSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", guests: 2 });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  async function loadSlots() {
    const res = await fetch("/api/slots", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Ne mogu učitati termine.");
    }
    setSlots(Array.isArray(data.slots) ? data.slots : []);
  }

  useEffect(() => {
    setMounted(true);
    loadSlots().catch(() => {
      setError("Ne mogu učitati dostupne termine. Pokušajte ponovo.");
    });
  }, []);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    slots.forEach((s) => {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    });
    return map;
  }, [slots]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const daySlots = selectedDate
    ? slotsByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : [];

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedSlot) {
      setError("Označite datum i vrijeme rezervacije.");
      return;
    }
    if (!form.fullName.trim() || !form.phone.trim()) {
      setError("Unesite ime i prezime, kao i broj telefona.");
      return;
    }
    if (!form.guests || form.guests < 1) {
      setError("Unesite broj osoba za koje vam treba sto.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          fullName: form.fullName,
          phone: form.phone,
          guests: form.guests,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Rezervacija nije uspjela.");
        await loadSlots().catch(() => undefined);
        return;
      }
      await loadSlots().catch(() => undefined);
      setConfirmed(true);
    } catch {
      setError("Rezervacija nije uspjela. Pokušajte ponovo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <section id="rezervacija" className="bg-page px-4 py-14 sm:px-5 sm:py-20 md:px-8">
        <div className="mx-auto max-w-6xl text-center text-[var(--color-muted)]">
          Učitavanje rezervacija...
        </div>
      </section>
    );
  }

  if (confirmed && selectedSlot) {
    return (
      <section id="rezervacija" className="bg-page px-4 py-14 sm:px-5 sm:py-20 md:px-8">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-5 font-display text-3xl text-white sm:text-4xl">
            Sto je rezervisan
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Hvala, {form.fullName}. Čekamo vas u Elitte Bella Italia.
          </p>
          <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-left">
            <p className="text-sm text-[var(--color-muted)]">Datum i vrijeme</p>
            <p className="mt-1 font-medium text-white">
              {format(new Date(selectedSlot.date), "EEEE, d. MMMM yyyy.", {
                locale: sr,
              })}{" "}
              u {selectedSlot.time}
            </p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Broj osoba: {form.guests}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Telefon: {form.phone}
            </p>
          </div>
          <Button
            className="mt-8"
            onClick={() => {
              setConfirmed(false);
              setSelectedSlot(null);
              setSelectedDate(null);
              setForm({ fullName: "", phone: "", guests: 2 });
            }}
          >
            Nova rezervacija
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="rezervacija" className="bg-page px-4 py-14 sm:px-5 sm:py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs tracking-[0.25em] text-primary uppercase sm:text-sm sm:tracking-[0.3em]">
            Rezervacija
          </p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Rezervišite sto
          </h2>
          <p className="mt-3 text-sm text-[var(--color-muted)] sm:mt-4 sm:text-base">
            Označite datum i vrijeme, zatim upišite ime i prezime, broj telefona
            i za koliko osoba vam treba sto.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3">
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
                <h3 className="font-display text-xl text-white sm:text-2xl">
                  {MONTHS_SR[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className="rounded-md p-2 text-[var(--color-muted)] hover:bg-[var(--color-light)] hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className="rounded-md p-2 text-[var(--color-muted)] hover:bg-[var(--color-light)] hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-0.5 sm:mb-2 sm:gap-1">
                {DAYS_SR.map((d) => (
                  <div
                    key={d}
                    className="py-1.5 text-center text-[10px] font-medium text-[var(--color-muted)] sm:py-2 sm:text-xs"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {calendarDays.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const hasSlots = slotsByDate.has(dateKey);
                  const count = slotsByDate.get(dateKey)?.length || 0;
                  const isSelected =
                    selectedDate && isSameDay(day, selectedDate);
                  const isPast = isBefore(day, startOfDay(new Date()));
                  const inMonth = isSameMonth(day, currentMonth);

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      disabled={!hasSlots || isPast}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        "relative flex min-h-10 flex-col items-center justify-center rounded-md py-2 text-xs transition-colors sm:min-h-0 sm:py-3 sm:text-sm",
                        !inMonth && "text-white/20",
                        inMonth && !hasSlots && "text-white/25",
                        inMonth &&
                          hasSlots &&
                          !isPast &&
                          "cursor-pointer font-medium text-white hover:bg-[var(--color-light)]",
                        isSelected && "selected-day",
                        isPast && "opacity-35"
                      )}
                    >
                      <span>{format(day, "d")}</span>
                      {hasSlots && !isPast && inMonth && (
                        <span
                          className={cn(
                            "mt-0.5 hidden text-[10px] sm:block",
                            isSelected ? "text-black/70" : "text-primary"
                          )}
                        >
                          {count} term.
                        </span>
                      )}
                      {hasSlots && !isPast && inMonth && (
                        <span
                          className={cn(
                            "mt-0.5 h-1 w-1 rounded-full sm:hidden",
                            isSelected ? "bg-black/50" : "bg-primary"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:mt-6 sm:p-5 md:p-6">
                <h3 className="mb-3 font-display text-lg text-white sm:mb-4 sm:text-xl">
                  Vrijeme —{" "}
                  {format(selectedDate, "d. MMMM yyyy.", { locale: sr })}
                </h3>
                {daySlots.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)]">
                    Nema slobodnih termina za ovaj dan.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {daySlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "flex min-h-11 items-center justify-center gap-1.5 rounded-md border px-2 py-2.5 text-sm font-medium transition-colors sm:px-3",
                          selectedSlot?.id === slot.id
                            ? "selected-slot"
                            : "slot-available border-[var(--color-border)] hover:border-primary"
                        )}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 md:sticky md:top-8 md:p-6">
              <h3 className="font-display text-xl text-white sm:text-2xl">Vaši podaci</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Popunite formu da rezervišete sto.
              </p>

              {selectedSlot ? (
                <div className="mt-4 bg-[var(--color-light)] px-4 py-3 text-sm">
                  <p className="font-medium text-primary">Izabrani termin</p>
                  <p className="mt-0.5 text-white">
                    {format(new Date(selectedSlot.date), "d. MMMM yyyy.", {
                      locale: sr,
                    })}{" "}
                    u {selectedSlot.time}
                  </p>
                </div>
              ) : (
                <div className="mt-4 border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted)]">
                  Prvo označite datum i vrijeme iz kalendara.
                </div>
              )}

              <form onSubmit={handleBook} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Ime i prezime *
                  </label>
                  <Input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder=""
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Broj telefona *
                  </label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder=""
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Broj osoba *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={form.guests}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        guests: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="2"
                    required
                  />
                </div>

                {error && (
                  <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full text-white"
                  disabled={!selectedSlot || submitting}
                >
                  {submitting ? "Slanje..." : "Rezerviši sto"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
