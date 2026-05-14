import { NextRequest, NextResponse } from "next/server";
import { generateCertificatePDF } from "@/lib/certificate";
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");
  const tournamentId = searchParams.get("tournamentId");
  const achievement = searchParams.get("achievement") ?? "Participant";

  if (!teamId || !tournamentId) {
    return NextResponse.json({ error: "teamId and tournamentId required" }, { status: 400 });
  }

  const [team, tournament] = await Promise.all([
    prisma.team.findUnique({ where: { id: teamId } }),
    prisma.tournament.findUnique({ where: { id: tournamentId } }),
  ]);

  if (!team || !tournament) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = await generateCertificatePDF({
      teamName: team.name,
      tournamentName: tournament.name,
      achievement,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${team.name.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
