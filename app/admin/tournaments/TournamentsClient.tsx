"use client";

import { useState, useTransition } from "react";
import { createTournament, deleteTournament } from "@/lib/actions/createTournament";
import { generateMatches } from "@/lib/actions/generateMatches";
import Badge from "@/components/ui/Badge";

interface Team { id: string; name: string; }
interface Tournament {
  id: string; name: string; type: "LEAGUE" | "CUP";
  createdAt: Date;
  _count?: { matches: number };
}

interface TournamentsClientProps {
  tournaments: Tournament[];
  teams: Team[];
}

export default function TournamentsClient({ tournaments: initialTournaments, teams }: TournamentsClientProps) {
  const [tournaments, setTournaments] = useState(initialTournaments);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string[]>>({});

  async function handleCreate(formData: FormData) {
    setError(""); setSuccess("");
    startTransition(async () => {
      const res = await createTournament(formData);
      if (res.error) { setError(res.error); }
      else if (res.tournament) {
        setSuccess(`Tournament "${res.tournament.name}" created!`);
        setTournaments((prev) => [{ ...res.tournament!, _count: { matches: 0 } }, ...prev]);
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete tournament "${name}" and all its matches?`)) return;
    startTransition(async () => {
      const res = await deleteTournament(id);
      if (res.error) setError(res.error);
      else setTournaments((prev) => prev.filter((t) => t.id !== id));
    });
  }

  async function handleGenerate(tournamentId: string) {
    const teams = selectedTeams[tournamentId] ?? [];
    if (teams.length < 2) { setError("Select at least 2 teams"); return; }
    setError(""); setSuccess("");
    const formData = new FormData();
    formData.append("tournamentId", tournamentId);
    teams.forEach((id) => formData.append("teamIds", id));
    startTransition(async () => {
      const res = await generateMatches(formData);
      if (res.error) setError(res.error);
      else { setSuccess("Matches generated!"); setExpandedId(null); }
    });
  }

  function toggleTeam(tournamentId: string, teamId: string) {
    setSelectedTeams((prev) => {
      const curr = prev[tournamentId] ?? [];
      return {
        ...prev,
        [tournamentId]: curr.includes(teamId)
          ? curr.filter((id) => id !== teamId)
          : [...curr, teamId],
      };
    });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
      {/* Create Form */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", color: "#e8eaf6", marginBottom: "20px" }}>
          Create Tournament
        </h2>
        <form action={handleCreate}>
          <div style={{ marginBottom: "16px" }}>
            <label className="section-label" style={{ display: "block", marginBottom: "8px" }}>Tournament Name</label>
            <input name="name" className="input-field" placeholder="e.g. eFootball Cup 2025" required minLength={2} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label className="section-label" style={{ display: "block", marginBottom: "8px" }}>Type</label>
            <select name="type" className="select-field" required>
              <option value="LEAGUE">🏅 League</option>
              <option value="CUP">🏆 Cup (Knockout)</option>
            </select>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#22c55e", fontSize: "13px", marginBottom: "12px" }}>
              {success}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isPending} style={{ width: "100%" }}>
            {isPending ? "Creating..." : "+ Create Tournament"}
          </button>
        </form>
      </div>

      {/* Tournament List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tournaments.length === 0 ? (
          <div className="glass-card" style={{ padding: "48px", textAlign: "center", color: "#4a5568" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏆</div>
            No tournaments yet.
          </div>
        ) : (
          tournaments.map((t) => (
            <div key={t.id} className="glass-card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: expandedId === t.id ? "20px" : "0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: t.type === "CUP" ? "rgba(245,158,11,0.15)" : "rgba(79,158,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
                  }}>
                    {t.type === "CUP" ? "🏆" : "🏅"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "15px", color: "#e8eaf6" }}>{t.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                      <Badge variant={t.type === "CUP" ? "amber" : "blue"}>{t.type}</Badge>
                      <span style={{ fontSize: "12px", color: "#4a5568" }}>
                        {t._count?.matches ?? 0} matches
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-ghost"
                    onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  >
                    {expandedId === t.id ? "↑ Close" : "⚙ Generate Matches"}
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(t.id, t.name)}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Team selector */}
              {expandedId === t.id && (
                <div style={{ borderTop: "1px solid rgba(99,120,180,0.1)", paddingTop: "20px" }}>
                  <div className="section-label" style={{ marginBottom: "12px" }}>
                    Select Teams ({(selectedTeams[t.id] ?? []).length} selected)
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                    {teams.map((team) => {
                      const sel = (selectedTeams[t.id] ?? []).includes(team.id);
                      return (
                        <button
                          key={team.id}
                          onClick={() => toggleTeam(t.id, team.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: `1px solid ${sel ? "rgba(79,158,255,0.5)" : "rgba(99,120,180,0.15)"}`,
                            background: sel ? "rgba(79,158,255,0.12)" : "rgba(255,255,255,0.02)",
                            color: sel ? "#4f9eff" : "#8892b0",
                            fontSize: "13px",
                            fontWeight: sel ? 600 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            textAlign: "left",
                          }}
                        >
                          {sel ? "✓ " : ""}{team.name}
                        </button>
                      );
                    })}
                  </div>
                  {teams.length === 0 && (
                    <div style={{ color: "#4a5568", fontSize: "13px", marginBottom: "12px" }}>
                      No teams found. Add teams first.
                    </div>
                  )}
                  <button
                    className="btn-primary"
                    onClick={() => handleGenerate(t.id)}
                    disabled={isPending || (selectedTeams[t.id] ?? []).length < 2}
                  >
                    {isPending ? "Generating..." : "⚡ Generate Matches"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
