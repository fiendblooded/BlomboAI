"use client";
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${props => props.theme.colors.background};
    min-height: 100vh;
    color: ${props => props.theme.colors.text};
    transition: all 0.3s ease;
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
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.colors.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  background: ${(props) =>
    props.variant === "danger"
      ? props.theme.colors.danger
      : props.variant === "secondary"
      ? props.theme.colors.secondary
      : props.theme.colors.primary};
  color: ${(props) => 
    props.variant === "secondary" 
      ? props.theme.colors.secondaryText 
      : props.theme.colors.primaryText};
  border: ${(props) =>
    props.variant === "secondary" 
      ? `2px solid ${props.theme.colors.secondaryBorder}` 
      : "none"};
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px ${props => props.theme.colors.shadowHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.borderFocus}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.borderFocus}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
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
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 30px ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${props => props.theme.colors.shadowHover};
  }

  h2 {
    color: ${props => props.theme.colors.secondaryText};
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
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
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryText};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.errorBackground};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid ${props => props.theme.colors.error};
`;

export const SuccessMessage = styled.p`
  color: ${props => props.theme.colors.success};
  background: ${props => props.theme.colors.successBackground};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid ${props => props.theme.colors.success};
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
  border: 2px solid ${props => props.theme.colors.border};
`;

export const MatchCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px ${props => props.theme.colors.shadow};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px ${props => props.theme.colors.shadowHover};
  }
`;
