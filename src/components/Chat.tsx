"use client";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 600px;
  background: #0f172a;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(51, 65, 85, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BotAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ChatTitle = styled.div`
  color: #f1f5f9;
  font-weight: 600;
  font-size: 1.1rem;
`;

const ChatSubtitle = styled.div`
  color: #cbd5e1;
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
    background: rgba(51, 65, 85, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.5);
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  background: ${(props) =>
    props.$isUser
      ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
      : "rgba(30, 41, 59, 0.8)"};
  color: ${(props) => (props.$isUser ? "white" : "#f1f5f9")};
  padding: 0.75rem 1rem;
  border-radius: ${(props) =>
    props.$isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  border: ${(props) => (props.$isUser ? "none" : "1px solid rgba(51, 65, 85, 0.6)")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(6, 182, 212, 0.25);
    transform: translateY(-1px);
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
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes typing {
    0%, 80%, 100% {
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
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
`;

const ChatInputWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const ChatInput = styled.textarea`
  flex: 1;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 16px;
  padding: 0.75rem 1rem;
  color: #f1f5f9;
  font-size: 1rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border: none;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 1.2rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
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
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  placeholder?: string;
}

export default function Chat({ messages, onSendMessage, isTyping = false, placeholder = "Type a message..." }: ChatProps) {
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
        <BotAvatar>🤖</BotAvatar>
        <div>
          <ChatTitle>Event Assistant</ChatTitle>
          <ChatSubtitle>Here to help you connect</ChatSubtitle>
        </div>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble $isUser={message.role === "user"}>
              {message.content}
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
          />
          <SendButton onClick={handleSend} disabled={!inputValue.trim()}>
            ↗️
          </SendButton>
        </ChatInputWrapper>
      </ChatInputContainer>
    </ChatContainer>
  );
}

// Export types for use in other components
export type { ChatMessage, QuickAction };
