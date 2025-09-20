"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/resolve/${code}`);
    const data = await res.json();
    if (!res.ok) {
      setError("Event not found");
      return;
    }
    router.push(`/e/${data.code}`);
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}>
      <h1>Join an Event</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Enter event code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}


