// Common English words used for practice and speed tests.
export const COMMON_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "any",
  "these", "give", "day", "most", "us", "is", "was", "are", "been",
  "has", "had", "were", "said", "did", "man", "find", "here", "thing",
  "many", "long", "down", "own", "same", "tell", "very", "still",
  "should", "must", "home", "big", "high", "such", "keep", "last",
  "never", "old", "great", "small", "part", "place", "made", "live",
  "where", "much", "too", "little", "world", "hand", "life", "each",
  "right", "left", "off", "play", "spell", "air", "away", "animal",
  "house", "point", "page", "letter", "mother", "answer", "found",
  "study", "learn", "plant", "cover", "food", "sun", "four", "between",
  "state", "kind", "need", "picture", "again", "change", "turn", "help",
  "line", "cause", "mean", "before", "move", "boy", "does", "sound",
  "water", "call", "word", "why", "men", "read", "land", "different",
  "three", "end", "put", "follow", "act", "ask", "went", "light",
  "close", "night", "real", "few", "north", "open", "seem", "next",
  "white", "children", "begin", "got", "walk", "example", "always",
  "both", "paper", "together", "often", "run", "important", "until",
  "side", "feet", "car", "mile", "second", "book", "carry", "took",
  "science", "eat", "room", "friend", "began", "idea", "fish",
  "mountain", "stop", "once", "base", "hear", "horse", "cut", "sure",
  "watch", "color", "face", "wood", "main", "enough", "plain", "girl",
  "usual", "young", "ready", "above", "ever", "red", "list", "though",
  "feel", "talk", "bird", "soon", "body", "dog", "family", "direct",
  "pose", "leave", "song", "measure", "door", "product", "black",
  "short", "number", "class", "wind", "question", "happen", "complete",
  "ship", "area", "half", "rock", "order", "fire", "south", "problem",
  "piece", "told", "knew", "pass", "since", "top", "whole", "king",
  "space", "heard", "best", "hour", "better", "true", "during",
  "hundred", "five", "remember", "step", "early", "hold", "west",
  "ground", "interest", "reach", "fast", "verb", "sing", "listen",
  "six", "table", "travel", "less", "morning", "ten", "simple",
  "several", "vowel", "toward", "war", "lay", "against", "pattern",
  "slow", "center", "love", "person", "money", "serve", "appear",
  "road", "map", "rain", "rule", "govern", "pull", "cold", "notice",
  "voice", "unit", "power", "town", "fine", "certain", "fly", "fall",
  "lead", "cry", "dark", "machine", "note", "wait", "plan", "figure",
  "star", "box", "noun", "field", "rest", "correct", "able", "pound",
  "done", "beauty", "drive", "stood", "contain", "front", "teach",
  "week", "final", "gave", "green", "oh", "quick", "develop", "ocean",
  "warm", "free", "minute", "strong", "special", "mind", "behind",
  "clear", "tail", "produce", "fact", "street", "inch", "multiply",
  "nothing", "course", "stay", "wheel", "full", "force", "blue",
  "object", "decide", "surface", "deep", "moon", "island", "foot",
  "system", "busy", "test", "record", "boat", "common", "gold",
  "possible", "plane", "dry", "wonder", "laugh", "thousand", "ago",
  "ran", "check", "game", "shape", "hot", "miss", "brought", "heat",
  "snow", "tire", "bring", "yes", "distant", "fill", "east", "paint",
  "language", "among",
];

export function pickWords(pool: string[], count: number): string[] {
  const out: string[] = [];
  let last = "";
  for (let i = 0; i < count; i++) {
    let w = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && w === last) {
      w = pool[(pool.indexOf(w) + 1) % pool.length];
    }
    out.push(w);
    last = w;
  }
  return out;
}

export function wordsFromLetters(letters: string[]): string[] {
  const set = new Set(letters.map((l) => l.toLowerCase()));
  return COMMON_WORDS.filter((w) => [...w].every((c) => set.has(c)));
}
