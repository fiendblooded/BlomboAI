"use client";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinWizard({ params }: { params: { eventId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(session?.user?.image || "");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${params.eventId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarUrl, linkedinUrl, aboutYou, lookingFor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join");
      router.push(`/me/${data.id}/matches`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Join Event</h1>
      <p>Optionally sign in with LinkedIn to prefill your name and picture.</p>
      <button onClick={() => signIn("linkedin")} style={{ marginBottom: 16 }}>
        Continue with LinkedIn
      </button>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Avatar URL
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </label>
        <label>
          LinkedIn URL
          <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
        </label>
        <label>
          About you
          <textarea value={aboutYou} onChange={(e) => setAboutYou(e.target.value)} required />
        </label>
        <label>
          Who are you looking for
          <textarea value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} required />
        </label>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button disabled={loading} type="submit">
          {loading ? "Joining..." : "Join"}
        </button>
      </form>
    </div>
  );
}


