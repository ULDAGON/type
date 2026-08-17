export type Mode = "lesson" | "practice" | "test";

export type Result = {
  t: number; // epoch ms
  mode: Mode;
  wpm: number;
  acc: number; // 0–100
  seconds: number;
  lessonId?: string;
};

export type KeyErrorMap = Record<string, { errors: number; total: number }>;

export type LessonProgress = Record<
  string,
  { bestWpm: number; bestAcc: number; runs: number }
>;

const RESULTS_KEY = "uldagon.results";
const KEYERR_KEY = "uldagon.keyErrors";
const PROGRESS_KEY = "uldagon.lessonProgress";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — stats are best-effort
  }
}

export function loadResults(): Result[] {
  return read<Result[]>(RESULTS_KEY, []);
}

export function loadKeyErrors(): KeyErrorMap {
  return read<KeyErrorMap>(KEYERR_KEY, {});
}

export function loadLessonProgress(): LessonProgress {
  return read<LessonProgress>(PROGRESS_KEY, {});
}

export function saveResult(result: Result, perKey: KeyErrorMap) {
  const results = loadResults();
  results.push(result);
  write(RESULTS_KEY, results.slice(-500));

  const agg = loadKeyErrors();
  for (const [k, v] of Object.entries(perKey)) {
    const cur = agg[k] ?? { errors: 0, total: 0 };
    agg[k] = { errors: cur.errors + v.errors, total: cur.total + v.total };
  }
  write(KEYERR_KEY, agg);

  if (result.mode === "lesson" && result.lessonId) {
    const progress = loadLessonProgress();
    const cur = progress[result.lessonId] ?? { bestWpm: 0, bestAcc: 0, runs: 0 };
    progress[result.lessonId] = {
      bestWpm: Math.max(cur.bestWpm, result.wpm),
      bestAcc: Math.max(cur.bestAcc, result.acc),
      runs: cur.runs + 1,
    };
    write(PROGRESS_KEY, progress);
  }
}

export function clearAllStats() {
  window.localStorage.removeItem(RESULTS_KEY);
  window.localStorage.removeItem(KEYERR_KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
}
