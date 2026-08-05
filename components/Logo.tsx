"use client";

import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group block min-w-0 ${className}`}>
      <span className="block truncate font-display text-base font-semibold tracking-[0.12em] text-white uppercase transition-colors group-hover:text-primary sm:text-xl sm:tracking-[0.18em] md:text-2xl">
        Elitte Bella Italia
      </span>
    </Link>
  );
}
