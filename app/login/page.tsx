"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        className="glass-card"
        style={{ width: "100%", maxWidth: "400px", padding: "40px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚡</div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "#e8eaf6",
            }}
          >
            Admin Login
          </h1>
          <p style={{ color: "#8892b0", fontSize: "14px", marginTop: "8px" }}>
            Enter your credentials to manage tournaments.
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="section-label" style={{ display: "block", marginBottom: "8px" }}>
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="input-field"
              placeholder="Admin username"
            />
          </div>

          <div>
            <label className="section-label" style={{ display: "block", marginBottom: "8px" }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                padding: "12px",
                color: "#ef4444",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isPending}
            style={{ marginTop: "8px", justifyContent: "center" }}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
