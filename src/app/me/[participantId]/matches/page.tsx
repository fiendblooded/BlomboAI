"use client";
import { useEffect, useState } from "react";

export default function MatchesPage({ params }: { params: { participantId: string } }) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatches() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/participants/${params.participantId}/match`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get matches");
      setMatches(data.matches || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1>Your Matches</h1>
      <button onClick={fetchMatches} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? "Matching..." : "Get Matches Again"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {matches.length === 0 && !loading && <p>No matches yet.</p>}
      <div style={{ display: "grid", gap: 12 }}>
        {matches.map((m) => (
          <div key={m.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {m.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.avatarUrl} alt={m.name} width={48} height={48} style={{ borderRadius: "50%" }} />
              )}
              <div>
                <div style={{ fontWeight: 600 }}>{m.name}</div>
                {m.linkedinUrl && (
                  <a href={m.linkedinUrl} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            {m.aiProfile && <p style={{ marginTop: 8 }}>{m.aiProfile}</p>}
            <div style={{ fontSize: 12, color: "#666" }}>Score: {m.score.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


