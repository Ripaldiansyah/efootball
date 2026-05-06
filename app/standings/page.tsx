import { prisma } from "@/lib/prisma";
import StandingsClient from "@/app/admin/standings/StandingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Public Standings" };

export default async function PublicStandingsPage() {
  const tournaments = await prisma.tournament.findMany({
    where: { type: "LEAGUE" },
    orderBy: { name: "asc" },
  });

  const firstId = tournaments[0]?.id ?? null;

  let initialStandings: Awaited<ReturnType<typeof getStandings>> = [];
  if (firstId) {
    initialStandings = await getStandings(firstId);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4f9eff, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            ⚽
          </div>
          <div>
            <h1 className="page-title">League Standings</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              Live eFootball Tournament Standings
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <a href="/bracket" className="btn-ghost" style={{ textDecoration: "none", marginRight: "12px" }}>
              View Bracket
            </a>
            <a href="/admin" className="btn-ghost" style={{ textDecoration: "none" }}>
              Admin
            </a>
          </div>
        </div>

        <StandingsClient
          tournaments={tournaments}
          initialStandings={initialStandings}
          initialTournamentId={firstId}
        />
      </div>
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
