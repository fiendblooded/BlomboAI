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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    cardBackground: "white",
    text: "#333",
    textSecondary: "#666",
    textMuted: "#888",
    border: "#e1e8ed",
    borderFocus: "#667eea",
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    primaryText: "white",
    secondary: "transparent",
    secondaryText: "#667eea",
    secondaryBorder: "#667eea",
    danger: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    success: "#51cf66",
    error: "#ff6b6b",
    errorBackground: "rgba(255, 107, 107, 0.1)",
    successBackground: "rgba(81, 207, 102, 0.1)",
    gradientOverlay: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
    shadow: "rgba(0, 0, 0, 0.1)",
    shadowHover: "rgba(0, 0, 0, 0.15)",
  }
};

const darkTheme = {
  colors: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    cardBackground: "#2d2d44",
    text: "#e4e4e7",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    border: "#3f3f46",
    borderFocus: "#8b5cf6",
    primary: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    primaryText: "white",
    secondary: "transparent",
    secondaryText: "#8b5cf6",
    secondaryBorder: "#8b5cf6",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    success: "#22c55e",
    error: "#ef4444",
    errorBackground: "rgba(239, 68, 68, 0.1)",
    successBackground: "rgba(34, 197, 94, 0.1)",
    gradientOverlay: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowHover: "rgba(0, 0, 0, 0.4)",
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const themeConfig = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={themeConfig}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
