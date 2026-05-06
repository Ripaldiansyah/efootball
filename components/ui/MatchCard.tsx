import Badge from "./Badge";

interface MatchCardProps {
  matchCode: string;
  teamA: string;
  teamB: string;
  scoreA?: number | null;
  scoreB?: number | null;
  isSubmitted: boolean;
  round?: number | null;
  tournamentName?: string;
  compact?: boolean;
}

export default function MatchCard({
  matchCode,
  teamA,
  teamB,
  scoreA,
  scoreB,
  isSubmitted,
  round,
  tournamentName,
  compact,
}: MatchCardProps) {
  return (
    <div
      style={{
        background: "rgba(15, 21, 35, 0.7)",
        border: "1px solid rgba(99,120,180,0.12)",
        borderRadius: "14px",
        padding: compact ? "14px 18px" : "20px 24px",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(79,158,255,0.3)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,120,180,0.12)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "#4f9eff",
              background: "rgba(79,158,255,0.1)",
              padding: "3px 10px",
              borderRadius: "6px",
              letterSpacing: "0.05em",
            }}
          >
            {matchCode}
          </span>
          {round && (
            <span style={{ fontSize: "11px", color: "#8892b0" }}>
              R{round}
            </span>
          )}
        </div>
        <Badge variant={isSubmitted ? "green" : "amber"}>
          {isSubmitted ? "✓ Done" : "⏳ Pending"}
        </Badge>
      </div>

      {/* Score Display */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
        {/* Team A */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontWeight: 600, fontSize: "15px", color: "#e8eaf6", marginBottom: "2px" }}>
            {teamA}
          </div>
          {tournamentName && !compact && (
            <div style={{ fontSize: "11px", color: "#4a5568" }}>{tournamentName}</div>
          )}
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minWidth: "90px",
            justifyContent: "center",
          }}
        >
          {isSubmitted ? (
            <>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: scoreA! > scoreB! ? "#22c55e" : scoreA === scoreB ? "#8892b0" : "#ef4444",
                  minWidth: "30px",
                  textAlign: "center",
                }}
              >
                {scoreA}
              </span>
              <span style={{ color: "#4a5568", fontSize: "20px", fontWeight: 300 }}>–</span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: scoreB! > scoreA! ? "#22c55e" : scoreA === scoreB ? "#8892b0" : "#ef4444",
                  minWidth: "30px",
                  textAlign: "center",
                }}
              >
                {scoreB}
              </span>
            </>
          ) : (
            <span style={{ color: "#4a5568", fontSize: "22px", letterSpacing: "4px" }}>– –</span>
          )}
        </div>

        {/* Team B */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 600, fontSize: "15px", color: "#e8eaf6", marginBottom: "2px" }}>
            {teamB}
          </div>
        </div>
      </div>
    </div>
  );
}
