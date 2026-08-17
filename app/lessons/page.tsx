"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "@/lib/lessons";
import { loadLessonProgress, type LessonProgress } from "@/lib/stats";

export default function LessonsPage() {
  const [progress, setProgress] = useState<LessonProgress>({});

  useEffect(() => {
    // localStorage is client-only; hydrate after mount by design.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadLessonProgress());
  }, []);

  return (
    <div>
      <p className="eyebrow">curriculum</p>
      <h1 className="pageTitle">lessons</h1>
      <p className="pageIntro">
        Two new keys per lesson, starting where your fingers rest. Aim for 95%
        accuracy before moving on — speed follows accuracy, not the other way
        around.
      </p>

      <div className="lessonList">
        {LESSONS.map((l) => {
          const p = progress[l.id];
          return (
            <Link
              className={`lessonRow${p ? " done" : ""}`}
              href={`/lessons/${l.id}`}
              key={l.id}
            >
              <span className="num">{String(l.num).padStart(2, "0")}</span>
              <span className="keys">
                {l.caps ? "A–Z" : l.newKeys.join(" ")}
              </span>
              <span className="name">{l.name}</span>
              <span className="meta">
                {p
                  ? `best ${p.bestWpm} wpm · ${p.bestAcc}% · ${p.runs}×`
                  : "not started"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
