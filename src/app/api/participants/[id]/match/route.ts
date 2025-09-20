import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ParticipantModel } from "@/lib/models";
import { cosineSimilarity } from "@/lib/ai";
import mongoose from "mongoose";

interface Params { params: { id: string } }

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const self = await ParticipantModel.findById(params.id).exec();
    if (!self) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const others = await ParticipantModel.find({ eventId: self.eventId, _id: { $ne: self._id } }).exec();

    const scored = others.map((p) => {
      const s1 = cosineSimilarity(self.preferencesEmbedding || [], p.aiProfileEmbedding || []);
      const s2 = cosineSimilarity(p.preferencesEmbedding || [], self.aiProfileEmbedding || []);
      const score = 0.6 * s1 + 0.4 * s2;
      return { participant: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top2 = scored.slice(0, 2).map(({ participant, score }) => ({
      id: participant._id.toString(),
      name: participant.name,
      avatarUrl: participant.avatarUrl || null,
      linkedinUrl: participant.linkedinUrl || null,
      aiProfile: participant.aiProfile || null,
      score,
    }));

    self.lastMatchedAt = new Date();
    self.matches = [
      ...(self.matches || []),
      ...top2.map((m) => ({ participantId: new mongoose.Types.ObjectId(m.id), score: m.score, createdAt: new Date() })),
    ];
    await self.save();

    return NextResponse.json({ matches: top2 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


