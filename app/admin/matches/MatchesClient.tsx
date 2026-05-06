"use client";

import { useState } from "react";
import MatchCard from "@/components/ui/MatchCard";
import QRCodeDisplay from "@/components/ui/QRCode";
import Badge from "@/components/ui/Badge";

interface Match {
  id: string;
  matchCode: string;
  teamA: { name: string };
  teamB: { name: string };
  scoreA: number | null;
  scoreB: number | null;
  isSubmitted: boolean;
  round: number | null;
  tournament: { id: string; name: string; type: string };
}

interface Tournament { id: string; name: string; type: string; }

interface MatchesClientProps {
  matches: Match[];
  tournaments: Tournament[];
  appUrl: string;
}

export default function MatchesClient({ matches, tournaments, appUrl }: MatchesClientProps) {
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [qrMatch, setQrMatch] = useState<Match | null>(null);

  const filtered = matches.filter((m) => {
    const tMatch = filter === "all" || m.tournament.id === filter;
    const sMatch =
      statusFilter === "all" ||
      (statusFilter === "pending" && !m.isSubmitted) ||
      (statusFilter === "done" && m.isSubmitted);
      
    // Exclude TBD vs TBD matches completely, or matches that involve only TBD if needed.
    // We'll show TBD matches if it's Team vs TBD (Bye). But we hide Placeholder vs Placeholder.
    const isPlaceholder = m.teamA?.name === "TBD" && m.teamB?.name === "TBD";
    
    // Search query
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || m.teamA?.name.toLowerCase().includes(q) || m.teamB?.name.toLowerCase().includes(q) || m.matchCode.toLowerCase().includes(q);

    return tMatch && sMatch && !isPlaceholder && searchMatch;
  });

  return (
    <div className="animate-fade-in-up">
      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search team or match code..."
          className="input-field"
          style={{ width: "260px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select-field"
          style={{ width: "220px" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tournaments</option>
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "pending", "done"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? "btn-primary" : "btn-ghost"}
              style={{ padding: "8px 18px", fontSize: "13px", height: "42px" }}
            >
              {s === "all" ? "All" : s === "pending" ? "⏳ Pending" : "✓ Done"}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge variant="blue">{filtered.length} matches</Badge>
        </div>
      </div>

      {/* Match List */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚽</div>
          No matches found.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "16px" }}>
          {filtered.map((match) => (
            <div key={match.id} style={{ position: "relative" }}>
              <MatchCard
                matchCode={match.matchCode}
                teamA={match.teamA.name}
                teamB={match.teamB.name}
                scoreA={match.scoreA}
                scoreB={match.scoreB}
                isSubmitted={match.isSubmitted}
                round={match.round}
                tournamentName={match.tournament.name}
              />
              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", justifyContent: "flex-end" }}>
                <a
                  href={`/match/${match.matchCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ padding: "5px 12px", fontSize: "12px", textDecoration: "none" }}
                >
                  🔗 Public Link
                </a>
                <button
                  className="btn-ghost"
                  style={{ padding: "5px 12px", fontSize: "12px" }}
                  onClick={() => setQrMatch(qrMatch?.id === match.id ? null : match)}
                >
                  📱 QR Code
                </button>
              </div>
              {qrMatch?.id === match.id && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "16px",
                    background: "rgba(15,21,35,0.9)",
                    border: "1px solid rgba(99,120,180,0.15)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#8892b0" }}>
                    Scan to submit score for <strong style={{ color: "#e8eaf6" }}>{match.matchCode}</strong>
                  </div>
                  <QRCodeDisplay value={`${appUrl}/match/${match.matchCode}`} size={160} />
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#4a5568" }}>
                    {appUrl}/match/{match.matchCode}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QR Modal backdrop */}
    </div>
  );
}
