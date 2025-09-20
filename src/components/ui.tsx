"use client";
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Roboto, sans-serif;
    background: ${(props) => props.theme?.colors?.background || "#0f172a"};
    min-height: 100vh;
    color: ${(props) => props.theme?.colors?.text || "#f1f5f9"};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: ${(props) => props.theme?.colors?.cardBackground || "rgba(30, 41, 59, 0.95)"};
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 1px 3px ${(props) => props.theme?.colors?.shadow || "rgba(0, 0, 0, 0.25)"},
    0 8px 24px ${(props) => props.theme?.colors?.shadow || "rgba(0, 0, 0, 0.25)"};
  backdrop-filter: blur(20px);
  border: 1px solid ${(props) => props.theme?.colors?.border || "rgba(51, 65, 85, 0.6)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => props.theme?.colors?.borderFocus || "#06b6d4"}40,
      transparent
    );
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: ${(props) => props.theme?.colors?.primary || "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: ${(props) => props.theme?.colors?.textSecondary || "#cbd5e1"};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  background: ${(props) =>
    props.variant === "danger"
      ? props.theme?.colors?.danger || "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : props.variant === "secondary"
      ? props.theme?.colors?.secondary || "transparent"
      : props.theme?.colors?.primary || "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"};
  color: ${(props) =>
    props.variant === "secondary"
      ? props.theme?.colors?.secondaryText || "#06b6d4"
      : props.theme?.colors?.primaryText || "white"};
  border: ${(props) =>
    props.variant === "secondary"
      ? `2px solid ${props.theme?.colors?.secondaryBorder || "#06b6d4"}`
      : "none"};
  padding: 1rem 2rem;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px ${(props) => props.theme?.colors?.shadowHover || "rgba(0, 0, 0, 0.35)"};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;

    &::before {
      display: none;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${(props) => props.theme.colors.cardBackground};
  color: ${(props) => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.borderFocus}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textMuted};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  background: ${(props) => props.theme.colors.cardBackground};
  color: ${(props) => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.borderFocus}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textMuted};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

export const LinkCard = styled.a`
  display: block;
  background: ${(props) => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 30px ${(props) => props.theme.colors.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${(props) => props.theme.colors.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${(props) => props.theme.colors.shadowHover};
  }

  h2 {
    color: ${(props) => props.theme.colors.secondaryText};
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

export const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;

  img {
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const Badge = styled.span`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primaryText};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  background: ${(props) => props.theme.colors.errorBackground};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid ${(props) => props.theme.colors.error};
`;

export const SuccessMessage = styled.p`
  color: ${(props) => props.theme.colors.success};
  background: ${(props) => props.theme.colors.successBackground};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid ${(props) => props.theme.colors.success};
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.colors.border};
`;

export const MatchCard = styled.div`
  background: ${(props) => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px ${(props) => props.theme.colors.shadow};
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px ${(props) => props.theme.colors.shadowHover};
  }
`;
