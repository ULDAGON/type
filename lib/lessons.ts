import { pickWords, wordsFromLetters } from "./words";

export type Lesson = {
  id: string;
  num: number;
  name: string;
  newKeys: string[];
  keys: string[]; // cumulative set available in this lesson
  guide: string; // short instruction shown above the drill
  caps?: boolean;
};

type Step = {
  id: string;
  name: string;
  add: string[];
  guide: string;
  caps?: boolean;
};

function cumulative(steps: Step[]): Lesson[] {
  const all: string[] = [];
  return steps.map((s, i) => {
    all.push(...s.add);
    return {
      id: s.id,
      num: i + 1,
      name: s.name,
      newKeys: s.add,
      keys: [...all],
      guide: s.guide,
      caps: s.caps,
    };
  });
}

export const LESSONS: Lesson[] = cumulative([
  {
    id: "fj",
    name: "index fingers",
    add: ["f", "j"],
    guide:
      "Rest all eight fingers on the middle row: left hand on a s d f, right hand on j k l ;. Your index fingers sit on f and j — feel the small bumps on those keys, they let you find home without looking. Strike f with the left index and j with the right index, and let the thumb hit space. A wrong key won't advance the cursor, so take it slow.",
  },
  {
    id: "dk",
    name: "middle fingers",
    add: ["d", "k"],
    guide:
      "Keep your index fingers anchored on f and j. Your middle fingers already rest on d and k — press them without moving the rest of the hand.",
  },
  {
    id: "sl",
    name: "ring fingers",
    add: ["s", "l"],
    guide:
      "The ring fingers rest on s and l. They are clumsier than the others — keep the strokes light and let every finger return to its home key.",
  },
  {
    id: "a-semi",
    name: "pinkies",
    add: ["a", ";"],
    guide:
      "The pinkies rest on a and ;. They are the weakest fingers, so expect this to feel awkward at first — accuracy over speed.",
  },
  {
    id: "gh",
    name: "index stretch",
    add: ["g", "h"],
    guide:
      "g and h have no finger of their own: stretch the left index sideways from f to g, and the right index from j to h. Slide over, strike, and come straight back to the bump.",
  },
  {
    id: "ei",
    name: "top row: e i",
    add: ["e", "i"],
    guide:
      "First reach to the top row: the left middle finger moves up from d to e, the right middle finger up from k to i. Only the moving finger leaves home — everything else stays put.",
  },
  {
    id: "ru",
    name: "top row: r u",
    add: ["r", "u"],
    guide:
      "The left index reaches up from f to r, the right index up from j to u. Return to the bumps on f and j after every stroke.",
  },
  {
    id: "ty",
    name: "top row: t y",
    add: ["t", "y"],
    guide:
      "t and y sit in the middle of the top row: stretch the left index up-and-over to t, the right index up-and-over to y. These are the longest index reaches — keep the wrists still.",
  },
  {
    id: "wo",
    name: "top row: w o",
    add: ["w", "o"],
    guide:
      "The left ring finger reaches up from s to w, the right ring finger up from l to o.",
  },
  {
    id: "qp",
    name: "top row: q p",
    add: ["q", "p"],
    guide:
      "The pinkies reach up: left pinky from a to q, right pinky from ; to p. Small movements — the hand itself doesn't travel.",
  },
  {
    id: "vn",
    name: "bottom row: v n",
    add: ["v", "n"],
    guide:
      "Now the bottom row: the left index curls down from f to v, the right index down from j to n.",
  },
  {
    id: "bm",
    name: "bottom row: b m",
    add: ["b", "m"],
    guide:
      "b is the left index's far reach down-and-inward from f; m is the right index curling down from j. b is the longest reach on the keyboard — go slow and come home after each stroke.",
  },
  {
    id: "cx",
    name: "bottom row: c x",
    add: ["c", "x"],
    guide:
      "Both keys belong to the left hand: the middle finger curls down from d to c, the ring finger down from s to x.",
  },
  {
    id: "z-comma",
    name: "bottom row: z ,",
    add: ["z", ","],
    guide:
      "The left pinky curls down from a to z, and the right middle finger down from k to the comma.",
  },
  {
    id: "dot-slash",
    name: "bottom row: . /",
    add: [".", "/"],
    guide:
      "The right ring finger curls down from l to the period, and the right pinky down from ; to the slash. This completes all three letter rows.",
  },
  {
    id: "caps",
    name: "capitals (shift)",
    add: [],
    caps: true,
    guide:
      "For a capital letter, hold shift with the pinky of the OPPOSITE hand while the usual finger strikes the key: right pinky holds shift for left-hand letters, left pinky for right-hand letters. Release shift as soon as the letter is down.",
  },
]);

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

const DRILL_WORDS = 24;

// Build a practice line for a lesson: real words where the unlocked
// letters allow it, letter drills otherwise, always biased to new keys.
export function generateDrill(lesson: Lesson): string {
  const letters = lesson.keys.filter((k) => /[a-z]/.test(k));
  const punctuation = lesson.keys.filter((k) => !/[a-z]/.test(k));
  const real = wordsFromLetters(letters);

  const parts: string[] = [];
  for (let i = 0; i < DRILL_WORDS; i++) {
    const wantNew = lesson.newKeys.length > 0 && i % 3 !== 2;
    if (wantNew) {
      parts.push(syntheticWord(lesson.newKeys, lesson.keys));
    } else if (real.length >= 8) {
      parts.push(pickWords(real, 1)[0]);
    } else {
      parts.push(syntheticWord(lesson.keys, lesson.keys));
    }
  }

  let words = parts;
  if (real.length >= 8) {
    // Enough vocabulary: mix half real words in for flow.
    words = parts.map((w, i) => (i % 2 === 0 ? w : pickWords(real, 1)[0]));
  }

  if (lesson.caps) {
    const pool = wordsFromLetters("abcdefghijklmnopqrstuvwxyz".split(""));
    words = pickWords(pool, DRILL_WORDS).map((w, i) =>
      i % 2 === 0 ? w[0].toUpperCase() + w.slice(1) : w
    );
  } else {
    const newPunct = lesson.newKeys.filter((k) => punctuation.includes(k));
    if (newPunct.length > 0) {
      words = words.map((w, i) =>
        i % 3 === 1 ? w + newPunct[Math.floor(Math.random() * newPunct.length)] : w
      );
    }
  }

  return words.join(" ");
}

function syntheticWord(bias: string[], all: string[]): string {
  const len = 2 + Math.floor(Math.random() * 3);
  let out = "";
  for (let i = 0; i < len; i++) {
    const pool = Math.random() < 0.7 && bias.length > 0 ? bias : all;
    let c = pool[Math.floor(Math.random() * pool.length)];
    if (out.length > 0 && c === out[out.length - 1] && pool.length > 1) {
      c = pool[(pool.indexOf(c) + 1) % pool.length];
    }
    out += c;
  }
  return out;
}
