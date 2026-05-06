export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import TeamsClient from "./TeamsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className="page-title">Teams</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Manage all registered teams for tournaments.
        </p>
      </div>
      <TeamsClient teams={teams} />
    </div>
  );
}
