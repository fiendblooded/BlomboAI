"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Chat, { ChatMessage } from "@/components/Chat";
import { Button, MatchCard, InitialCircle, FlexRow } from "@/components/ui";

interface Props {
  eventId: string;
  eventName: string;
}

export default function JoinChatbot({ eventId, eventName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<
    | "intro"
    | "ask_name"
    | "ask_about"
    | "ask_looking"
    | "ask_linkedin"
    | "submitting"
    | "matched"
  >("intro");

  const nameRef = useRef<string>("");
  // photos removed per request – keep variable to avoid wide changes (unused)
  // photos removed per request
  // const avatarUrlRef = useRef<string | undefined>(undefined);
  const linkedinUrlRef = useRef<string | undefined>(undefined);
  const aboutRef = useRef<string>("");
  const lookingRef = useRef<string>("");
  const participantIdRef = useRef<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: "m1",
        role: "assistant",
        timestamp: new Date(),
        content: `Welcome to ${eventName}! Let's create your profile so I can match you.\n\nFirst, enter your name and surname.`,
        actions: [],
      },
    ]);
    setStep("ask_name");
  }, [eventName]);

  // If LinkedIn auth is enabled, try to fetch session to prefill
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const name = json?.user?.name as string | undefined;
        if (name) {
          nameRef.current = name;
          push({ role: "assistant", content: `Hi ${name}!` });
          setStep("ask_about");
          push({
            role: "assistant",
            content:
              "Tell me a bit about yourself. What do you do, interests, goals?",
          });
        }
      } catch {}
    };
    loadSession();
  }, []);

  const footer = useMemo(() => {
    // if (step === "ask_name") {
    //   const handleLinkedIn = async () => {
    //     const callback = encodeURIComponent(window.location.href);
    //     window.location.href = `/api/auth/signin/linkedin?callbackUrl=${callback}`;
    //   };
    //   return (
    //     <div style={{ marginTop: 8 }}>
    //       <Button onClick={handleLinkedIn} variant="secondary">
    //         <span className="fa fa-linkedin" style={{ marginRight: 8 }} />
    //         Continue with LinkedIn
    //       </Button>
    //     </div>
    //   );
    // }
    return null;
  }, [step]);

  const push = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), timestamp: new Date(), ...msg },
    ]);
  };

  const onSendMessage = useCallback(
    async (text: string) => {
      // show user message
      push({ role: "user", content: text });

      if (step === "ask_name") {
        nameRef.current = text.trim();
        setIsTyping(true);
        setStep("ask_about");
        setTimeout(() => {
          push({
            role: "assistant",
            content:
              "Nice to meet you! Tell me a bit about yourself: your interests, field of work, aspiration",
          });
          setIsTyping(false);
        }, 600);
        return;
      }

      // photo step removed

      if (step === "ask_about") {
        aboutRef.current = text.trim();
        setIsTyping(true);
        setStep("ask_looking");
        setTimeout(() => {
          push({
            role: "assistant",
            content:
              "Who would you like to meet? Describe the ideal person (skills, background, goals).",
          });
          setIsTyping(false);
        }, 500);
        return;
      }

      if (step === "ask_looking") {
        lookingRef.current = text.trim();
        setStep("ask_linkedin");
        setIsTyping(true);
        setTimeout(() => {
          push({
            role: "assistant",
            content:
              "Please paste your LinkedIn profile URL (optional) so others can connect. Type 'skip' to continue without it.",
          });
          setIsTyping(false);
        }, 400);
        return;
      }

      if (step === "ask_linkedin") {
        const url = text.trim();
        if (url.toLowerCase() !== "skip") {
          const maybe = url.match(/^https?:\/\/[^\s]+$/i)?.[0];
          if (maybe) linkedinUrlRef.current = maybe;
        }
        setStep("submitting");
        setIsTyping(true);

        try {
          // Create participant
          const res = await fetch(`/api/events/${eventId}/participants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: nameRef.current,
              linkedinUrl: linkedinUrlRef.current,
              aboutYou: aboutRef.current,
              lookingFor: lookingRef.current,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to join");
          participantIdRef.current = data.id;

          push({
            role: "assistant",
            content:
              "Awesome. Creating your profile and finding your best matches...",
          });

          // Request matches
          const m = await fetch(`/api/participants/${data.id}/match`, {
            method: "POST",
          }).then((r) => r.json());

          if (m.matches && m.matches.length) {
            const cards = (
              <div style={{ display: "grid", gap: 14 }}>
                {m.matches.map(
                  (x: {
                    id: string;
                    name: string;
                    linkedinUrl?: string | null;
                    aiProfile?: string | null;
                    reason?: string;
                  }) => (
                    <MatchCard
                      key={x.id}
                      style={{
                        background: "#ffffff",
                        boxShadow: "0 8px 22px rgba(18,20,12,0.1)",
                      }}
                    >
                      <FlexRow
                        style={{ marginBottom: 8, alignItems: "flex-start" }}
                      >
                        <InitialCircle
                          style={{
                            background: `hsl(${
                              ((x.name?.charCodeAt(0) || 65) * 33) % 360
                            } 70% 45%)`,
                          }}
                        >
                          {x.name?.slice(0, 1) || "?"}
                        </InitialCircle>
                        <div style={{ fontWeight: 700, color: "#12140C" }}>
                          {x.name}
                        </div>
                      </FlexRow>
                      {x.aiProfile && (
                        <p
                          style={{
                            margin: 0,
                            lineHeight: 1.6,
                            color: "#444",
                            fontStyle: "italic",
                          }}
                        >
                          {x.aiProfile}
                        </p>
                      )}
                      {x.reason && (
                        <p
                          style={{
                            marginTop: 8,
                            fontStyle: "italic",
                            color: "#6b7280",
                          }}
                        >
                          {x.reason}
                        </p>
                      )}
                      {x.linkedinUrl && (
                        <div style={{ marginTop: 10 }}>
                          <a
                            href={x.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#0EA5E9", textDecoration: "none" }}
                          >
                            View LinkedIn →
                          </a>
                        </div>
                      )}
                    </MatchCard>
                  )
                )}
              </div>
            );
            push({
              role: "assistant",
              content: "Here are your top matches:",
              rich: cards,
            });
          } else {
            push({
              role: "assistant",
              content:
                "I couldn't find strong matches yet. Try again later as more people join.",
            });
          }
          setIsTyping(false);
          setStep("matched");
        } catch (err) {
          setIsTyping(false);
          const msg = err instanceof Error ? err.message : "Unknown error";
          push({ role: "assistant", content: `Error: ${msg}` });
          setStep("ask_name");
        }
        return;
      }
    },
    [eventId, step]
  );

  return (
    <Chat
      messages={messages}
      onSendMessage={onSendMessage}
      isTyping={isTyping}
      placeholder={
        step === "ask_name"
          ? "Type your name..."
          : step === "ask_about"
          ? "Describe yourself..."
          : step === "ask_looking"
          ? "Who are you looking to meet?"
          : step === "ask_linkedin"
          ? "Paste LinkedIn URL or type 'skip'"
          : "Type a message..."
      }
      footerSlot={footer}
      inputDisabled={step === "submitting"}
    />
  );
}
