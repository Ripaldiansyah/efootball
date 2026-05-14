"use client";

import { useState } from "react";

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

interface PreviewData {
  teamId: string;
  tournamentId: string;
  achievement: string;
  teamName: string;
}

export default function StandingsTable({ standings, tournamentId }: StandingsTableProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handlePreview = async (row: StandingRow, achievement: string) => {
    if (!tournamentId) return;
    setLoadingPreview(true);
    setPreview({ teamId: row.teamId, tournamentId, achievement, teamName: row.team.name });

    try {
      const res = await fetch(
        `/api/certificate/preview?teamId=${row.teamId}&tournamentId=${tournamentId}&achievement=${achievement}`
      );
      const html = await res.text();
      setPreviewHtml(html);
    } catch {
      setPreviewHtml("<p style='color:red'>Gagal load preview</p>");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    setDownloadingPdf(true);
    try {
      const res = await fetch(
        `/api/certificate?teamId=${preview.teamId}&tournamentId=${preview.tournamentId}&achievement=${preview.achievement}`
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${preview.teamName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (standings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#4a5568" }}>
        No standings data yet. Matches need to be submitted first.
      </div>
    );
  }

  const cols = ["#", "Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"];

  return (
    <>
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
              const totalTeams = standings.length;
              const achievement =
                i === 0 ? "Champion"
                : i === 1 ? "Runner Up"
                : i === 2 ? "3rd Place"
                : i >= totalTeams - 3 ? "Noob Player"
                : "Participant";
              const rankColor =
                i === 0 ? "var(--accent-orange)"
                : i === 1 ? "var(--text-secondary)"
                : i === 2 ? "#cd7f32"
                : "var(--text-muted)";
              const rowGlow = isTop
                ? `rgba(${i === 0 ? "245,158,11" : i === 1 ? "148,163,184" : "205,127,50"}, 0.05)`
                : "rgba(255,255,255,0.02)";

              return (
                <tr key={row.id} style={{ background: rowGlow }}>
                  <td style={{ textAlign: "center", width: "56px" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "32px", height: "32px", margin: "0 auto", borderRadius: "10px",
                      background: isTop ? `${rankColor}22` : "transparent",
                      border: isTop ? `1px solid ${rankColor}44` : "1px solid rgba(255,255,255,0.05)",
                      color: isTop ? rankColor : "var(--text-muted)",
                      fontWeight: 800, fontSize: "14px",
                      boxShadow: isTop ? `0 0 10px ${rankColor}22` : "none",
                    }}>
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
                          border: "1px solid rgba(59,130,246,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: "14px", color: "var(--accent-blue)",
                          textShadow: "0 0 10px rgba(59,130,246,0.5)",
                        }}>
                          {row.team.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "0.2px" }}>
                          {row.team.name}
                        </span>
                      </div>
                      {tournamentId && (
                        <button
                          onClick={() => handlePreview(row, achievement)}
                          className="btn-ghost"
                          style={{ fontSize: "11px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px", opacity: 0.8, cursor: "pointer", border: "none", background: "transparent" }}
                          title="Preview Certificate"
                        >
                          <span style={{ fontSize: "14px" }}>🎓</span>
                          <span style={{ fontWeight: 600 }}>CERT</span>
                        </button>
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
                      display: "inline-block", padding: "2px 8px", borderRadius: "6px",
                      background: gd > 0 ? "rgba(16,185,129,0.1)" : gd < 0 ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
                      color: gd > 0 ? "var(--accent-green)" : gd < 0 ? "var(--accent-red)" : "var(--text-secondary)",
                      fontWeight: 700, fontSize: "13px"
                    }}>
                      {gd > 0 ? `+${gd}` : gd}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "18px", fontWeight: 800,
                      color: i === 0 ? "var(--accent-orange)" : "var(--text-primary)",
                      textShadow: i === 0 ? "0 0 10px rgba(245,158,11,0.4)" : "none",
                    }}>
                      {row.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Preview */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Header modal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" }}>
                  Preview Sertifikat
                </p>
                <p style={{ fontWeight: 700, fontSize: "16px" }}>{preview.teamName} — {preview.achievement}</p>
              </div>
              <button
                onClick={() => setPreview(null)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "24px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Preview area */}
            <div style={{ width: "100%", aspectRatio: "1123/794", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              {loadingPreview ? (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a1a", color: "var(--text-muted)" }}>
                  Loading preview...
                </div>
              ) : (
                <iframe
                  srcDoc={previewHtml}
                  style={{ width: "100%", height: "100%", border: "none", transform: "scale(1)", transformOrigin: "top left" }}
                  title="Certificate Preview"
                />
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setPreview(null)}
                className="btn-ghost"
                style={{ padding: "10px 20px", cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                onClick={handleDownload}
                disabled={downloadingPdf}
                className="btn-primary"
                style={{ padding: "10px 24px", cursor: downloadingPdf ? "wait" : "pointer", opacity: downloadingPdf ? 0.7 : 1, display: "flex", alignItems: "center", gap: "8px" }}
              >
                {downloadingPdf ? "Generating PDF..." : "⬇ Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
