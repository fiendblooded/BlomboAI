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
    background: #0f172a;
    min-height: 100vh;
    color: #f1f5f9;
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
  background: rgba(30, 41, 59, 0.95);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(51, 65, 85, 0.6);
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
    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent);
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #cbd5e1;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

export const Button = styled.button<{ variant?: "primary" | "secondary" | "danger" }>`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  background: ${(props) =>
    props.variant === "danger"
      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : props.variant === "secondary"
      ? "transparent"
      : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"};
  color: ${(props) => (props.variant === "secondary" ? "#06b6d4" : "white")};
  border: ${(props) => (props.variant === "secondary" ? "2px solid #06b6d4" : "none")};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);

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
  padding: 1rem;
  border: 2px solid #334155;
  border-radius: 12px;
  font-size: 1rem;
  background: #1e293b;
  color: #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.3);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #334155;
  border-radius: 12px;
  font-size: 1rem;
  background: #1e293b;
  color: #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.3);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.9rem;
`;

export const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid rgba(16, 185, 129, 0.3);
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Badge = styled.span<{ variant?: "success" | "warning" | "danger" }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(props) =>
    props.variant === "success"
      ? "rgba(16, 185, 129, 0.15)"
      : props.variant === "warning"
      ? "rgba(245, 158, 11, 0.15)"
      : props.variant === "danger"
      ? "rgba(239, 68, 68, 0.15)"
      : "rgba(6, 182, 212, 0.15)"};
  color: ${(props) =>
    props.variant === "success"
      ? "#6ee7b7"
      : props.variant === "warning"
      ? "#fbbf24"
      : props.variant === "danger"
      ? "#fca5a5"
      : "#7dd3fc"};
  border: 1px solid ${(props) =>
    props.variant === "success"
      ? "rgba(16, 185, 129, 0.3)"
      : props.variant === "warning"
      ? "rgba(245, 158, 11, 0.3)"
      : props.variant === "danger"
      ? "rgba(239, 68, 68, 0.3)"
      : "rgba(6, 182, 212, 0.3)"};
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
    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
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