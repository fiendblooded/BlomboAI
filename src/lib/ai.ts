import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateProfileSummary(args: {
  name: string;
  aboutYou: string;
  lookingFor: string;
}): Promise<string> {
  const prompt = `Create a concise, friendly networking blurb for an event attendee.\nName: ${args.name}\nAbout: ${args.aboutYou}\nLooking for: ${args.lookingFor}\nKeep it under 60 words, personable, and specific.`;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You write short, engaging networking bios." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });
  return res.choices[0]?.message?.content?.trim() || "";
}

export async function embedText(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0]?.embedding || [];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

export async function rankMatchesLLM(args: {
  self: { id: string; name: string; aiProfile?: string; preferences?: string };
  candidates: Array<{
    id: string;
    name: string;
    aiProfile?: string;
    preferences?: string;
  }>;
  topK?: number;
}): Promise<{ id: string; reason: string }[]> {
  const { self, candidates } = args;
  const topK = 1;

  const system = `You are an expert networking assistant. Choose the best matches for the attendee based on bidirectional fit:
- Fit A: How well a candidate's profile matches what the attendee is looking for
- Fit B: How well the attendee's profile matches what the candidate is looking for
Return exactly ${topK} best matches with short reasons. Respond as JSON { matches: [{ id, reason }] }`;

  const payload = {
    self,
    candidates: candidates.map((c) => ({
      id: c.id,
      name: c.name,
      aiProfile: c.aiProfile || "",
      preferences: c.preferences || "",
    })),
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Select top ${topK} matches for this attendee from the list. Data: ${JSON.stringify(
          payload
        )}`,
      },
    ],
    temperature: 0.4,
  });

  try {
    const content = res.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content) as {
      matches?: { id: string; reason: string }[];
    };
    return (parsed.matches || []).slice(0, topK);
  } catch {
    return [];
  }
}
