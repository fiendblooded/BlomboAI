"use client";
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: #F3F0E4;
    --text-color: #12140C;
    --card-bg: #ffffff;
    --card-border: rgba(18,20,12,0.12);
    --muted-text: rgba(18,20,12,0.6);
    --accent: #0EA5E9;
    --shadow: rgba(18,20,12,0.06);
  }

  [data-theme='light'] {
    --bg-color: #F3F0E4;
    --text-color: #12140C;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Roboto, sans-serif;
    background: var(--bg-color);
    min-height: 100vh;
    color: var(--text-color);
    transition: background 300ms ease, color 300ms ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  html {
    scroll-behavior: smooth;
  }
`;

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Card = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 8px 32px var(--shadow);
  border: 1px solid var(--card-border);
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px var(--shadow);
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: left;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

export const Subtitle = styled.p`
  text-align: center;
  color: var(--muted-text);
  margin-bottom: 1.25rem;
  font-size: 1rem;
`;

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  width: 100%;
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 200ms ease, background 200ms ease;
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--card-border);
  color: var(--text-color);
  background: ${(p) => (p.variant === "secondary" ? "#ffffff" : "#12140C")};
  color: ${(p) => (p.variant === "secondary" ? "#12140C" : "#F3F0E4")};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px var(--shadow);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  font-size: 1rem;
  background: #ffffff;
  color: var(--text-color);
  transition: border-color 180ms ease, box-shadow 180ms ease;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: rgba(14, 165, 233, 0.5);
    box-shadow: 0 2px 12px var(--shadow);
  }

  &::placeholder {
    color: var(--muted-text);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  font-size: 1rem;
  background: #ffffff;
  color: var(--text-color);
  transition: border-color 180ms ease, box-shadow 180ms ease;
  margin-bottom: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: rgba(14, 165, 233, 0.5);
    box-shadow: 0 2px 12px var(--shadow);
  }

  &::placeholder {
    color: var(--muted-text);
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.08);
  color: #a61b1b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid rgba(239, 68, 68, 0.18);
  font-size: 0.9rem;
`;

export const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.08);
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid rgba(16, 185, 129, 0.18);
  font-size: 0.9rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #e2e8f0;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 2}, 1fr);
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Badge = styled.span<{
  variant?: "success" | "warning" | "danger";
}>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #ffffff;
  color: var(--text-color);
  border: 1px solid var(--card-border);
`;

export const LinkCard = styled.a`
  display: block;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(6, 182, 212, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(6, 182, 212, 0.5);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);

    &::before {
      left: 100%;
    }

    h2 {
      color: #06b6d4;
    }
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #f1f5f9;
    transition: color 0.3s ease;
  }

  p {
    color: #cbd5e1;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

export const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.6);
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Simple avatar image used in admin and matches pages
export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid rgba(51, 65, 85, 0.6);
`;

// Card used to render participant/match items
export const MatchCard = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f3f0e4 100%);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 12px 30px rgba(18, 20, 12, 0.12);
`;

// Fallback avatar with initial
export const InitialCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  box-shadow: 0 4px 14px rgba(18, 20, 12, 0.15);
  border: 1px solid rgba(18, 20, 12, 0.12);
`;
