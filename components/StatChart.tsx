"use client";

import { useMemo, useState } from "react";
import type { Result } from "@/lib/stats";

const W = 880;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

// Single-series line chart of words-per-minute over time.
export function StatChart({ results }: { results: Result[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const points = useMemo(() => {
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const max = Math.max(40, ...results.map((r) => r.wpm));
    const step = results.length > 1 ? innerW / (results.length - 1) : 0;
    return results.map((r, i) => ({
      x: PAD.left + (results.length > 1 ? i * step : innerW / 2),
      y: PAD.top + innerH - (r.wpm / max) * innerH,
      r,
    }));
  }, [results]);

  const max = Math.max(40, ...results.map((r) => r.wpm));
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: PAD.top + (H - PAD.top - PAD.bottom) * (1 - f),
    label: Math.round(max * f),
  }));

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const hovered = hover !== null ? points[hover] : null;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best);
  }

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label="Words per minute over your recorded sessions"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        style={{ display: "block", minWidth: 480 }}
      >
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={g.y}
              y2={g.y}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={g.y + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--dim)"
            >
              {g.label}
            </text>
          </g>
        ))}

        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="var(--dim)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {points.length > 1 && (
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
        )}

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hover === i ? 5 : points.length > 60 ? 2 : 3.5}
            fill={hover === i ? "var(--accent)" : "var(--bg)"}
            stroke="var(--accent)"
            strokeWidth="2"
          />
        ))}

        <text
          x={PAD.left}
          y={H - 8}
          fontSize="11"
          fill="var(--dim)"
        >
          {results.length > 0 && fmtDate(results[0].t)}
        </text>
        <text
          x={W - PAD.right}
          y={H - 8}
          textAnchor="end"
          fontSize="11"
          fill="var(--dim)"
        >
          {results.length > 0 && fmtDate(results[results.length - 1].t)}
        </text>
      </svg>

      {hovered && (
        <div
          style={{
            position: "absolute",
            left: `${(hovered.x / W) * 100}%`,
            top: 0,
            transform: `translateX(${hovered.x > W * 0.7 ? "-110%" : "10%"})`,
            background: "var(--bg-key)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 12,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <strong>{hovered.r.wpm} wpm</strong> · {hovered.r.acc}% ·{" "}
          {hovered.r.mode}
          <div style={{ color: "var(--dim)" }}>{fmtDate(hovered.r.t, true)}</div>
        </div>
      )}
    </div>
  );
}

function fmtDate(t: number, withTime = false): string {
  const d = new Date(t);
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  if (!withTime) return date;
  return `${date}, ${d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
