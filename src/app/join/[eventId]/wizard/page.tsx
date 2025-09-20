"use client";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  Title,
  Subtitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  Button,
  ErrorMessage,
  FlexRow,
} from "@/components/ui";

export default function JoinWizard({
  params,
}: {
  params: { eventId: string };
}) {
  // Note: This is a client component, so params is not a Promise
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
        body: JSON.stringify({
          name,
          avatarUrl,
          linkedinUrl,
          aboutYou,
          lookingFor,
        }),
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
    <Container>
      <Card>
        <Title>Join Event</Title>
        <Subtitle>Let's set up your profile for smart matching</Subtitle>

        {!session && (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <Button
              variant="secondary"
              onClick={() => signIn("linkedin")}
              style={{ marginBottom: "1rem" }}
            >
              Continue with LinkedIn
            </Button>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Or fill out the form below manually
            </p>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <FormGroup>
            <Label>Your Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Profile Picture URL</Label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </FormGroup>

          <FormGroup>
            <Label>LinkedIn Profile URL</Label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </FormGroup>

          <FormGroup>
            <Label>About You *</Label>
            <TextArea
              value={aboutYou}
              onChange={(e) => setAboutYou(e.target.value)}
              placeholder="Tell us about yourself, your background, interests, and what you do..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Who Are You Looking to Meet? *</Label>
            <TextArea
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              placeholder="Describe the type of people you'd like to connect with at this event..."
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button disabled={loading} type="submit">
            {loading ? "Joining..." : "Join Event & Get Matches"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
