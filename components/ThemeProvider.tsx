"use client";

import { applyTheme, getTheme } from "@/lib/theme";
import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  return <>{children}</>;
}
