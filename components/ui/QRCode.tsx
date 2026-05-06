"use client";

import React, { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 160 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const QRCode = await import("qrcode");
        if (!cancelled && canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 1,
            color: {
              dark: "#e8eaf6",
              light: "#0f1523",
            },
          });
        }
      } catch (err) {
        console.error("QR error:", err);
      }
    }
    render();
    return () => { cancelled = true; };
  }, [value, size]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        background: "#0f1523",
        borderRadius: "10px",
        border: "1px solid rgba(99,120,180,0.2)",
      }}
    >
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
}
