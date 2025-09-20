"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  ErrorMessage,
} from "@/components/ui";
import CodeInput from "@/components/CodeInput";

export default function JoinEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/resolve/${code}`);
      const data = await res.json();
      if (!res.ok) {
        setError("Event not found. Please check the code and try again.");
        return;
      }
      router.push(`/e/${data.code}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Card>
        <Title>Join an Event</Title>
        <Subtitle>Enter your event code to get started</Subtitle>

        <form onSubmit={onSubmit}>
          <CodeInput
            value={code}
            onChange={setCode}
            onComplete={(completedCode) => {
              if (completedCode.length === 6) {
                setCode(completedCode);
              }
            }}
            disabled={loading}
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button disabled={loading || code.length < 6} type="submit">
            {loading ? "Finding Event..." : "Continue"}
          </Button>
        </form>

        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          <p>Don't have a code? Ask the event organizer or scan the QR code.</p>
        </div>
      </Card>
    </Container>
  );
}
