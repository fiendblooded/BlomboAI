import Link from "next/link";
import { headers } from "next/headers";

function getBaseUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

async function resolve(code: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/resolve/${code}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function CodeEntryPage({ params }: { params: { code: string } }) {
  const event = await resolve(params.code);
  if (!event) {
    return (
      <div style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
        <h1>Event not found</h1>
        <p>Check the code and try again.</p>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Join {event.name}</h1>
      <p>Ready to join? Continue to the short onboarding.</p>
      <Link href={`/join/${event.id}/wizard`}>Start</Link>
    </div>
  );
}


