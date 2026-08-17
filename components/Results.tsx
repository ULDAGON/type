"use client";

import type { EngineSummary } from "@/hooks/useTypingEngine";

export function Results({ summary }: { summary: EngineSummary }) {
  return (
    <div className="resultGrid" role="status">
      <div className="resultCell hero">
        <div className="label">wpm</div>
        <div className="value">{summary.wpm}</div>
      </div>
      <div className="resultCell">
        <div className="label">accuracy</div>
        <div className="value">{summary.acc}%</div>
      </div>
      <div className="resultCell">
        <div className="label">correct keys</div>
        <div className="value">{summary.correct}</div>
      </div>
      <div className="resultCell">
        <div className="label">errors</div>
        <div className="value">{summary.errors}</div>
      </div>
      <div className="resultCell">
        <div className="label">time</div>
        <div className="value">{summary.seconds}s</div>
      </div>
    </div>
  );
}
