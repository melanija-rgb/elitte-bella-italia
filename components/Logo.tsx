"use client";

import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group block ${className}`}>
      <span className="font-display text-xl font-semibold tracking-[0.18em] text-white uppercase transition-colors group-hover:text-primary sm:text-2xl">
        Elitte Bella Italia
      </span>
    </Link>
  );
}
