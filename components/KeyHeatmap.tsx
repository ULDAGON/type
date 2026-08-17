"use client";

import { KEY_ROWS } from "@/lib/keyboard";
import type { KeyErrorMap } from "@/lib/stats";

// Sequential single-hue shading: more misses = deeper red.
export function KeyHeatmap({ keyErrors }: { keyErrors: KeyErrorMap }) {
  const rates = new Map<string, number>();
  for (const [k, v] of Object.entries(keyErrors)) {
    if (v.total >= 5) rates.set(k.toLowerCase(), v.errors / v.total);
  }
  const maxRate = Math.max(0.15, ...rates.values());

  return (
    <div className="kb" style={{ marginTop: 0 }}>
      {KEY_ROWS.map((row, ri) => (
        <div className="kbRow" key={ri}>
          {row.map((k) => {
            const rate = rates.get(k);
            const heat = rate !== undefined ? rate / maxRate : 0;
            return (
              <div
                key={k}
                className="key zone-b"
                title={
                  rate !== undefined
                    ? `${k}: ${(rate * 100).toFixed(1)}% missed`
                    : `${k}: not enough data`
                }
                style={
                  heat > 0
                    ? {
                        background: `color-mix(in srgb, var(--error) ${Math.round(
                          12 + heat * 70
                        )}%, var(--bg-key))`,
                        color: heat > 0.5 ? "#fff" : "var(--text)",
                      }
                    : undefined
                }
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
      <p className="fingerHint">deeper red = higher miss rate (keys with 5+ attempts)</p>
    </div>
  );
}
