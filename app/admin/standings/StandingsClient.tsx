"use client";

import { useState } from "react";
import StandingsTable from "@/components/ui/StandingsTable";

interface Standing {
  id: string;
  teamId: string;
  team: { name: string };
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface Tournament { id: string; name: string; type: string; }

interface StandingsClientProps {
  tournaments: Tournament[];
  initialStandings: Standing[];
  initialTournamentId: string | null;
}

export default function StandingsClient({ tournaments, initialStandings, initialTournamentId }: StandingsClientProps) {
  const [selectedId, setSelectedId] = useState<string>(initialTournamentId ?? "");
  const [standings, setStandings] = useState<Standing[]>(initialStandings);
  const [loading, setLoading] = useState(false);

  async function loadStandings(id: string) {
    if (!id) return;
    setLoading(true);
    setSelectedId(id);
    try {
      const res = await fetch(`/api/standings?tournamentId=${id}`);
      const data = await res.json();
      setStandings(Array.isArray(data) ? data : []);
    } catch {
      setStandings([]);
    } finally {
      setLoading(false);
    }
  }

  const leagueTournaments = tournaments.filter((t) => t.type === "LEAGUE");

  return (
    <div>
      {/* Tournament Selector */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center" }}>
        <select
          className="select-field"
          style={{ width: "300px" }}
          value={selectedId}
          onChange={(e) => loadStandings(e.target.value)}
        >
          <option value="">Select a league tournament…</option>
          {leagueTournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {loading && (
          <span style={{ color: "#8892b0", fontSize: "13px" }}>Loading…</span>
        )}
      </div>

      {leagueTournaments.length === 0 ? (
        <div className="glass-card" style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
          No league tournaments. Create a LEAGUE type tournament first.
        </div>
      ) : !selectedId ? (
        <div className="glass-card" style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
          Select a tournament above to view standings.
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 0", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", color: "#e8eaf6" }}>
              League Table
            </h2>
            <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#4a5568" }}>
              <span>🟢 Win = 3pts</span>
              <span>🟡 Draw = 1pt</span>
              <span>🔴 Loss = 0pts</span>
            </div>
          </div>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
              <span className="animate-spin" style={{ display: "inline-block", fontSize: "24px" }}>⟳</span>
            </div>
          ) : (
            <StandingsTable standings={standings} tournamentId={selectedId} />
          )}
        </div>
      )}
    </div>
  );
}
