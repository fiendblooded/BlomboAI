"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Chat, { ChatMessage } from "@/components/Chat";
import { Button } from "@/components/ui";

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
    | "ask_photo"
    | "ask_about"
    | "ask_looking"
    | "submitting"
    | "matched"
  >("intro");

  const nameRef = useRef<string>("");
  const avatarUrlRef = useRef<string | undefined>(undefined);
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
        content: `Welcome to ${eventName}! Let's create your profile so I can match you.\n\nFirst, enter your name or use the LinkedIn button below.`,
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
        const image = json?.user?.image as string | undefined;
        if (name) {
          nameRef.current = name;
          avatarUrlRef.current = image;
          push({ role: "assistant", content: `Hi ${name}!` });
          setStep("ask_photo");
          push({
            role: "assistant",
            content:
              "Upload a photo (optional). If you'd like to keep your LinkedIn photo, type 'keep'. Or type 'skip'.",
          });
        }
      } catch {}
    };
    loadSession();
  }, []);

  const footer = useMemo(() => {
    if (step === "ask_name") {
      const handleLinkedIn = async () => {
        const callback = encodeURIComponent(window.location.href);
        window.location.href = `/api/auth/signin/linkedin?callbackUrl=${callback}`;
      };
      return (
        <div style={{ marginTop: 8 }}>
          <Button onClick={handleLinkedIn}>Sign up with LinkedIn</Button>
        </div>
      );
    }
    if (step === "ask_photo") {
      const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            // Compress via canvas: max 512px dimension
            const maxDim = 512;
            let { width, height } = img as HTMLImageElement;
            if (width > height && width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.78);
            avatarUrlRef.current = dataUrl; // store as base64 data URL
            onSendMessage("uploaded photo");
          };
          img.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      };
      return (
        <div style={{ marginTop: 8 }}>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ color: "#cbd5e1" }}
          />
        </div>
      );
    }
    return null;
  }, [step, onSendMessage]);

  const push = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), timestamp: new Date(), ...msg },
    ]);
  };

  const onSendMessage = async (text: string) => {
    // show user message
    push({ role: "user", content: text });

    if (step === "ask_name") {
      nameRef.current = text.trim();
      setIsTyping(true);
      setStep("ask_photo");
      setTimeout(() => {
        push({
          role: "assistant",
          content:
            "Nice to meet you! Upload a photo (optional). If you prefer to skip, type 'skip'.",
        });
        setIsTyping(false);
      }, 600);
      return;
    }

    if (step === "ask_photo") {
      if (text.toLowerCase() === "keep") {
        // keep LinkedIn photo
      } else if (text.toLowerCase() !== "skip") {
        avatarUrlRef.current = text; // accept URL for now
      }
      setIsTyping(true);
      setStep("ask_about");
      setTimeout(() => {
        push({
          role: "assistant",
          content:
            "Tell me a bit about yourself. What do you do, interests, goals?",
        });
        setIsTyping(false);
      }, 500);
      return;
    }

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
      setStep("submitting");
      setIsTyping(true);

      try {
        // Create participant
        const res = await fetch(`/api/events/${eventId}/participants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameRef.current,
            avatarUrl: avatarUrlRef.current,
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
            <div style={{ display: "grid", gap: 12 }}>
              {m.matches.map(
                (x: {
                  id: string;
                  name: string;
                  avatarUrl?: string | null;
                  linkedinUrl?: string | null;
                  aiProfile?: string | null;
                  reason?: string;
                }) => (
                  <div
                    key={x.id}
                    style={{
                      background: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid rgba(51,65,85,0.6)",
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {x.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={x.avatarUrl}
                          alt={x.name}
                          width={40}
                          height={40}
                          style={{ borderRadius: 20 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            background: "#0ea5e9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 700,
                          }}
                        >
                          {x.name?.slice(0, 1) || "?"}
                        </div>
                      )}
                      <div style={{ fontWeight: 700 }}>{x.name}</div>
                    </div>
                    {x.aiProfile && (
                      <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                        {x.aiProfile}
                      </div>
                    )}
                    {x.reason && (
                      <div
                        style={{
                          marginTop: 6,
                          fontStyle: "italic",
                          color: "#9ca3af",
                        }}
                      >
                        {x.reason}
                      </div>
                    )}
                    {x.linkedinUrl && (
                      <div style={{ marginTop: 8 }}>
                        <a
                          href={x.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#38bdf8" }}
                        >
                          View LinkedIn →
                        </a>
                      </div>
                    )}
                  </div>
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
      } catch (err: any) {
        setIsTyping(false);
        push({ role: "assistant", content: `Error: ${err.message}` });
        setStep("ask_name");
      }
      return;
    }
  };

  return (
    <Chat
      messages={messages}
      onSendMessage={onSendMessage}
      isTyping={isTyping}
      placeholder={
        step === "ask_name"
          ? "Type your name..."
          : step === "ask_photo"
          ? "Paste a photo URL or type 'skip'"
          : step === "ask_about"
          ? "Describe yourself..."
          : step === "ask_looking"
          ? "Who are you looking to meet?"
          : "Type a message..."
      }
      footerSlot={footer}
      inputDisabled={step === "submitting"}
    />
  );
}
