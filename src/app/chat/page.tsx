"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import Chat, { ChatMessage, QuickAction } from "@/components/Chat";

export default function ChatHomePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "👋 Welcome to Event Matcher! I'm here to help you connect with amazing people at events.\n\nWhat would you like to do today?",
      role: "assistant",
      timestamp: new Date(),
      actions: [
        {
          label: "🎉 Create an Event",
          value: "create_event",
          action: () => handleQuickAction("create_event")
        },
        {
          label: "🎫 Join an Event",
          value: "join_event", 
          action: () => handleQuickAction("join_event")
        }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuickAction = (action: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: action === "create_event" ? "I want to create an event" : "I want to join an event",
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse: ChatMessage;

      if (action === "create_event") {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "Great! Let's create your event. I'll guide you through the process step by step.\n\nFirst, what's the name of your event?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "📝 Use Form Instead",
              value: "use_form",
              action: () => router.push("/admin/new")
            }
          ]
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "Perfect! To join an event, you'll need a 6-digit event code.\n\nDo you have your event code ready?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "✅ Yes, I have a code",
              value: "have_code",
              action: () => router.push("/join")
            },
            {
              label: "📱 Scan QR Code",
              value: "scan_qr",
              action: () => handleQuickAction("scan_qr")
            },
            {
              label: "❓ I don't have a code",
              value: "no_code",
              action: () => handleQuickAction("no_code")
            }
          ]
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simple bot responses based on message content
    setTimeout(() => {
      let botResponse: ChatMessage;

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("create") || lowerMessage.includes("event") || lowerMessage.includes("organize")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I'd love to help you create an event! Let me take you to our event creation form where you can add all the details.",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "🚀 Create Event",
              value: "create_form",
              action: () => router.push("/admin/new")
            }
          ]
        };
      } else if (lowerMessage.includes("join") || lowerMessage.includes("code") || lowerMessage.match(/[A-Z0-9]{6}/)) {
        // Check if message contains a 6-digit code
        const codeMatch = message.match(/[A-Z0-9]{6}/);
        if (codeMatch) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: `I found the code "${codeMatch[0]}" in your message! Let me take you to that event.`,
            role: "assistant",
            timestamp: new Date(),
            actions: [
              {
                label: `🎫 Join Event ${codeMatch[0]}`,
                value: "join_code",
                action: () => router.push(`/e/${codeMatch[0]}`)
              }
            ]
          };
        } else {
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: "To join an event, you'll need a 6-digit event code. You can enter it manually or scan a QR code.",
            role: "assistant",
            timestamp: new Date(),
            actions: [
              {
                label: "📝 Enter Code",
                value: "enter_code",
                action: () => router.push("/join")
              }
            ]
          };
        }
      } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I'm here to help! Here's what I can do:\n\n🎉 **Create Events**: Set up your event and get a shareable code\n🎫 **Join Events**: Enter a code to join an existing event\n🤝 **Find Matches**: Get AI-powered connections with other attendees\n\nWhat would you like to do?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "Create Event",
              value: "create",
              action: () => handleQuickAction("create_event")
            },
            {
              label: "Join Event", 
              value: "join",
              action: () => handleQuickAction("join_event")
            }
          ]
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I'm not sure I understand. I can help you create or join events. What would you like to do?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "🎉 Create Event",
              value: "create",
              action: () => handleQuickAction("create_event")
            },
            {
              label: "🎫 Join Event",
              value: "join", 
              action: () => handleQuickAction("join_event")
            }
          ]
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay for more natural feel
  };

  return (
    <Container>
      <Chat
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        placeholder="Type your message or ask for help..."
      />
    </Container>
  );
}
