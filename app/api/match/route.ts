import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get("tournamentId");

  const matches = await prisma.match.findMany({
    where: tournamentId ? { tournamentId } : undefined,
    include: { teamA: true, teamB: true, tournament: true },
    orderBy: [{ round: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(matches);
}
