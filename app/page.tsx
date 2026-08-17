import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p className="eyebrow">touch typing, ten fingers, no looking down</p>
      <h1 className="heroType">
        the quick brown fox
        <br />
        j<span className="acc">u</span>
        <span className="ghost">mps over the lazy dog</span>
      </h1>
      <p className="pageIntro">
        Keep your index fingers on <strong>f</strong> and <strong>j</strong>,
        let the on-screen keyboard show you which finger moves, and build up
        from the home row to full-speed typing.
      </p>

      <div className="homeGrid">
        <Link className="homeCard" href="/lessons">
          <h3>lessons</h3>
          <p>
            16 steps from f–j to capitals. Each lesson unlocks two keys and
            drills them until they sit under the right finger.
          </p>
          <span className="go">start at the home row →</span>
        </Link>
        <Link className="homeCard" href="/practice">
          <h3>practice</h3>
          <p>
            Free typing over common English words with the full keyboard. No
            timer, just flow.
          </p>
          <span className="go">warm up →</span>
        </Link>
        <Link className="homeCard" href="/test">
          <h3>speed test</h3>
          <p>
            30, 60 or 120 seconds against the clock. Words per minute and
            accuracy, saved to your history.
          </p>
          <span className="go">measure yourself →</span>
        </Link>
        <Link className="homeCard" href="/stats">
          <h3>stats</h3>
          <p>
            Your speed over time and the keys that still trip you up, stored
            locally in this browser.
          </p>
          <span className="go">see your progress →</span>
        </Link>
      </div>
    </div>
  );
}
