import { NextRequest, NextResponse } from "next/server";
import { getCertificateHTML } from "@/lib/certificate";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId")!;
  const tournamentId = searchParams.get("tournamentId")!;
  const achievement = searchParams.get("achievement")!;

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });

  const html = getCertificateHTML({
    teamName: team?.name ?? "",
    tournamentName: tournament?.name ?? "",
    achievement,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
