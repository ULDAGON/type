# ULDAGON_type — touch typing trainer

A Next.js app for learning 10-finger touch typing. Monospace UI, dark
(`#0e131c`) background, `#d4d4d4` text, `#fffb00` accents.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's inside

- **Lessons** (`/lessons`) — 16 progressive steps. Each lesson introduces two
  keys, starting with the index fingers on the home row (`f` `j`) and working
  outward, ending with capitals via shift. Drills mix letter patterns with real
  words once enough letters are unlocked.
- **Practice** (`/practice`) — free typing over common English words, no timer.
- **Speed test** (`/test`) — 30/60/120 seconds against the clock. The timer
  starts on the first keystroke; WPM counts correct characters only
  (chars ÷ 5 ÷ minutes).
- **Stats** (`/stats`) — WPM over time, per-key miss-rate heatmap, and recent
  session history.

The trainer uses a correction-free model: a wrong key never advances the
cursor — it flashes red, counts as an error, and waits for the right key.
The on-screen keyboard highlights the next key and names the finger to use.

All progress is stored in `localStorage`; nothing leaves the browser.

## Structure

- `hooks/useTypingEngine.ts` — keystroke handling, timing, WPM/accuracy
- `lib/lessons.ts` — curriculum and drill text generation
- `lib/keyboard.ts` — key layout and finger mapping
- `lib/words.ts` — common-word pool
- `lib/stats.ts` — localStorage persistence
- `components/TrainerSession.tsx` — one typing session (text → results)

## License

MIT — see [LICENSE](LICENSE).
