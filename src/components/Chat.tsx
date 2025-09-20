"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 82vh;
  max-height: none;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--card-border);
  box-shadow: 0 8px 32px var(--shadow);
`;

const ChatHeader = styled.div`
  background: #ffffff;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--card-border);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BotAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--card-border);
`;

const ChatTitle = styled.div`
  color: var(--text-color);
  font-weight: 700;
  font-size: 1rem;
`;

const ChatSubtitle = styled.div`
  color: var(--muted-text);
  font-size: 0.85rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(18, 20, 12, 0.06);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(18, 20, 12, 0.18);
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean; $hasRich?: boolean }>`
  max-width: 80%;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  background: ${(props) =>
    props.$hasRich ? "transparent" : props.$isUser ? "#12140C" : "#ffffff"};
  color: ${(props) => (props.$isUser ? "#F3F0E4" : "var(--text-color)")};
  padding: ${(props) => (props.$hasRich ? 0 : "0.75rem 1rem")};
  border-radius: ${(props) => (props.$hasRich ? 0 : 14)}px;
  border: ${(props) =>
    props.$hasRich
      ? "none"
      : props.$isUser
      ? "none"
      : "1px solid var(--card-border)"};
  box-shadow: ${(props) =>
    props.$hasRich ? "none" : "0 2px 8px var(--shadow)"};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const QuickActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const QuickActionButton = styled.button`
  background: #ffffff;
  color: var(--text-color);
  border: 1px solid var(--card-border);
  border-radius: 9999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 150ms ease, transform 120ms ease, box-shadow 180ms ease;

  &:hover {
    background: rgba(18, 20, 12, 0.04);
    transform: translateY(-1px);
    box-shadow: 0 3px 12px var(--shadow);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  align-self: flex-start;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #06b6d4;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes typing {
    0%,
    80%,
    100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--card-border);
  background: #ffffff;
`;

const ChatInputWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const ChatInput = styled.textarea`
  flex: 1;
  background: #ffffff;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 1rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &:focus {
    outline: none;
    border-color: rgba(14, 165, 233, 0.5);
    box-shadow: 0 2px 12px var(--shadow);
  }

  &::placeholder {
    color: var(--muted-text);
  }
`;

const SendButton = styled.button`
  background: #12140c;
  border: none;
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 180ms ease;
  color: #f3f0e4;
  font-size: 1.2rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--shadow);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Types
interface QuickAction {
  label: string;
  value: string;
  action: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  actions?: QuickAction[];
  rich?: ReactNode;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  placeholder?: string;
  footerSlot?: ReactNode;
  inputDisabled?: boolean;
}

export default function Chat({
  messages,
  onSendMessage,
  isTyping = false,
  placeholder = "Type a message...",
  footerSlot,
  inputDisabled = false,
}: ChatProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.style.height = "44px";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "44px";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <BotAvatar src="/blombo.png" alt="Blombo" />
        <div>
          <ChatTitle>Blombo</ChatTitle>
          <ChatSubtitle>Here to help you connect</ChatSubtitle>
        </div>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble
              $isUser={message.role === "user"}
              $hasRich={Boolean(message.rich)}
            >
              {message.rich ? message.rich : message.content}
            </MessageBubble>
            {message.actions && message.actions.length > 0 && (
              <QuickActionsContainer>
                {message.actions.map((action, index) => (
                  <QuickActionButton key={index} onClick={action.action}>
                    {action.label}
                  </QuickActionButton>
                ))}
              </QuickActionsContainer>
            )}
          </div>
        ))}

        {isTyping && (
          <TypingIndicator>
            <TypingDots>
              <span></span>
              <span></span>
              <span></span>
            </TypingDots>
            Assistant is typing...
          </TypingIndicator>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <ChatInputContainer>
        <ChatInputWrapper>
          <ChatInput
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            rows={1}
            disabled={inputDisabled}
          />
          <SendButton
            onClick={handleSend}
            disabled={!inputValue.trim() || inputDisabled}
          >
            ↗️
          </SendButton>
        </ChatInputWrapper>
        {footerSlot}
      </ChatInputContainer>
    </ChatContainer>
  );
}

// Export types for use in other components
export type { ChatMessage, QuickAction };
