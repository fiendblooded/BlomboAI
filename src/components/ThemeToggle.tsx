"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme-simple");
    const next = saved || "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme-simple", next);
  };

  return (
    <button
      onClick={toggle}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        width: 44,
        height: 44,
        borderRadius: 22,
        border: "1px solid rgba(148,163,184,0.4)",
        background: "transparent",
        color: "var(--text-color)",
        fontSize: 18,
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
