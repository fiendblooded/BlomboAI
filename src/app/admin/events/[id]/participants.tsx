"use client";
import { useEffect, useState } from "react";
import { Avatar, FlexRow, MatchCard } from "@/components/ui";

export default function Participants({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<
    Array<{
      id: string;
      name: string;
      avatarUrl?: string | null;
      linkedinUrl?: string | null;
      aiProfile?: string | null;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/participants`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load participants");
      setItems(data.participants || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        Loading participants...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "#ff6b6b",
          background: "rgba(255, 107, 107, 0.1)",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#666",
          background: "#f8f9fa",
          borderRadius: "12px",
        }}
      >
        <p>
          No participants yet. Share your event code or QR code to get started!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {items.map((participant) => (
        <MatchCard key={participant.id}>
          <FlexRow>
            {participant.avatarUrl && (
              <Avatar src={participant.avatarUrl} alt={participant.name} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#333" }}>
                {participant.name}
              </div>
              {participant.linkedinUrl && (
                <a
                  href={participant.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  LinkedIn Profile →
                </a>
              )}
              {participant.aiProfile && (
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    color: "#666",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  &quot;{participant.aiProfile}&quot;
                </p>
              )}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#888",
                textAlign: "right",
              }}
            >
              Joined {new Date(participant.createdAt).toLocaleDateString()}
            </div>
          </FlexRow>
        </MatchCard>
      ))}
    </div>
  );
}
