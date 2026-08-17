"use client";

import { useCallback, useEffect, useState } from "react";
import { TrainerSession } from "@/components/TrainerSession";
import { COMMON_WORDS, pickWords } from "@/lib/words";

const WORDS_PER_ROUND = 30;

export default function PracticePage() {
  const [text, setText] = useState("");

  const regenerate = useCallback(() => {
    setText(pickWords(COMMON_WORDS, WORDS_PER_ROUND).join(" "));
  }, []);

  // Word choice is random, so generate client-side after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    regenerate();
  }, [regenerate]);

  return (
    <div>
      <p className="eyebrow">free typing</p>
      <h1 className="pageTitle">practice</h1>
      <p className="pageIntro">
        Thirty common words, full keyboard, no clock. Keep your eyes on the
        screen and trust your fingers to find the keys.
      </p>

      {text && (
        <TrainerSession
          key={text}
          text={text}
          mode="practice"
          onNext={regenerate}
          nextLabel="new words"
        />
      )}
    </div>
  );
}
