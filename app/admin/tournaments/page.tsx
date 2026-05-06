export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import TournamentsClient from "./TournamentsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tournaments" };

export default async function TournamentsPage() {
  const [tournaments, teams] = await Promise.all([
    prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { matches: true } } },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className="page-title">Tournaments</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Create and manage League or Cup tournaments.
        </p>
      </div>
      <TournamentsClient tournaments={tournaments} teams={teams} />
    </div>
  );
}
