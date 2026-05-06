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

interface BracketRound {
  roundNumber: number;
  label: string;
  matches: BracketMatch[];
}

interface BracketTreeProps {
  rounds: BracketRound[];
  tournamentId?: string;
}

function BracketMatchBox({ match, tournamentId }: { match: BracketMatch, tournamentId?: string }) {
  const winnerA = match.isSubmitted && match.scoreA !== null && match.scoreB !== null && match.scoreA > match.scoreB;
  const winnerB = match.isSubmitted && match.scoreA !== null && match.scoreB !== null && match.scoreB > match.scoreA;

  return (
    <div
      style={{
        background: "rgba(15, 21, 35, 0.8)",
        border: "1px solid rgba(59,130,246,0.15)",
        borderRadius: "12px",
        overflow: "hidden",
        width: "220px",
        fontSize: "13px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      className="animate-fade-in-up"
    >
      {/* Team A */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: winnerA ? "linear-gradient(90deg, rgba(34,197,94,0.1), transparent)" : "transparent",
        }}
      >
        <span
          style={{
            fontWeight: winnerA ? 800 : 500,
            color: winnerA ? "var(--accent-green)" : match.teamA ? "var(--text-primary)" : "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "120px",
          }}
        >
          {match.teamA?.name ?? "TBD"}
        </span>
        {match.isSubmitted && (
          <span
            style={{
              fontWeight: 800,
              fontSize: "15px",
              color: winnerA ? "var(--accent-green)" : "var(--text-muted)",
              minWidth: "20px",
              textAlign: "right",
              textShadow: winnerA ? "0 0 10px rgba(34,197,94,0.4)" : "none",
            }}
          >
            {match.scoreA}
          </span>
        )}
        {tournamentId && match.teamA && (
          <a
            href={`/api/certificate?teamId=${match.teamA.id || 'unknown'}&tournamentId=${tournamentId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Download Certificate"
            style={{ textDecoration: "none", fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", marginLeft: "6px" }}
          >
            🎓 Cert
          </a>
        )}
      </div>
      {/* Team B */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: winnerB ? "linear-gradient(90deg, rgba(34,197,94,0.1), transparent)" : "transparent",
        }}
      >
        <span
          style={{
            fontWeight: winnerB ? 800 : 500,
            color: winnerB ? "var(--accent-green)" : match.teamB ? "var(--text-primary)" : "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "120px",
          }}
        >
          {match.teamB?.name ?? "TBD"}
        </span>
        {match.isSubmitted && (
          <span
            style={{
              fontWeight: 800,
              fontSize: "15px",
              color: winnerB ? "var(--accent-green)" : "var(--text-muted)",
              minWidth: "20px",
              textAlign: "right",
              textShadow: winnerB ? "0 0 10px rgba(34,197,94,0.4)" : "none",
            }}
          >
            {match.scoreB}
          </span>
        )}
        {tournamentId && match.teamB && (
          <a
            href={`/api/certificate?teamId=${match.teamB.id || 'unknown'}&tournamentId=${tournamentId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Download Certificate"
            style={{ textDecoration: "none", fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", marginLeft: "6px" }}
          >
            🎓 Cert
          </a>
        )}
      </div>
      {/* Code */}
      <div
        style={{
          padding: "6px 14px",
          background: "rgba(0,0,0,0.4)",
          fontSize: "11px",
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          fontFamily: "monospace",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {match.matchCode}
      </div>
    </div>
  );
}

export default function BracketTree({ rounds, tournamentId }: BracketTreeProps) {
  if (rounds.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#4a5568" }}>
        No bracket data yet.
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: "auto",
        overflowY: "visible",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0",
          alignItems: "stretch",
          minWidth: "fit-content",
        }}
      >
        {rounds.map((round, rIdx) => {
          const isLast = rIdx === rounds.length - 1;
          const prevMatchCount = rIdx === 0 ? round.matches.length * 2 : rounds[rIdx - 1].matches.length;
          const itemSpacing = rIdx === 0 ? 24 : prevMatchCount > round.matches.length ? 48 : 24;

          return (
            <div key={round.roundNumber} style={{ display: "flex" }}>
              {/* Column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Round label */}
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#4f9eff",
                    padding: "6px 20px",
                    marginBottom: "16px",
                    background: "rgba(79,158,255,0.08)",
                    borderRadius: "20px",
                    border: "1px solid rgba(79,158,255,0.2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {round.label}
                </div>

                {/* Matches */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${itemSpacing}px`,
                    justifyContent: "space-around",
                    flex: 1,
                  }}
                >
                  {round.matches.map((match) => (
                    <BracketMatchBox key={match.id} match={match} tournamentId={tournamentId} />
                  ))}
                </div>
              </div>

              {/* Connector lines */}
              {!isLast && (
                <div
                  style={{
                    width: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "52px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "2px",
                      background: "linear-gradient(90deg, rgba(99,120,180,0.3), rgba(79,158,255,0.3))",
                      borderRadius: "1px",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
