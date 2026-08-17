"use client";

import { useCallback, useEffect, useState } from "react";
import { TrainerSession } from "@/components/TrainerSession";
import { COMMON_WORDS, pickWords } from "@/lib/words";

const DURATIONS = [30, 60, 120] as const;

// Enough words that even 160 wpm can't run out in the longest test.
const TEST_WORDS = 450;

export default function TestPage() {
  const [duration, setDuration] = useState<number>(60);
  const [text, setText] = useState("");

  const regenerate = useCallback(() => {
    setText(pickWords(COMMON_WORDS, TEST_WORDS).join(" "));
  }, []);

  // Word choice is random, so generate client-side after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    regenerate();
  }, [regenerate]);

  return (
    <div>
      <p className="eyebrow">against the clock</p>
      <h1 className="pageTitle">speed test</h1>
      <p className="pageIntro">
        The clock starts on your first keystroke and the result lands in your
        history. Words per minute counts correct characters only.
      </p>

      <div className="segmented" style={{ marginBottom: 28 }}>
        {DURATIONS.map((d) => (
          <button
            key={d}
            className={d === duration ? "on" : ""}
            onClick={() => {
              setDuration(d);
              regenerate();
            }}
          >
            {d}s
          </button>
        ))}
      </div>

      {text && (
        <TrainerSession
          key={`${duration}-${text.slice(0, 24)}`}
          text={text}
          mode="test"
          timeLimit={duration}
          onNext={regenerate}
          nextLabel="go again"
        />
      )}
    </div>
  );
}
