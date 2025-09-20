import QRCode from "qrcode";
import Link from "next/link";
import { headers } from "next/headers";
import Participants from "./participants";
import {
  Container,
  Card,
  Title,
  Subtitle,
  QRContainer,
  Button,
  FlexRow,
  Badge,
  GlobalStyle,
} from "@/components/ui";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

async function getEvent(id: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

async function getParticipantsCount(id: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/events/${id}/participants`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return (data.participants || []).length;
}

export default async function EventDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  const joinUrl = `${await getBaseUrl()}/e/${event.code}`;
  const qrDataUrl = await QRCode.toDataURL(joinUrl);
  const participantsCount = await getParticipantsCount(event.id);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Title>{event.name}</Title>
                <Subtitle>Event Dashboard</Subtitle>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div
              style={{
                height: 6,
                background: "linear-gradient(90deg, #12140C, #0EA5E9)",
                borderRadius: 6,
                marginTop: 12,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "1rem",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--card-border)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  boxShadow: "0 8px 22px rgba(18,20,12,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Share Link</div>
                  <Badge>Code {event.code}</Badge>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Link
                    href={`/e/${event.code}`}
                    style={{ color: "#0EA5E9", textDecoration: "none" }}
                  >
                    {joinUrl}
                  </Link>
                </div>
                <FlexRow style={{ marginTop: 12 }}>
                  <Button as={Link} href={`/e/${event.code}/chat`}>
                    Open Chatbot
                  </Button>
                  <Button
                    as={Link}
                    href={`/e/${event.code}`}
                    variant="secondary"
                  >
                    Preview Link
                  </Button>
                </FlexRow>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--card-border)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  boxShadow: "0 8px 22px rgba(18,20,12,0.08)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>QR Code</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code" width={200} height={200} />
                <div style={{ color: "var(--muted-text)", marginTop: 6 }}>
                  Scan to join
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--card-border)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  boxShadow: "0 6px 18px rgba(18,20,12,0.08)",
                }}
              >
                <div style={{ color: "var(--muted-text)", fontSize: 12 }}>
                  Participants
                </div>
                <div
                  style={{ fontSize: 28, fontWeight: 700, color: "#12140C" }}
                >
                  {participantsCount}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--card-border)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  boxShadow: "0 6px 18px rgba(18,20,12,0.08)",
                }}
              >
                <div style={{ color: "var(--muted-text)", fontSize: 12 }}>
                  Status
                </div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {event.status || "active"}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--card-border)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  boxShadow: "0 6px 18px rgba(18,20,12,0.08)",
                }}
              >
                <div style={{ color: "var(--muted-text)", fontSize: 12 }}>
                  Share Code
                </div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}
                >
                  {event.code}
                </div>
              </div>
            </div>

            <FlexRow style={{ justifyContent: "center" }}>
              <Button as={Link} href={`/e/${event.code}`} variant="secondary">
                Preview Join Page
              </Button>
              <form
                action={async () => {
                  "use server";
                  await fetch(
                    `${await getBaseUrl()}/api/admin/events/${event.id}`,
                    { method: "POST" }
                  );
                }}
              >
                <Button type="submit" variant="danger">
                  End Event
                </Button>
              </form>
            </FlexRow>

            <div>
              <h2 style={{ marginBottom: "0.75rem", color: "#12140C" }}>
                Participants
              </h2>
              <Participants eventId={event.id} />
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
