"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  ErrorMessage,
  MatchCard,
  InitialCircle,
  FlexRow,
  Badge,
} from "@/components/ui";

export default function MatchesPage() {
  const params = useParams();
  const participantId = (params?.participantId as string) || "";
  type Match = {
    id: string;
    name: string;
    avatarUrl?: string | null;
    linkedinUrl?: string | null;
    aiProfile?: string | null;
    score: number;
    reason?: string;
  };
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatches() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/participants/${participantId}/match`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get matches");
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Card>
        <Title>Your Matches</Title>
        <Subtitle>
          AI-powered connections based on your profile and preferences
        </Subtitle>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Button onClick={fetchMatches} disabled={loading} variant="secondary">
            {loading ? "Finding Matches..." : "🔄 Get New Matches"}
          </Button>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {matches.length === 0 && !loading && !error && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            <p>No matches found yet. Try getting new matches!</p>
          </div>
        )}

        <div style={{ display: "grid", gap: "1rem" }}>
          {matches.map((match, index) => (
            <MatchCard
              key={match.id}
              style={{
                borderRadius: 16,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 12px 30px rgba(18,20,12,0.12)",
                border: "1px solid rgba(18,20,12,0.12)",
              }}
            >
              <FlexRow
                style={{ marginBottom: "1rem", alignItems: "flex-start" }}
              >
                <InitialCircle
                  style={{
                    background: `hsl(${
                      (match.name.charCodeAt(0) * 33) % 360
                    } 70% 45%)`,
                  }}
                >
                  {match.name.slice(0, 1)}
                </InitialCircle>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{ margin: 0, color: "#12140C", fontSize: "1.1rem" }}
                  >
                    {match.name}
                  </h3>
                  {match.linkedinUrl && (
                    <a
                      href={match.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#0EA5E9",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                      }}
                    >
                      View LinkedIn Profile →
                    </a>
                  )}
                </div>
                <Badge>Match #{index + 1}</Badge>
              </FlexRow>

              {match.aiProfile && (
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.6,
                    color: "#444",
                    fontStyle: "italic",
                  }}
                >
                  &quot;{match.aiProfile}&quot;
                </p>
              )}

              {match.reason && (
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontStyle: "italic",
                    color: "#6b7280",
                  }}
                >
                  {match.reason}
                </p>
              )}
            </MatchCard>
          ))}
        </div>
      </Card>
    </Container>
  );
}
