import QRCode from "qrcode";
import Link from "next/link";
import { headers } from "next/headers";

function getBaseUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

async function getEvent(id: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

export default async function EventDashboard({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  const joinUrl = `${getBaseUrl()}/e/${event.code}`;
  const qrDataUrl = await QRCode.toDataURL(joinUrl);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1>Event: {event.name}</h1>
      <p>Code: <strong>{event.code}</strong></p>
      <p>
        Share link: <Link href={`/e/${event.code}`}>{`/e/${event.code}`}</Link>
      </p>
      <img src={qrDataUrl} alt="QR code" width={220} height={220} />
      <div style={{ marginTop: 24 }}>
        <Link href={`/e/${event.code}`}>Open Join Page</Link>
      </div>
    </div>
  );
}


