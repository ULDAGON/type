export type Finger =
  | "left pinky"
  | "left ring"
  | "left middle"
  | "left index"
  | "right index"
  | "right middle"
  | "right ring"
  | "right pinky"
  | "thumb";

// Visual rows of a US ANSI layout (letters + the punctuation we teach).
export const KEY_ROWS: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

const FINGER_MAP: Record<string, Finger> = {
  q: "left pinky", a: "left pinky", z: "left pinky",
  w: "left ring", s: "left ring", x: "left ring",
  e: "left middle", d: "left middle", c: "left middle",
  r: "left index", f: "left index", v: "left index",
  t: "left index", g: "left index", b: "left index",
  y: "right index", h: "right index", n: "right index",
  u: "right index", j: "right index", m: "right index",
  i: "right middle", k: "right middle", ",": "right middle",
  o: "right ring", l: "right ring", ".": "right ring",
  p: "right pinky", ";": "right pinky", "/": "right pinky",
  "'": "right pinky",
  " ": "thumb",
};

// Zone letter for monochrome shading: pinky=a, ring=b, middle=c, index=d.
export function fingerZone(key: string): "a" | "b" | "c" | "d" {
  const f = FINGER_MAP[key];
  if (!f || f === "thumb") return "a";
  if (f.includes("pinky")) return "a";
  if (f.includes("ring")) return "b";
  if (f.includes("middle")) return "c";
  return "d";
}

export function fingerFor(char: string): Finger | null {
  return FINGER_MAP[char.toLowerCase()] ?? null;
}

// Which physical key produces this character (for shifted chars).
export function baseKey(char: string): string {
  const lower = char.toLowerCase();
  if (FINGER_MAP[lower]) return lower;
  return char;
}

export function needsShift(char: string): boolean {
  return /[A-Z]/.test(char);
}

// Shift is pressed with the pinky of the opposite hand.
export function shiftHand(char: string): "left" | "right" | null {
  if (!needsShift(char)) return null;
  const f = fingerFor(char);
  if (!f || f === "thumb") return null;
  return f.startsWith("left") ? "right" : "left";
}
