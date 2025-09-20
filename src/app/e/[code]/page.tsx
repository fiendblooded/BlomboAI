import Link from "next/link";
import { headers } from "next/headers";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  GlobalStyle,
} from "@/components/ui";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

async function resolve(code: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/resolve/${code}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function CodeEntryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const event = await resolve(code);

  if (!event) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <Title>Event Not Found</Title>
            <Subtitle>
              The event code you&apos;re looking for doesn&apos;t exist or has
              ended.
            </Subtitle>
            <div style={{ textAlign: "center" }}>
              <Button as={Link} href="/join" variant="secondary">
                Try Another Code
              </Button>
            </div>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Title>Welcome to {event.name}</Title>
          <Subtitle>
            Ready to connect with like-minded people at this event?
          </Subtitle>

          <div
            style={{
              textAlign: "center",
              padding: "2rem 0",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
              margin: "1rem 0",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#667eea" }}>
              🎯 Smart Matching
            </h3>
            <p style={{ margin: 0, color: "#666" }}>
              Our AI will analyze your profile and preferences to find your best
              connections
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Button as={Link} href={`/e/${code}/chat`}>
              Open Chatbot →
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
}
