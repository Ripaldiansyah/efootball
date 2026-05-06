import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eFootball Tournament",
  description: "Manage and view eFootball tournaments",
};

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Orbs */}
      <div className="bg-orb" style={{ width: "600px", height: "600px", background: "var(--accent-blue)", top: "-10%", right: "-10%", animationDelay: "0s" }} />
      <div className="bg-orb" style={{ width: "400px", height: "400px", background: "var(--accent-purple)", bottom: "-5%", left: "-5%", animationDelay: "-3s" }} />
      
      <div className="animate-fade-in-up" style={{ textAlign: "center", marginBottom: "56px", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: "64px", marginBottom: "16px", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}>⚽</div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "48px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #60a5fa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-1px",
          }}
        >
          eFootball Manager
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginTop: "12px", maxWidth: "400px", margin: "12px auto 0", lineHeight: 1.5 }}>
          The complete platform for managing your local tournaments, tracking scores, and generating certificates.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", width: "100%", maxWidth: "1100px", zIndex: 10 }}>
        {/* Matches */}
        <Link href="/matches" className="quick-link-card animate-fade-in-up stagger-1" style={{ padding: "32px", textAlign: "center", height: "100%" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚔️</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#e8eaf6", marginBottom: "8px" }}>Live Matches</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>See all match results and submission codes in real-time.</p>
        </Link>

        {/* Standings */}
        <Link href="/standings" className="quick-link-card animate-fade-in-up stagger-2" style={{ padding: "32px", textAlign: "center", height: "100%" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#e8eaf6", marginBottom: "8px" }}>League Standings</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>View live tables, points, and goal differences.</p>
        </Link>

        {/* Bracket */}
        <Link href="/bracket" className="quick-link-card animate-fade-in-up stagger-3" style={{ padding: "32px", textAlign: "center", height: "100%" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔱</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#e8eaf6", marginBottom: "8px" }}>Knockout Bracket</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>Follow cup tournaments from the group stage to finals.</p>
        </Link>

        {/* Admin Login */}
        <Link href="/admin" className="quick-link-card animate-fade-in-up stagger-4" style={{ padding: "32px", textAlign: "center", height: "100%" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙️</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#e8eaf6", marginBottom: "8px" }}>Tournament Admin</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>Login to manage teams, matches, and settings.</p>
        </Link>
      </div>
    </div>
  );
}

