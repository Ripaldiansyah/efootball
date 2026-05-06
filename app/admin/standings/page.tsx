export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import StandingsClient from "./StandingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Standings" };

export default async function StandingsPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { name: "asc" },
  });

  const leagueTournaments = tournaments.filter((t: { type: string }) => t.type === "LEAGUE");
  const firstId = leagueTournaments[0]?.id ?? null;

  let initialStandings: Awaited<ReturnType<typeof getStandings>> = [];
  if (firstId) {
    initialStandings = await getStandings(firstId);
  }

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className="page-title">League Standings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          View sorted league tables by points, goal difference, and goals scored.
        </p>
      </div>
      <StandingsClient
        tournaments={tournaments}
        initialStandings={initialStandings}
        initialTournamentId={firstId}
      />
    </div>
  );
}

async function getStandings(tournamentId: string) {
  const standings = await prisma.standing.findMany({
    where: { tournamentId },
    include: { team: true },
  });
  type Row = { points: number; goalsFor: number; goalsAgainst: number };
  return standings.sort((a: Row, b: Row) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });
}
