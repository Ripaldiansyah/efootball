export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [teams, tournaments, matches, pending] = await Promise.all([
    prisma.team.count(),
    prisma.tournament.count(),
    prisma.match.count(),
    prisma.match.count({ where: { isSubmitted: false } }),
  ]);
  return { teams, tournaments, matches, pending };
}

async function getRecentMatches() {
  return prisma.match.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { teamA: true, teamB: true, tournament: true },
  });
}

export default async function AdminDashboard() {
  const [stats, recentMatches] = await Promise.all([getStats(), getRecentMatches()]);

  const statCards = [
    { label: "Total Teams", value: stats.teams, icon: "👥", color: "#4f9eff", bg: "rgba(79,158,255,0.1)", border: "rgba(79,158,255,0.25)" },
    { label: "Tournaments", value: stats.tournaments, icon: "🏆", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
    { label: "Total Matches", value: stats.matches, icon: "⚽", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.25)" },
    { label: "Pending Matches", value: stats.pending, icon: "⏳", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  ];

  const quickLinks = [
    { href: "/admin/tournaments", label: "New Tournament", icon: "🏆", desc: "Create league or cup" },
    { href: "/admin/teams", label: "Add Team", icon: "👥", desc: "Register a new team" },
    { href: "/admin/matches", label: "View Matches", icon: "⚽", desc: "See all match codes" },
    { href: "/admin/standings", label: "Standings", icon: "📊", desc: "League table" },
  ];

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #4f9eff, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", boxShadow: "0 4px 20px rgba(79,158,255,0.3)",
            }}
          >
            ⚡
          </div>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "2px" }}>
              eFootball Tournament Control Center
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className="stat-card animate-fade-in-up"
            style={{ borderColor: card.border }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div
                style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: card.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px",
                }}
              >
                {card.icon}
              </div>
              <div
                style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: card.color, boxShadow: `0 0 8px ${card.color}`,
                }}
              />
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, color: card.color, lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", fontWeight: 500 }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", marginBottom: "16px", color: "#e8eaf6" }}>
            Quick Actions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="quick-link-card"
              >
                <span style={{ fontSize: "22px" }}>{link.icon}</span>
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#e8eaf6" }}>{link.label}</span>
                <span style={{ fontSize: "11px", color: "#4a5568" }}>{link.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", marginBottom: "16px", color: "#e8eaf6" }}>
            Recent Matches
          </h2>
          {recentMatches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px", color: "#4a5568" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚽</div>
              No matches yet. Generate matches from a tournament.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentMatches.map((match: Awaited<ReturnType<typeof getRecentMatches>>[number]) => (
                <div
                  key={match.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(99,120,180,0.1)",
                  }}
                >
                  <div style={{ flex: 1, fontSize: "13px" }}>
                    <span style={{ fontWeight: 500, color: "#e8eaf6" }}>{match.teamA.name}</span>
                    <span style={{ color: "#4a5568", margin: "0 8px" }}>vs</span>
                    <span style={{ fontWeight: 500, color: "#e8eaf6" }}>{match.teamB.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {match.isSubmitted ? (
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "#22c55e" }}>
                        {match.scoreA} – {match.scoreB}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "monospace", fontSize: "11px", color: "#4f9eff",
                          background: "rgba(79,158,255,0.1)", padding: "2px 8px", borderRadius: "4px",
                        }}
                      >
                        {match.matchCode}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
