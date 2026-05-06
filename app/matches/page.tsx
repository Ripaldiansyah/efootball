import { prisma } from "@/lib/prisma";
import MatchesClient from "@/app/admin/matches/MatchesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Public Matches" };
export const dynamic = "force-dynamic";

export default async function PublicMatchesPage() {
  const [matches, tournaments] = await Promise.all([
    prisma.match.findMany({
      orderBy: [{ round: "asc" }, { createdAt: "asc" }],
      include: { teamA: true, teamB: true, tournament: true },
    }),
    prisma.tournament.findMany({ orderBy: { name: "asc" } }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
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
            ⚔️
          </div>
          <div>
            <h1 className="page-title">Match Results</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              Live Match Results and Submissions
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/standings" className="btn-ghost" style={{ textDecoration: "none" }}>
              Standings
            </a>
            <a href="/bracket" className="btn-ghost" style={{ textDecoration: "none" }}>
              Bracket
            </a>
            <a href="/admin" className="btn-ghost" style={{ textDecoration: "none" }}>
              Admin
            </a>
          </div>
        </div>

        <MatchesClient
          matches={matches}
          tournaments={tournaments}
          appUrl={appUrl}
        />
      </div>
    </div>
  );
}
