import { prisma } from "@/lib/prisma";
import BracketClient from "@/app/admin/bracket/BracketClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Public Bracket" };

export default async function PublicBracketPage() {
  const tournaments = await prisma.tournament.findMany({
    where: { type: "CUP" },
    orderBy: { name: "asc" },
  });

  const firstId = tournaments[0]?.id ?? null;

  let initialMatches: Awaited<ReturnType<typeof getMatches>> = [];
  if (firstId) {
    initialMatches = await getMatches(firstId);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
            <h1 className="page-title">Knockout Bracket</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              Live eFootball Cup Tournament Tree
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <a href="/standings" className="btn-ghost" style={{ textDecoration: "none", marginRight: "12px" }}>
              View Standings
            </a>
            <a href="/admin" className="btn-ghost" style={{ textDecoration: "none" }}>
              Admin
            </a>
          </div>
        </div>

        <BracketClient
          tournaments={tournaments}
          initialMatches={initialMatches.map((m: Awaited<ReturnType<typeof getMatches>>[number]) => ({
            id: m.id,
            matchCode: m.matchCode,
            teamA: m.teamA ? { id: m.teamA.id, name: m.teamA.name } : null,
            teamB: m.teamB ? { id: m.teamB.id, name: m.teamB.name } : null,
            scoreA: m.scoreA,
            scoreB: m.scoreB,
            isSubmitted: m.isSubmitted,
            round: m.round
          }))}
          initialTournamentId={firstId}
        />
      </div>
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
