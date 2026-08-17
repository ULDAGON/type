"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TrainerSession } from "@/components/TrainerSession";
import { LESSONS, generateDrill, getLesson } from "@/lib/lessons";

export function LessonView({ id }: { id: string }) {
  const lesson = getLesson(id);
  const [text, setText] = useState("");

  const regenerate = useCallback(() => {
    if (lesson) setText(generateDrill(lesson));
  }, [lesson]);

  // Drill text is random, so generate it client-side after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    regenerate();
  }, [regenerate]);

  if (!lesson) notFound();

  const next = LESSONS.find((l) => l.num === lesson.num + 1);

  return (
    <div>
      <p className="eyebrow">
        lesson {String(lesson.num).padStart(2, "0")} / {LESSONS.length}
        {lesson.newKeys.length > 0 && (
          <> — new keys: {lesson.newKeys.join(" ")}</>
        )}
      </p>
      <h1 className="pageTitle">{lesson.name}</h1>
      <p className="pageIntro">{lesson.guide}</p>

      {text && (
        <TrainerSession
          key={text}
          text={text}
          mode="lesson"
          lessonId={lesson.id}
          onNext={regenerate}
        />
      )}

      <div className="btnGroup" style={{ marginTop: 32 }}>
        <Link className="btn" href="/lessons">
          ← all lessons
        </Link>
        {next && (
          <Link className="btn" href={`/lessons/${next.id}`}>
            next lesson: {next.name} →
          </Link>
        )}
      </div>
    </div>
  );
}
