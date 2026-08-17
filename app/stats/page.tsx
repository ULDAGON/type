"use client";

import { useEffect, useState } from "react";
import { StatChart } from "@/components/StatChart";
import { KeyHeatmap } from "@/components/KeyHeatmap";
import {
  clearAllStats,
  loadKeyErrors,
  loadResults,
  type KeyErrorMap,
  type Result,
} from "@/lib/stats";

export default function StatsPage() {
  const [results, setResults] = useState<Result[] | null>(null);
  const [keyErrors, setKeyErrors] = useState<KeyErrorMap>({});
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    // localStorage is client-only; hydrate after mount by design.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(loadResults());
    setKeyErrors(loadKeyErrors());
  }, []);

  if (results === null) return null;

  const best = results.reduce((m, r) => Math.max(m, r.wpm), 0);
  const recent = results.slice(-10);
  const avgRecent =
    recent.length > 0
      ? Math.round(recent.reduce((s, r) => s + r.wpm, 0) / recent.length)
      : 0;
  const avgAcc =
    recent.length > 0
      ? Math.round((recent.reduce((s, r) => s + r.acc, 0) / recent.length) * 10) / 10
      : 0;

  return (
    <div>
      <p className="eyebrow">progress</p>
      <h1 className="pageTitle">stats</h1>
      <p className="pageIntro">
        Everything is stored locally in this browser — nothing leaves your
        machine.
      </p>

      {results.length === 0 ? (
        <p className="empty">
          No sessions recorded yet. Finish a lesson, a practice round, or a
          speed test and it will show up here.
        </p>
      ) : (
        <>
          <div className="resultGrid">
            <div className="resultCell hero">
              <div className="label">best wpm</div>
              <div className="value">{best}</div>
            </div>
            <div className="resultCell">
              <div className="label">avg wpm (last 10)</div>
              <div className="value">{avgRecent}</div>
            </div>
            <div className="resultCell">
              <div className="label">avg accuracy (last 10)</div>
              <div className="value">{avgAcc}%</div>
            </div>
            <div className="resultCell">
              <div className="label">sessions</div>
              <div className="value">{results.length}</div>
            </div>
          </div>

          <section className="statSection">
            <h2>words per minute over time</h2>
            <div className="chartBox">
              <StatChart results={results.slice(-100)} />
            </div>
          </section>

          <section className="statSection">
            <h2>trouble keys</h2>
            <KeyHeatmap keyErrors={keyErrors} />
          </section>

          <section className="statSection">
            <h2>recent sessions</h2>
            <div className="tableWrap">
              <table className="results">
                <thead>
                  <tr>
                    <th>when</th>
                    <th>mode</th>
                    <th>wpm</th>
                    <th>accuracy</th>
                    <th>duration</th>
                  </tr>
                </thead>
                <tbody>
                  {[...results].reverse().slice(0, 15).map((r, i) => (
                    <tr key={i}>
                      <td>
                        {new Date(r.t).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {r.mode}
                        {r.lessonId ? ` · ${r.lessonId}` : ""}
                      </td>
                      <td className="num">{r.wpm}</td>
                      <td>{r.acc}%</td>
                      <td>{r.seconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="statSection">
            {confirmClear ? (
              <div className="btnGroup">
                <span style={{ color: "var(--dim)", alignSelf: "center" }}>
                  delete all history?
                </span>
                <button
                  className="btn"
                  style={{ borderColor: "var(--error)", color: "var(--error)" }}
                  onClick={() => {
                    clearAllStats();
                    setResults([]);
                    setKeyErrors({});
                    setConfirmClear(false);
                  }}
                >
                  yes, clear everything
                </button>
                <button className="btn" onClick={() => setConfirmClear(false)}>
                  keep it
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => setConfirmClear(true)}>
                clear all stats
              </button>
            )}
          </section>
        </>
      )}
    </div>
  );
}
