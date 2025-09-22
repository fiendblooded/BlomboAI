import Link from "next/link";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  FlexRow,
  Grid,
} from "@/components/ui";

export default function HomePage() {
  return (
    <Container>
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/blombo.png"
            alt="Blombo"
            width={64}
            height={64}
            style={{ borderRadius: 12, border: "1px solid var(--card-border)" }}
          />
          <div>
            <Title style={{ margin: 0 }}>Blombo</Title>
            <Subtitle style={{ margin: 0 }}>
              AI Matches for Real‑World Events
            </Subtitle>
          </div>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(18,20,12,0.06) 0%, rgba(18,20,12,0.02) 100%)",
            border: "1px solid var(--card-border)",
            padding: "1.25rem 1.5rem",
            borderRadius: 12,
            marginBottom: "1rem",
          }}
        >
          <p style={{ color: "var(--text-color)", lineHeight: 1.7, margin: 0 }}>
            Blombo is your event sidekick. We learn who guests are and what
            they’re looking for, then introduce the two best people to
            meet—right now. No forms. Just a delightful chat and smart matches.
          </p>
        </div>

        <Grid columns={2}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--card-border)",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              boxShadow: "0 8px 22px rgba(18,20,12,0.08)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8, color: "#12140C" }}>
              For Organizers
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: "var(--muted-text)",
                lineHeight: 1.7,
              }}
            >
              <li>Create an event in chat</li>
              <li>Share a QR code or link</li>
              <li>Real‑time participant list</li>
              <li>LLM‑powered matching (human‑readable reasons)</li>
            </ul>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--card-border)",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              boxShadow: "0 8px 22px rgba(18,20,12,0.08)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8, color: "#12140C" }}>
              For Guests
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: "var(--muted-text)",
                lineHeight: 1.7,
              }}
            >
              <li>Join via QR or event code</li>
              <li>Answer 3 quick prompts</li>
              <li>Get your top 2 matches + why they’re great</li>
              <li>Ask for two more anytime</li>
            </ul>
          </div>
        </Grid>

        <div style={{ marginTop: 16 }}>
          <FlexRow style={{ justifyContent: "center" }}>
            <Button as={Link as any} href="/app">
              Open Blombo
            </Button>
            <Button as={Link as any} href="/e/XXXXX" variant="secondary">
              Try a Demo Event
            </Button>
          </FlexRow>
        </div>
      </Card>
    </Container>
  );
}
