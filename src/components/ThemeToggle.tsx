"use client";
import styled from "styled-components";
import { useTheme } from "./ThemeProvider";

const ToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.cardBackground};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px ${(props) => props.theme.colors.shadowHover};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </ToggleButton>
  );
}
