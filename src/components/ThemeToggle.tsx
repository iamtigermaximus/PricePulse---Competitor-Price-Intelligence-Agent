"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.15s ease;

  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  }
`;

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("pricepulse-theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pricepulse-theme", theme);
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  if (!mounted) {
    return <ToggleButton as="div" style={{ visibility: "hidden" }} />;
  }

  return (
    <ToggleButton onClick={toggle} aria-label="Toggle dark mode" title="Toggle theme">
      {theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
    </ToggleButton>
  );
}
