"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  ErrorMessage,
  MatchCard,
  Avatar,
  FlexRow,
  Badge,
} from "@/components/ui";

export default function MatchesPage({
  params,
}: {
  params: { participantId: string };
}) {
  // Note: This is a client component, so params is not a Promise
  type Match = {
    id: string;
    name: string;
    avatarUrl?: string | null;
    linkedinUrl?: string | null;
    aiProfile?: string | null;
    score: number;
  };
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatches() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/participants/${params.participantId}/match`,
        { method: "POST" }
      );
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
            <MatchCard key={match.id}>
              <FlexRow style={{ marginBottom: "1rem" }}>
                {match.avatarUrl && (
                  <Avatar src={match.avatarUrl} alt={match.name} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: "#333", fontSize: "1.25rem" }}>
                    {match.name}
                  </h3>
                  {match.linkedinUrl && (
                    <a
                      href={match.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#667eea",
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
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  &quot;{match.aiProfile}&quot;
                </p>
              )}

              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  color: "#888",
                }}
              >
                Compatibility Score: {(match.score * 100).toFixed(1)}%
              </div>
            </MatchCard>
          ))}
        </div>
      </Card>
    </Container>
  );
}
