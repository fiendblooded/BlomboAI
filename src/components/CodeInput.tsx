"use client";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const CodeContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin: 1.5rem 0;
`;

const CodeDigit = styled.input<{ $hasValue: boolean; $isFocused: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border: 2px solid
    ${(props) =>
      props.$isFocused
        ? props.theme?.colors?.borderFocus || "#06b6d4"
        : props.$hasValue
        ? props.theme?.colors?.success || "#10b981"
        : props.theme?.colors?.border || "rgba(51, 65, 85, 0.6)"};
  border-radius: 16px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: ${(props) =>
    props.$hasValue
      ? props.theme?.colors?.successBackground || "rgba(16, 185, 129, 0.15)"
      : props.theme?.colors?.cardBackground || "rgba(30, 41, 59, 0.95)"};
  color: ${(props) => props.theme?.colors?.text || "#f1f5f9"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: 0 1px 3px ${(props) => props.theme?.colors?.shadow || "rgba(0, 0, 0, 0.25)"},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &:focus {
    box-shadow: 0 0 0 3px ${(props) => props.theme?.colors?.borderFocus || "#06b6d4"}30,
      0 4px 12px ${(props) => props.theme?.colors?.shadow || "rgba(0, 0, 0, 0.25)"};
    transform: scale(1.02);
    border-color: ${(props) => props.theme?.colors?.borderFocus || "#06b6d4"};
  }

  &::placeholder {
    color: ${(props) => props.theme?.colors?.textMuted || "#64748b"};
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
`;

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

export default function CodeInput({
  value,
  onChange,
  onComplete,
  disabled,
}: CodeInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(6, "").split("").slice(0, 6);

  useEffect(() => {
    if (value.length === 6 && onComplete) {
      onComplete(value);
    }
  }, [value, onComplete]);

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;

    // Only allow letters and numbers
    const sanitized = newValue.replace(/[^A-Z0-9]/g, "").toUpperCase();

    if (sanitized.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = sanitized;
      const newCode = newDigits.join("").replace(/\s/g, "");
      onChange(newCode);

      // Auto-focus next input
      if (sanitized && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "Backspace" && !digits[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/[^A-Z0-9]/g, "")
      .toUpperCase();
    if (pastedText.length <= 6) {
      onChange(pastedText);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedText.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <CodeContainer>
      {digits.map((digit, index) => (
        <CodeDigit
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          onPaste={handlePaste}
          placeholder="·"
          maxLength={1}
          disabled={disabled}
          $hasValue={!!digit}
          $isFocused={focusedIndex === index}
        />
      ))}
    </CodeContainer>
  );
}
