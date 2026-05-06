export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import MatchesClient from "./MatchesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Matches" };

export default async function MatchesPage() {
  const [matches, tournaments] = await Promise.all([
    prisma.match.findMany({
      orderBy: [{ round: "asc" }, { createdAt: "asc" }],
      include: { teamA: true, teamB: true, tournament: true },
    }),
    prisma.tournament.findMany({ orderBy: { name: "asc" } }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className="page-title">Matches</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          View all matches, share QR codes, and track submission status.
        </p>
      </div>
      <MatchesClient
        matches={matches}
        tournaments={tournaments}
        appUrl={appUrl}
      />
    </div>
  );
}
