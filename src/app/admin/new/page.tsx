"use client";
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
} from "@/components/ui";

export default function NewEventPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, posterUrl, websiteUrl, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");
      router.push(`/admin/events/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Card>
        <Title>Create Event</Title>
        <Subtitle>Set up your event and start connecting people</Subtitle>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Label>Event Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tech Conference 2024"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Poster Image URL</Label>
            <Input
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://example.com/poster.jpg"
            />
          </FormGroup>
          <FormGroup>
            <Label>Website URL</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourconference.com"
            />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell attendees about your event..."
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button disabled={loading} type="submit">
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
