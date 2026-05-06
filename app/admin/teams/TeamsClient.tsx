"use client";

import { useState, useTransition } from "react";
import { createTeam, deleteTeam } from "@/lib/actions/createTeam";

interface Team {
  id: string;
  name: string;
  createdAt: Date;
}

interface TeamsClientProps {
  teams: Team[];
}

export default function TeamsClient({ teams: initialTeams }: TeamsClientProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCreate(formData: FormData) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await createTeam(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.team) {
        setSuccess(`Team "${res.team.name}" created!`);
        setTeams((prev) => [...prev, res.team as Team]);
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete team "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteTeam(id);
      if (res.error) {
        setError(res.error);
      } else {
        setTeams((prev) => prev.filter((t) => t.id !== id));
      }
    });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
      {/* Add Team Form */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            color: "#e8eaf6",
            marginBottom: "20px",
          }}
        >
          Add New Team
        </h2>

        <form action={handleCreate}>
          <div style={{ marginBottom: "16px" }}>
            <label className="section-label" style={{ display: "block", marginBottom: "8px" }}>
              Team Name
            </label>
            <input
              name="name"
              className="input-field"
              placeholder="e.g. FC Barcelona"
              required
              minLength={2}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#22c55e",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {success}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isPending} style={{ width: "100%" }}>
            {isPending ? (
              <span className="animate-spin" style={{ display: "inline-block" }}>⟳</span>
            ) : (
              "+"
            )}
            {isPending ? "Creating..." : "Add Team"}
          </button>
        </form>
      </div>

      {/* Teams List */}
      <div className="glass-card">
        <div style={{ padding: "20px 24px 0", marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", color: "#e8eaf6" }}>
            All Teams
          </h2>
          <span className="badge badge-blue">{teams.length} teams</span>
        </div>

        {teams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#4a5568" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
            <div>No teams yet. Add your first team!</div>
          </div>
        ) : (
          <table className="data-table" style={{ marginTop: "8px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Team Name</th>
                <th>Created</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id}>
                  <td style={{ color: "#4a5568", width: "48px" }}>{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "34px", height: "34px", borderRadius: "10px",
                          background: "linear-gradient(135deg, #4f9eff22, #a855f722)",
                          border: "1px solid rgba(79,158,255,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "13px", color: "#4f9eff",
                        }}
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: "14px" }}>{team.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "#4a5568", fontSize: "13px" }}>
                    {new Date(team.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(team.id, team.name)}
                      disabled={isPending}
                      style={{ padding: "6px 14px", fontSize: "12px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
