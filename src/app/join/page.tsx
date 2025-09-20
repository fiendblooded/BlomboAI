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
  Button, 
  ErrorMessage,
  GlobalStyle 
} from "@/components/ui";

export default function JoinEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch(`/api/resolve/${code}`);
      const data = await res.json();
      if (!res.ok) {
        setError("Event not found. Please check the code and try again.");
        return;
      }
      router.push(`/e/${data.code}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Title>Join an Event</Title>
          <Subtitle>Enter your event code to get started</Subtitle>
          
          <form onSubmit={onSubmit}>
            <FormGroup>
              <Label>Event Code</Label>
              <Input
                placeholder="Enter 6-character code (e.g. ABC123)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ 
                  textAlign: "center", 
                  fontSize: "1.5rem", 
                  letterSpacing: "0.2em",
                  fontWeight: "600"
                }}
                maxLength={6}
                required
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button disabled={loading || code.length < 6} type="submit">
              {loading ? "Finding Event..." : "Continue"}
            </Button>
          </form>
          
          <div style={{ 
            marginTop: "2rem", 
            textAlign: "center", 
            color: "#666", 
            fontSize: "0.9rem" 
          }}>
            <p>Don't have a code? Ask the event organizer or scan the QR code.</p>
          </div>
        </Card>
      </Container>
    </>
  );
}