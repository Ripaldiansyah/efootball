"use client";

import { useState, useTransition } from "react";
import { submitScore } from "@/lib/actions/submitScore";
import QRCodeDisplay from "@/components/ui/QRCode";

interface Team { name: string; }
interface Tournament { name: string; type: string; }
interface Match {
  id: string;
  matchCode: string;
  teamA: Team;
  teamB: Team;
  scoreA: number | null;
  scoreB: number | null;
  isSubmitted: boolean;
  round: number | null;
  tournament: Tournament;
}

interface SubmitFormProps {
  match: Match;
  appUrl: string;
}

export default function SubmitForm({ match, appUrl }: SubmitFormProps) {
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [submitted, setSubmitted] = useState(match.isSubmitted);
  const [finalScore, setFinalScore] = useState(
    match.isSubmitted ? { a: match.scoreA!, b: match.scoreB! } : null
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scoreA || !scoreB) return;
    setError("");

    const formData = new FormData();
    formData.append("matchCode", match.matchCode);
    formData.append("scoreA", scoreA);
    formData.append("scoreB", scoreB);

    startTransition(async () => {
      const res = await submitScore(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
        setFinalScore({ a: Number(scoreA), b: Number(scoreB) });
      }
    });
  }

  const matchUrl = `${appUrl}/match/${match.matchCode}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #080b14 50%, #0a0a14 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,158,255,0.06) 0%, transparent 70%)", top: "-200px", right: "-100px" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)", bottom: "-100px", left: "-100px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "480px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>⚽</div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #4f9eff, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            eFootball Match
          </div>
          <div style={{ fontSize: "13px", color: "#4a5568", marginTop: "4px" }}>
            {match.tournament.name}
          </div>
        </div>

        {/* Match Card */}
        <div
          style={{
            background: "rgba(15, 21, 35, 0.8)",
            border: "1px solid rgba(99,120,180,0.15)",
            borderRadius: "20px",
            backdropFilter: "blur(20px)",
            padding: "32px",
            marginBottom: "16px",
          }}
        >
          {/* Match code */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", color: "#4a5568", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
              Match Code
            </div>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "22px",
                fontWeight: 700,
                color: "#4f9eff",
                background: "rgba(79,158,255,0.1)",
                padding: "8px 20px",
                borderRadius: "10px",
                letterSpacing: "0.1em",
              }}
            >
              {match.matchCode}
            </span>
            {match.round && (
              <div style={{ fontSize: "12px", color: "#8892b0", marginTop: "8px" }}>
                Round {match.round}
              </div>
            )}
          </div>

          {/* Teams vs display */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  width: "56px", height: "56px", borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(79,158,255,0.2), rgba(79,158,255,0.05))",
                  border: "1px solid rgba(79,158,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "20px", color: "#4f9eff",
                  margin: "0 auto 10px",
                }}
              >
                {match.teamA.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: "#e8eaf6" }}>
                {match.teamA.name}
              </div>
            </div>
            <div style={{ color: "#4a5568", fontSize: "18px", fontWeight: 300 }}>vs</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  width: "56px", height: "56px", borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))",
                  border: "1px solid rgba(168,85,247,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "20px", color: "#a855f7",
                  margin: "0 auto 10px",
                }}
              >
                {match.teamB.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: "#e8eaf6" }}>
                {match.teamB.name}
              </div>
            </div>
          </div>

          {/* Submitted state */}
          {submitted && finalScore ? (
            <div>
              <div
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: "14px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "#22c55e", marginBottom: "16px" }}>
                  Score Submitted!
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "48px", fontWeight: 700, color: finalScore.a > finalScore.b ? "#22c55e" : "#8892b0" }}>
                    {finalScore.a}
                  </span>
                  <span style={{ color: "#4a5568", fontSize: "24px" }}>–</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "48px", fontWeight: 700, color: finalScore.b > finalScore.a ? "#22c55e" : "#8892b0" }}>
                    {finalScore.b}
                  </span>
                </div>
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#8892b0" }}>
                  {finalScore.a > finalScore.b
                    ? `🏆 ${match.teamA.name} wins!`
                    : finalScore.b > finalScore.a
                    ? `🏆 ${match.teamB.name} wins!`
                    : "🤝 Draw!"}
                </div>
              </div>
            </div>
          ) : (
            /* Score Input Form */
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#4a5568", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", textAlign: "center" }}>
                    {match.teamA.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={scoreA}
                    onChange={(e) => setScoreA(e.target.value)}
                    className="input-field"
                    placeholder="0"
                    required
                    style={{ textAlign: "center", fontSize: "32px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", padding: "16px" }}
                  />
                </div>
                <div style={{ color: "#4a5568", fontSize: "22px", marginTop: "20px", userSelect: "none" }}>–</div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#4a5568", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", textAlign: "center" }}>
                    {match.teamB.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={scoreB}
                    onChange={(e) => setScoreB(e.target.value)}
                    className="input-field"
                    placeholder="0"
                    required
                    style={{ textAlign: "center", fontSize: "32px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", padding: "16px" }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isPending || !scoreA || !scoreB}
                style={{ width: "100%", padding: "14px", fontSize: "15px", justifyContent: "center" }}
              >
                {isPending ? (
                  <span>⟳ Submitting...</span>
                ) : (
                  "✓ Submit Score"
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "#4a5568" }}>
                Score can only be submitted once. Double-check before submitting.
              </div>
            </form>
          )}
        </div>

        {/* QR Code */}
        <div
          style={{
            background: "rgba(15,21,35,0.6)",
            border: "1px solid rgba(99,120,180,0.1)",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "12px", color: "#4a5568", marginBottom: "12px" }}>
            Share this match
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <QRCodeDisplay value={matchUrl} size={120} />
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#4a5568", wordBreak: "break-all" }}>
            {matchUrl}
          </div>
        </div>
      </div>
    </div>
  );
}
