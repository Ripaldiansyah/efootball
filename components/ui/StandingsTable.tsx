interface StandingRow {
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

interface StandingsTableProps {
  standings: StandingRow[];
  tournamentId?: string;
}

export default function StandingsTable({ standings, tournamentId }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#4a5568" }}>
        No standings data yet. Matches need to be submitted first.
      </div>
    );
  }

  const cols = ["#", "Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"];

  return (
    <div style={{ overflowX: "auto" }} className="animate-fade-in-up">
      <table className="data-table" style={{ borderSpacing: "0 12px" }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} style={{ textAlign: c === "Team" ? "left" : "center", paddingBottom: "8px" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const gd = row.goalsFor - row.goalsAgainst;
            const isTop = i < 3;
            const rankColor =
              i === 0 ? "var(--accent-orange)" : i === 1 ? "var(--text-secondary)" : i === 2 ? "#cd7f32" : "var(--text-muted)";
            const rowGlow = isTop ? `rgba(${i===0?'245,158,11':i===1?'148,163,184':'205,127,50'}, 0.05)` : "rgba(255,255,255,0.02)";

            return (
              <tr key={row.id} style={{ background: rowGlow }}>
                <td style={{ textAlign: "center", width: "56px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      margin: "0 auto",
                      borderRadius: "10px",
                      background: isTop ? `${rankColor}22` : "transparent",
                      border: isTop ? `1px solid ${rankColor}44` : "1px solid rgba(255,255,255,0.05)",
                      color: isTop ? rankColor : "var(--text-muted)",
                      fontWeight: 800,
                      fontSize: "14px",
                      boxShadow: isTop ? `0 0 10px ${rankColor}22` : "none",
                    }}
                  >
                    {i + 1}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
                          border: "1px solid rgba(59,130,246,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "14px",
                          color: "var(--accent-blue)",
                          textShadow: "0 0 10px rgba(59,130,246,0.5)",
                        }}
                      >
                        {row.team.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "0.2px" }}>{row.team.name}</span>
                    </div>
                    {tournamentId && (
                      <a
                        href={`/api/certificate?teamId=${row.teamId}&tournamentId=${tournamentId}&achievement=${i === 0 ? "Champion" : i === 1 ? "Runner Up" : i === 2 ? "3rd Place" : "Participant"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ fontSize: "11px", padding: "6px 10px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 }}
                        title="Download Certificate"
                      >
                        <span style={{ fontSize: "14px" }}>🎓</span> <span style={{ fontWeight: 600 }}>CERT</span>
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: "center", color: "var(--text-secondary)", fontWeight: 500 }}>{row.played}</td>
                <td style={{ textAlign: "center", color: "var(--accent-green)", fontWeight: 700 }}>{row.win}</td>
                <td style={{ textAlign: "center", color: "var(--accent-orange)", fontWeight: 700 }}>{row.draw}</td>
                <td style={{ textAlign: "center", color: "var(--accent-red)", fontWeight: 700 }}>{row.lose}</td>
                <td style={{ textAlign: "center", fontWeight: 500 }}>{row.goalsFor}</td>
                <td style={{ textAlign: "center", fontWeight: 500 }}>{row.goalsAgainst}</td>
                <td style={{ textAlign: "center" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: gd > 0 ? "rgba(16,185,129,0.1)" : gd < 0 ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
                    color: gd > 0 ? "var(--accent-green)" : gd < 0 ? "var(--accent-red)" : "var(--text-secondary)",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}>
                    {gd > 0 ? `+${gd}` : gd}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "18px",
                      fontWeight: 800,
                      color: i === 0 ? "var(--accent-orange)" : "var(--text-primary)",
                      textShadow: i === 0 ? "0 0 10px rgba(245,158,11,0.4)" : "none",
                    }}
                  >
                    {row.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
