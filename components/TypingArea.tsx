"use client";

import { useMemo } from "react";

type Props = {
  text: string;
  index: number;
  missed: Set<number>;
  shake: boolean;
  finished: boolean;
};

// Renders the target text word-by-word so lines never break mid-word.
export function TypingArea({ text, index, missed, shake, finished }: Props) {
  const words = useMemo(() => {
    const out: { chars: string[]; start: number }[] = [];
    let start = 0;
    for (const piece of text.split(/(?<= )/)) {
      out.push({ chars: [...piece], start });
      start += piece.length;
    }
    return out;
  }, [text]);

  return (
    <div className={`typingText${finished ? " typingDim" : ""}`} aria-hidden>
      {words.map((w, wi) => (
        <span className="word" key={wi}>
          {w.chars.map((c, ci) => {
            const i = w.start + ci;
            let cls = "char";
            if (i < index) cls += missed.has(i) ? " done miss" : " done";
            else if (i === index && !finished) cls += shake ? " cur shake" : " cur";
            return (
              <span key={ci} className={cls}>
                {c}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
