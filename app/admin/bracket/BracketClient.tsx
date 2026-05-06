"use client";

import { useState } from "react";
import BracketTree from "@/components/ui/BracketTree";
import { getRoundName } from "@/lib/bracket";

interface BracketMatch {
  id: string;
  matchCode: string;
  teamA: { id: string, name: string } | null;
  teamB: { id: string, name: string } | null;
  scoreA: number | null;
  scoreB: number | null;
  isSubmitted: boolean;
  round: number | null;
}

interface Tournament { id: string; name: string; type: string; }

interface BracketClientProps {
  tournaments: Tournament[];
  initialMatches: BracketMatch[];
  initialTournamentId: string | null;
}

function groupMatchesByRound(matches: BracketMatch[]) {
  const byRound = new Map<number, BracketMatch[]>();
  for (const m of matches) {
    const r = m.round ?? 0;
    if (!byRound.has(r)) byRound.set(r, []);
    byRound.get(r)!.push(m);
  }
  const rounds = Array.from(byRound.entries())
    .sort(([a], [b]) => a - b);

  const maxRound = Math.max(...rounds.map(([r]) => r), 0);

  return rounds.map(([roundNumber, roundMatches]) => ({
    roundNumber,
    label: getRoundName(roundNumber, maxRound),
    matches: roundMatches,
  }));
}

export default function BracketClient({ tournaments, initialMatches, initialTournamentId }: BracketClientProps) {
  const [selectedId, setSelectedId] = useState<string>(initialTournamentId ?? "");
  const [matches, setMatches] = useState<BracketMatch[]>(initialMatches);
  const [loading, setLoading] = useState(false);

  async function loadBracket(id: string) {
    if (!id) return;
    setLoading(true);
    setSelectedId(id);
    try {
      const res = await fetch(`/api/match?tournamentId=${id}`);
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  const cupTournaments = tournaments.filter((t) => t.type === "CUP");
  const rounds = groupMatchesByRound(matches);

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", alignItems: "center" }}>
        <select
          className="select-field"
          style={{ width: "300px" }}
          value={selectedId}
          onChange={(e) => loadBracket(e.target.value)}
        >
          <option value="">Select a cup tournament…</option>
          {cupTournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {loading && <span style={{ color: "#8892b0", fontSize: "13px" }}>Loading…</span>}
      </div>

      {cupTournaments.length === 0 ? (
        <div className="glass-card" style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔱</div>
          No cup tournaments. Create a CUP type tournament first.
        </div>
      ) : !selectedId ? (
        <div className="glass-card" style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
          Select a cup tournament to view the bracket.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: "24px", overflowX: "auto" }}>
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", color: "#e8eaf6" }}>
              Knockout Bracket
            </h2>
            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
              <span style={{ color: "#22c55e" }}>🟢 Winner</span>
              <span style={{ color: "#4a5568" }}>⬜ TBD</span>
            </div>
          </div>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
              <span className="animate-spin" style={{ display: "inline-block", fontSize: "24px" }}>⟳</span>
            </div>
          ) : (
            <BracketTree rounds={rounds} tournamentId={selectedId} />
          )}
        </div>
      )}
    </div>
  );
}
