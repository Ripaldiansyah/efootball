"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⚡" },
  { href: "/admin/tournaments", label: "Tournaments", icon: "🏆" },
  { href: "/admin/teams", label: "Teams", icon: "👥" },
  { href: "/admin/matches", label: "Matches", icon: "⚽" },
  { href: "/admin/standings", label: "Standings", icon: "📊" },
  { href: "/admin/bracket", label: "Bracket", icon: "🔱" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0f1e 0%, #080b14 100%)",
        borderRight: "1px solid rgba(99, 120, 180, 0.12)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4f9eff, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 4px 15px rgba(79, 158, 255, 0.3)",
            }}
          >
            ⚽
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                color: "#e8eaf6",
                letterSpacing: "-0.3px",
              }}
            >
              eFootball
            </div>
            <div style={{ fontSize: "11px", color: "#4a5568", fontWeight: 500 }}>
              Tournament Manager
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "16px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99,120,180,0.2), transparent)",
          }}
        />
      </div>

      {/* Nav */}
      <nav style={{ padding: "8px 12px", flex: 1 }}>
        <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", color: "#4a5568", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px" }}>
          Admin Panel
        </div>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "13.5px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "#8892b0",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(79,158,255,0.2), rgba(168,85,247,0.1))"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(79,158,255,0.25)"
                      : "1px solid transparent",
                    transition: "all 0.2s",
                    boxShadow: isActive ? "0 4px 12px rgba(79,158,255,0.1)" : "none",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#4f9eff",
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Actions */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(99,120,180,0.1)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              color: "#ef4444",
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <span>🚪</span> Logout
          </button>
        </form>
        <div style={{ fontSize: "11px", color: "#4a5568", textAlign: "center" }}>
          eFootball Manager v1.0
        </div>
      </div>
    </aside>
  );
}
