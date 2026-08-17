"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyErrorMap } from "@/lib/stats";

export type EngineSummary = {
  wpm: number;
  acc: number;
  seconds: number;
  correct: number;
  errors: number;
  perKey: KeyErrorMap;
};

type Options = {
  text: string;
  timeLimit?: number; // seconds; when set, finishing is time-based
  onFinish?: (summary: EngineSummary) => void;
};

// Correction-free model: the cursor only advances on the correct key.
// A wrong key marks the current character and counts as an error.
export function useTypingEngine({ text, timeLimit, onFinish }: Options) {
  const [index, setIndex] = useState(0);
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [shake, setShake] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [live, setLive] = useState({ wpm: 0, acc: 100 });

  const indexRef = useRef(0);
  const startRef = useRef(0);
  const correctRef = useRef(0);
  const errorsRef = useRef(0);
  const perKeyRef = useRef<KeyErrorMap>({});
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const summarize = useCallback((seconds: number): EngineSummary => {
    const correct = correctRef.current;
    const errors = errorsRef.current;
    const minutes = Math.max(seconds, 1) / 60;
    return {
      wpm: Math.round(correct / 5 / minutes),
      acc:
        correct + errors === 0
          ? 100
          : Math.round((correct / (correct + errors)) * 1000) / 10,
      seconds: Math.round(seconds),
      correct,
      errors,
      perKey: perKeyRef.current,
    };
  }, []);

  const finish = useCallback(
    (seconds: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setFinished(true);
      setElapsed(seconds);
      onFinishRef.current?.(summarize(seconds));
    },
    [summarize]
  );

  // Callers remount the component (via a React key) when the target text
  // changes, so reset only needs to handle the explicit "repeat" case.
  const reset = useCallback(() => {
    indexRef.current = 0;
    setIndex(0);
    setMissed(new Set());
    setShake(false);
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setLive({ wpm: 0, acc: 100 });
    correctRef.current = 0;
    errorsRef.current = 0;
    perKeyRef.current = {};
    finishedRef.current = false;
  }, []);

  const refreshLive = useCallback((secs: number) => {
    const minutes = Math.max(secs, 1) / 60;
    const attempts = correctRef.current + errorsRef.current;
    setLive({
      wpm: Math.round(correctRef.current / 5 / minutes),
      acc:
        attempts === 0
          ? 100
          : Math.round((correctRef.current / attempts) * 1000) / 10,
    });
  }, []);

  // Clock tick for live stats and the time limit.
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      const secs = (performance.now() - startRef.current) / 1000;
      if (timeLimit && secs >= timeLimit) {
        finish(timeLimit);
      } else {
        setElapsed(secs);
        refreshLive(secs);
      }
    }, 200);
    return () => clearInterval(id);
  }, [started, finished, timeLimit, finish, refreshLive]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (finishedRef.current) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      e.preventDefault();

      if (!started) {
        startRef.current = performance.now();
        setStarted(true);
      }

      const cur = indexRef.current;
      const expected = text[cur];
      if (expected === undefined) return;

      const slot = (perKeyRef.current[expected] ??= { errors: 0, total: 0 });
      slot.total += 1;

      if (e.key === expected) {
        correctRef.current += 1;
        indexRef.current = cur + 1;
        setIndex(indexRef.current);
        if (!timeLimit && indexRef.current >= text.length) {
          finish((performance.now() - startRef.current) / 1000);
        }
      } else {
        errorsRef.current += 1;
        slot.errors += 1;
        setMissed((m) => (m.has(cur) ? m : new Set(m).add(cur)));
        setShake(true);
        setTimeout(() => setShake(false), 140);
      }
      refreshLive((performance.now() - startRef.current) / 1000);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [text, started, timeLimit, finish, refreshLive]);

  const liveWpm = started ? live.wpm : 0;
  const liveAcc = live.acc;

  return {
    index,
    missed,
    shake,
    started,
    finished,
    elapsed,
    liveWpm,
    liveAcc,
    reset,
  };
}
