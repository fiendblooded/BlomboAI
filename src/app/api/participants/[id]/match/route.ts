import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ParticipantModel } from "@/lib/models";
import { rankMatchesLLM } from "@/lib/ai";
import mongoose from "mongoose";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const self = await ParticipantModel.findById(id).exec();
    if (!self)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { searchParams } = new URL(req.url);
    const excludeIdsRaw = searchParams.get("excludeIds");
    const topKRaw = searchParams.get("topK");
    const excludeIds = excludeIdsRaw
      ? excludeIdsRaw.split(",").filter(Boolean)
      : [];
    const topK = Math.max(1, Math.min(Number(topKRaw) || 2, 10));

    const filter: Record<string, unknown> = {
      eventId: self.eventId,
      _id: { $ne: self._id },
    };
    if (excludeIds.length) {
      filter._id = { $ne: self._id, $nin: excludeIds } as unknown as never;
    }

    const others = await ParticipantModel.find(filter).exec();

    const llmRanked = await rankMatchesLLM({
      self: {
        id: self._id.toString(),
        name: self.name,
        aiProfile: self.aiProfile || "",
        preferences: self.preferences || "",
      },
      candidates: others.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        aiProfile: p.aiProfile || "",
        preferences: p.preferences || "",
      })),
      topK,
    });

    const top2 = llmRanked
      .map((r) => ({
        p: others.find((x) => x._id.toString() === r.id),
        reason: r.reason,
      }))
      .filter((x) => Boolean(x.p))
      .map(({ p, reason }) => ({
        id: p!._id.toString(),
        name: p!.name,
        avatarUrl: p!.avatarUrl || null,
        linkedinUrl: p!.linkedinUrl || null,
        aiProfile: p!.aiProfile || null,
        reason,
        score: 1,
      }));

    self.lastMatchedAt = new Date();
    self.matches = [
      ...(self.matches || []),
      ...top2.map((m) => ({
        participantId: new mongoose.Types.ObjectId(m.id),
        score: m.score,
        createdAt: new Date(),
      })),
    ];
    await self.save();

    return NextResponse.json({ matches: top2 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
