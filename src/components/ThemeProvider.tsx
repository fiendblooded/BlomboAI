"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const lightTheme = {
  colors: {
    background: "#f8fafc",
    cardBackground: "rgba(255, 255, 255, 0.95)",
    text: "#1e293b",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    border: "rgba(226, 232, 240, 0.8)",
    borderFocus: "#3b82f6",
    primary: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    primaryText: "white",
    secondary: "transparent",
    secondaryText: "#3b82f6",
    secondaryBorder: "#3b82f6",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    success: "#10b981",
    error: "#ef4444",
    errorBackground: "rgba(239, 68, 68, 0.1)",
    successBackground: "rgba(16, 185, 129, 0.1)",
    gradientOverlay: "rgba(59, 130, 246, 0.05)",
    shadow: "rgba(15, 23, 42, 0.08)",
    shadowHover: "rgba(15, 23, 42, 0.12)",
  },
};

const darkTheme = {
  colors: {
    background: "#0f172a",
    cardBackground: "rgba(30, 41, 59, 0.95)",
    text: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#64748b",
    border: "rgba(51, 65, 85, 0.6)",
    borderFocus: "#06b6d4",
    primary: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    primaryText: "white",
    secondary: "transparent",
    secondaryText: "#06b6d4",
    secondaryBorder: "#06b6d4",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    success: "#10b981",
    error: "#ef4444",
    errorBackground: "rgba(239, 68, 68, 0.15)",
    successBackground: "rgba(16, 185, 129, 0.15)",
    gradientOverlay: "rgba(6, 182, 212, 0.08)",
    shadow: "rgba(0, 0, 0, 0.25)",
    shadowHover: "rgba(0, 0, 0, 0.35)",
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // Default to dark to match the mobile app style
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const themeConfig = theme === "light" ? lightTheme : darkTheme;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <StyledThemeProvider theme={darkTheme}>{children}</StyledThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={themeConfig}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
