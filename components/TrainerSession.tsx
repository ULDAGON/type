"use client";

import { useCallback, useState } from "react";
import { TypingArea } from "./TypingArea";
import { Keyboard } from "./Keyboard";
import { Results } from "./Results";
import { useTypingEngine, type EngineSummary } from "@/hooks/useTypingEngine";
import { saveResult, type Mode } from "@/lib/stats";

type Props = {
  text: string;
  mode: Mode;
  timeLimit?: number;
  lessonId?: string;
  onNext?: () => void; // regenerate text / advance to next drill
  nextLabel?: string;
};

export function TrainerSession({
  text,
  mode,
  timeLimit,
  lessonId,
  onNext,
  nextLabel = "next drill",
}: Props) {
  const [summary, setSummary] = useState<EngineSummary | null>(null);

  const handleFinish = useCallback(
    (s: EngineSummary) => {
      setSummary(s);
      saveResult(
        {
          t: Date.now(),
          mode,
          wpm: s.wpm,
          acc: s.acc,
          seconds: s.seconds,
          lessonId,
        },
        s.perKey
      );
    },
    [mode, lessonId]
  );

  const engine = useTypingEngine({ text, timeLimit, onFinish: handleFinish });

  const restart = () => {
    setSummary(null);
    engine.reset();
  };

  const next = () => {
    setSummary(null);
    onNext?.();
  };

  const remaining = timeLimit
    ? Math.max(0, Math.ceil(timeLimit - engine.elapsed))
    : null;

  return (
    <div className="typingWrap">
      <div className="liveBar">
        <span className="hot">
          <strong>{engine.liveWpm}</strong> wpm
        </span>
        <span>
          <strong>{engine.liveAcc}%</strong> acc
        </span>
        {remaining !== null && (
          <span>
            <strong>{engine.started ? remaining : timeLimit}</strong>s left
          </span>
        )}
      </div>

      {!engine.finished && (
        <>
          <TypingArea
            text={text}
            index={engine.index}
            missed={engine.missed}
            shake={engine.shake}
            finished={engine.finished}
          />
          <p className="focusHint">
            {engine.started
              ? ""
              : "start typing — the timer begins with your first key"}
          </p>
          <Keyboard nextChar={text[engine.index] ?? null} />
        </>
      )}

      {engine.finished && summary && (
        <>
          <Results summary={summary} />
          <div className="btnGroup">
            {onNext && (
              <button className="btn btnAccent" onClick={next}>
                {nextLabel}
              </button>
            )}
            <button className="btn" onClick={restart}>
              repeat
            </button>
          </div>
        </>
      )}
    </div>
  );
}
