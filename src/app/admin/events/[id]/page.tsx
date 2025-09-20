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
  GlobalStyle 
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

export default async function EventDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  const joinUrl = `${await getBaseUrl()}/e/${event.code}`;
  const qrDataUrl = await QRCode.toDataURL(joinUrl);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Title>{event.name}</Title>
          <Subtitle>Event Dashboard</Subtitle>
          
          <div style={{ 
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem"
          }}>
            <FlexRow style={{ marginBottom: "1rem" }}>
              <div>
                <strong>Event Code:</strong> <Badge>{event.code}</Badge>
              </div>
            </FlexRow>
            
            <div style={{ marginBottom: "1rem" }}>
              <strong>Share Link:</strong>{" "}
              <Link 
                href={`/e/${event.code}`}
                style={{ color: "#667eea", textDecoration: "none" }}
              >
                {joinUrl}
              </Link>
            </div>
          </div>

          <QRContainer>
            <h3 style={{ margin: 0, color: "#333" }}>QR Code for Easy Sharing</h3>
            <img src={qrDataUrl} alt="QR code" width={220} height={220} />
            <p style={{ color: "#666", textAlign: "center", margin: 0 }}>
              Attendees can scan this to join instantly
            </p>
          </QRContainer>

          <FlexRow style={{ justifyContent: "center", marginBottom: "2rem" }}>
            <Button as={Link} href={`/e/${event.code}`} variant="secondary">
              Preview Join Page
            </Button>
            <form
              action={async () => {
                "use server";
                await fetch(`${await getBaseUrl()}/api/admin/events/${event.id}`, {
                  method: "POST",
                });
              }}
            >
              <Button type="submit" variant="danger">
                End Event
              </Button>
            </form>
          </FlexRow>

          <div>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>Participants</h2>
            <Participants eventId={event.id} />
          </div>
        </Card>
      </Container>
    </>
  );
}