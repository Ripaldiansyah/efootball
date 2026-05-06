import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { matches: true } } },
  });
  return NextResponse.json(tournaments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const tournament = await prisma.tournament.create({
    data: { name: body.name, type: body.type },
  });
  return NextResponse.json(tournament, { status: 201 });
}
