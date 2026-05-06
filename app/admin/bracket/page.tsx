export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import BracketClient from "./BracketClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bracket" };

export default async function BracketPage() {
  const tournaments = await prisma.tournament.findMany({ orderBy: { name: "asc" } });
  const cupTournaments = tournaments.filter((t: { type: string }) => t.type === "CUP");
  const firstId = cupTournaments[0]?.id ?? null;

  let initialMatches: Awaited<ReturnType<typeof getMatches>> = [];
  if (firstId) {
    initialMatches = await getMatches(firstId);
  }

  return (
    <div style={{ maxWidth: "1400px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className="page-title">Cup Bracket</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Visualize the knockout bracket for cup tournaments.
        </p>
      </div>
      <BracketClient
        tournaments={tournaments}
        initialMatches={initialMatches}
        initialTournamentId={firstId}
      />
    </div>
  );
}

async function getMatches(tournamentId: string) {
  return prisma.match.findMany({
    where: { tournamentId },
    orderBy: [{ round: "asc" }, { createdAt: "asc" }],
    include: { teamA: true, teamB: true },
  });
}
