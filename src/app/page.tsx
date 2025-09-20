"use client";
import Link from "next/link";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Grid,
  LinkCard,
} from "@/components/ui";

export default function HomePage() {
  return (
    <Container>
      <Card>
        <Title>Event Matcher</Title>
        <Subtitle>
          Connect people at events with smart AI-powered matching
        </Subtitle>
        <Grid columns={3}>
          <LinkCard as={Link} href="/admin/new">
            <h2>Create an Event →</h2>
            <p>
              Set up event details and get a shareable QR code and link for
              attendees.
            </p>
          </LinkCard>
          <LinkCard as={Link} href="/join">
            <h2>Join an Event →</h2>
            <p>Enter an event code or scan a QR code to start networking.</p>
          </LinkCard>
          <LinkCard as={Link} href="/chat">
            <h2>💬 Chat Assistant →</h2>
            <p>Get help from our AI assistant to create or join events.</p>
          </LinkCard>
        </Grid>
      </Card>
    </Container>
  );
}
