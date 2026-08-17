"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Početna" },
  { href: "/o-nama", label: "O nama" },
  { href: "/galerija", label: "Galerija" },
  { href: "/rezervacija", label: "Rezervacija" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteHeader({
  variant = "auto",
}: {
  variant?: "overlay" | "solid" | "auto";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const resolved =
    variant === "auto" ? (pathname === "/" ? "overlay" : "solid") : variant;

  return (
    <header
      className={
        resolved === "solid"
          ? "sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-sm"
          : "absolute inset-x-0 top-0 z-40"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5 md:px-8">
        <div className="min-w-0 flex-1">
          <Logo />
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-black/95 px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-white/5 py-3.5 text-base ${
                    active ? "text-primary" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
