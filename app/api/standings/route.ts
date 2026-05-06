import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get("tournamentId");

  if (!tournamentId) {
    return NextResponse.json({ error: "tournamentId required" }, { status: 400 });
  }

  const standings = await prisma.standing.findMany({
    where: { tournamentId },
    include: { team: true },
    orderBy: [
      { points: "desc" },
      { goalsFor: "desc" },
    ],
  });

  // Sort by GD as secondary, GF as tertiary
  type StandingRow = (typeof standings)[number];
  const sorted = standings.sort((a: StandingRow, b: StandingRow) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });

  return NextResponse.json(sorted);
}
