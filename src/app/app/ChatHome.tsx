"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import Chat, { ChatMessage } from "@/components/Chat";

export default function ChatHome() {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [createStep, setCreateStep] = useState<"idle" | "name" | "done">(
    "idle"
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "👋 Welcome to Blombo! I can create events and join them by code.\n\nChoose an option or type: create or join.",
      role: "assistant",
      timestamp: new Date(),
      actions: [
        {
          label: "🎉 Create an Event",
          value: "create_event",
          action: () => handleQuickAction("create_event"),
        },
        {
          label: "🎫 Join an Event",
          value: "join_event",
          action: () => handleQuickAction("join_event"),
        },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuickAction = (action: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content:
        action === "create_event"
          ? "I want to create an event"
          : "I want to join an event",
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: ChatMessage;

      if (action === "create_event") {
        setMode("create");
        setCreateStep("name");
        botResponse = {
          id: (Date.now() + 1).toString(),
          content:
            "Great! We'll create your event here in chat.\n\nFirst, what's the name of your event?",
          role: "assistant",
          timestamp: new Date(),
          actions: [],
        };
      } else {
        setMode("join");
        botResponse = {
          id: (Date.now() + 1).toString(),
          content:
            "Perfect! To join an event, you'll need a 6-digit event code.\n\nDo you have your event code ready?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "✅ Yes, I have a code",
              value: "have_code",
              action: () =>
                setMessages((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    role: "assistant",
                    timestamp: new Date(),
                    content: "Please enter your 6-digit code (e.g., ABC123).",
                  },
                ]),
            },
            {
              label: "📱 Scan QR Code",
              value: "scan_qr",
              action: () => handleQuickAction("scan_qr"),
            },
            {
              label: "❓ I don't have a code",
              value: "no_code",
              action: () => handleQuickAction("no_code"),
            },
          ],
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    if (mode === "create" && createStep === "name") {
      (async () => {
        try {
          const res = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: message.trim() }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to create event");

          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now() + 1),
              role: "assistant",
              timestamp: new Date(),
              content: `✨ Event created! Share code ${data.code}. I can open the dashboard for you.`,
              actions: [
                {
                  label: "Open Event Dashboard",
                  value: "open_event",
                  action: () => router.push(`/admin/events/${data.id}`),
                },
                {
                  label: `Join as Guest (${data.code})`,
                  value: "join_guest",
                  action: () => router.push(`/e/${data.code}/chat`),
                },
              ],
            },
          ]);
          setMode("idle");
          setCreateStep("done");
        } catch (err) {
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now() + 1),
              role: "assistant",
              timestamp: new Date(),
              content:
                err instanceof Error
                  ? `Error: ${err.message}`
                  : "Something went wrong creating the event.",
            },
          ]);
          setMode("idle");
          setCreateStep("idle");
        } finally {
          setIsTyping(false);
        }
      })();
      return;
    }

    setTimeout(() => {
      let botResponse: ChatMessage;

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.startsWith("create")) {
        setMode("create");
        setCreateStep("name");
        botResponse = {
          id: (Date.now() + 1).toString(),
          content:
            "Awesome. Let's create your event here. What's the event name?",
          role: "assistant",
          timestamp: new Date(),
          actions: [],
        };
      } else if (
        mode === "join" &&
        (/[a-z0-9]{6}/i.test(message) ||
          lowerMessage.includes("join") ||
          lowerMessage.includes("code"))
      ) {
        const codeMatch = message.match(/[a-z0-9]{6}/i);
        if (codeMatch) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: `I found the code "${codeMatch[0].toUpperCase()}" in your message! Let me take you to that event.`,
            role: "assistant",
            timestamp: new Date(),
            actions: [
              {
                label: `🎫 Join Event ${codeMatch[0].toUpperCase()}`,
                value: "join_code",
                action: () =>
                  router.push(`/e/${codeMatch[0].toUpperCase()}/chat`),
              },
            ],
          };
        } else {
          botResponse = {
            id: (Date.now() + 1).toString(),
            content:
              "To join an event, you'll need a 6-digit event code. You can enter it manually or scan a QR code.",
            role: "assistant",
            timestamp: new Date(),
            actions: [],
          };
        }
      } else if (
        lowerMessage.includes("help") ||
        lowerMessage.includes("how")
      ) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content:
            "I'm here to help! Here's what I can do:\n\n🎉 Create Events: Set up your event and get a shareable code\n🎫 Join Events: Enter a code to join an existing event\n🤝 Find Matches: Get AI‑powered connections with other attendees\n\nWhat would you like to do?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "Create Event",
              value: "create",
              action: () => handleQuickAction("create_event"),
            },
            {
              label: "Join Event",
              value: "join",
              action: () => handleQuickAction("join_event"),
            },
          ],
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content:
            "I'm not sure I understand. I can help you create or join events. What would you like to do?",
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: "🎉 Create Event",
              value: "create",
              action: () => handleQuickAction("create_event"),
            },
            {
              label: "🎫 Join Event",
              value: "join",
              action: () => handleQuickAction("join_event"),
            },
          ],
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 900);
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
