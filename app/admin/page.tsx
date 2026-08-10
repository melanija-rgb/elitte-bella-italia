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
  ImagePlus,
  Images,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import { Booking, GalleryItem, TimeSlot } from "@/lib/types";

type Tab = "slots" | "bookings" | "gallery";

export default function AdminPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("19:00");
  const [tab, setTab] = useState<Tab>("bookings");
  const [mounted, setMounted] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [reservationsError, setReservationsError] = useState("");

  useEffect(() => {
    setMounted(true);
    refresh();
    refreshGallery();
  }, []);

  async function refresh() {
    setReservationsError("");
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/slots", { cache: "no-store" }),
        fetch("/api/bookings", { cache: "no-store" }),
      ]);
      const slotsData = await slotsRes.json();
      const bookingsData = await bookingsRes.json();

      if (!slotsRes.ok || !bookingsRes.ok) {
        setReservationsError(
          slotsData.error ||
            bookingsData.error ||
            "Ne mogu učitati rezervacije."
        );
        return;
      }

      const allSlots: TimeSlot[] = Array.isArray(slotsData.slots)
        ? slotsData.slots
        : [];
      const allBookings: Booking[] = Array.isArray(bookingsData.bookings)
        ? bookingsData.bookings
        : [];

      setSlots(allSlots);
      setBookings(allBookings);
      setBookedIds(new Set(allBookings.map((b) => b.slotId)));
      setAvailableCount(
        typeof slotsData.availableCount === "number"
          ? slotsData.availableCount
          : allSlots.length - allBookings.length
      );
    } catch {
      setReservationsError("Ne mogu učitati rezervacije.");
    }
  }

  async function refreshGallery() {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.items)) setGallery(data.items);
    } catch {
      setGalleryError("Ne mogu učitati galeriju.");
    }
  }

  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setGalleryError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", "Elitte Bella Italia");
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setGalleryError(data.error || "Upload nije uspio.");
        return;
      }
      await refreshGallery();
    } catch {
      setGalleryError("Upload nije uspio.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeletePhoto(id: string) {
    if (!confirm("Obrisati ovu fotografiju iz galerije?")) return;
    setGalleryError("");
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setGalleryError(data.error || "Brisanje nije uspjelo.");
        return;
      }
      await refreshGallery();
    } catch {
      setGalleryError("Brisanje nije uspjelo.");
    }
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setReservationsError("");
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReservationsError(data.error || "Dodavanje termina nije uspjelo.");
        return;
      }
      setNewDate("");
      setNewTime("19:00");
      await refresh();
    } catch {
      setReservationsError("Dodavanje termina nije uspjelo.");
    }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("Obrisati ovaj termin?")) return;
    setReservationsError("");
    try {
      const res = await fetch(
        `/api/admin/slots?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        setReservationsError(data.error || "Brisanje termina nije uspjelo.");
        return;
      }
      await refresh();
    } catch {
      setReservationsError("Brisanje termina nije uspjelo.");
    }
  }

  async function handleDeleteBooking(id: string) {
    if (!confirm("Obrisati rezervaciju? Termin će ponovo biti slobodan."))
      return;
    setReservationsError("");
    try {
      const res = await fetch(
        `/api/bookings?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        setReservationsError(
          data.error || "Brisanje rezervacije nije uspjelo."
        );
        return;
      }
      await refresh();
    } catch {
      setReservationsError("Brisanje rezervacije nije uspjelo.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
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
            Upravljajte rezervacijama, terminima i galerijom fotografija
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Ukupno termina", value: slots.length, icon: Calendar },
            { label: "Slobodnih", value: availableCount, icon: Calendar },
            { label: "Rezervacija", value: bookings.length, icon: Users },
            { label: "Fotografija", value: gallery.length, icon: Images },
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
              { id: "gallery", label: "Galerija" },
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
              {t.id === "gallery" && (
                <Images className="mr-1.5 inline h-4 w-4" />
              )}
              {t.label}
            </button>
          ))}
        </div>

        {reservationsError && (
          <p className="mb-6 rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">
            {reservationsError}
          </p>
        )}

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
                <Button type="submit" className="text-white">
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

        {tab === "gallery" && (
          <div className="space-y-6">
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="mb-2 font-display text-xl text-white">
                Galerija fotografija
              </h2>
              <p className="mb-5 text-sm text-[var(--color-muted)]">
                Dodajte nove slike ili obrišite postojeće. Izmjene se odmah
                vide na sajtu.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUploadPhoto}
              />

              <Button
                type="button"
                className="text-white"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {uploading ? "Dodavanje..." : "Dodaj fotografiju"}
              </Button>

              {galleryError && (
                <p className="mt-4 rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">
                  {galleryError}
                </p>
              )}
            </div>

            <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="border-b border-[var(--color-border)] px-6 py-4">
                <h2 className="font-display text-xl text-white">
                  Sve fotografije ({gallery.length})
                </h2>
              </div>

              {gallery.length === 0 ? (
                <p className="p-8 text-center text-sm text-[var(--color-muted)]">
                  Nema fotografija. Dodajte prvu dugmetom iznad.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 md:p-6">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden border border-[var(--color-border)] bg-black"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        unoptimized={item.src.startsWith("/api/")}
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(item.id)}
                        className="absolute top-2 right-2 rounded-md bg-black/70 p-2 text-white opacity-100 transition-colors hover:bg-red-700 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Obriši fotografiju"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
