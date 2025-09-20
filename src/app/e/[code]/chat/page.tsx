import { headers } from "next/headers";
import { Container, Card, Title, Subtitle, GlobalStyle } from "@/components/ui";
import JoinChatbot from "./JoinChatbot";

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

export default async function EventChatPage({
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
              The code &quot;{code}&quot; is invalid or expired.
            </Subtitle>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <JoinChatbot eventId={event.id} eventName={event.name} />
      </Container>
    </>
  );
}
