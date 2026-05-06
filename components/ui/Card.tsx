import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}

export default function Card({ children, className = "", style, glow }: CardProps) {
  return (
    <div
      className={`glass-card ${glow ? "glow-blue" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px 0",
        marginBottom: "20px",
      }}
    >
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "0 24px 24px" }}>{children}</div>;
}
