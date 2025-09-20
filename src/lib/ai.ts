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


