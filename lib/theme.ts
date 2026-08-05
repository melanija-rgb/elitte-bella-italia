export type Theme = {
  primary: string;
  primaryHover: string;
  dark: string;
  background: string;
  light: string;
  brandName: string;
};

export const DEFAULT_THEME: Theme = {
  primary: "#C4A35A",
  primaryHover: "#A8883F",
  dark: "#F5F0E8",
  background: "#0A0A0A",
  light: "#1A1510",
  brandName: "Elitte Bella Italia",
};

const THEME_KEY = "elitte_theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw ? { ...DEFAULT_THEME, ...JSON.parse(raw) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme: Partial<Theme>): Theme {
  const updated = { ...getTheme(), ...theme };
  localStorage.setItem(THEME_KEY, JSON.stringify(updated));
  applyTheme(updated);
  return updated;
}

export function resetTheme(): Theme {
  localStorage.removeItem(THEME_KEY);
  applyTheme(DEFAULT_THEME);
  return DEFAULT_THEME;
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-primary-hover", theme.primaryHover);
  root.style.setProperty("--color-dark", theme.dark);
  root.style.setProperty("--color-bg", theme.background);
  root.style.setProperty("--color-light", theme.light);
  root.style.setProperty("--color-primary-ring", `${theme.primary}33`);
}

export const THEME_PRESETS = [
  {
    name: "Italijansko zlato",
    theme: DEFAULT_THEME,
  },
  {
    name: "Crveno vino",
    theme: {
      ...DEFAULT_THEME,
      primary: "#8B1E2D",
      primaryHover: "#6E1522",
      light: "#1C0E10",
    },
  },
  {
    name: "Maslinasta",
    theme: {
      ...DEFAULT_THEME,
      primary: "#6B7C3E",
      primaryHover: "#556332",
      light: "#141810",
    },
  },
];
