"use client";

import {
  KEY_ROWS,
  baseKey,
  fingerFor,
  fingerZone,
  shiftHand,
} from "@/lib/keyboard";

type Props = {
  nextChar: string | null;
};

export function Keyboard({ nextChar }: Props) {
  const next = nextChar ? baseKey(nextChar) : null;
  const finger = nextChar ? fingerFor(nextChar) : null;
  const shift = nextChar ? shiftHand(nextChar) : null;

  return (
    <div className="kb" aria-hidden>
      {KEY_ROWS.map((row, ri) => (
        <div className="kbRow" key={ri}>
          {row.map((k) => (
            <div
              key={k}
              className={`key zone-${fingerZone(k)}${k === next ? " next" : ""}`}
            >
              {k}
              {(k === "f" || k === "j") && <span className="bump" />}
            </div>
          ))}
        </div>
      ))}
      <div className="kbRow">
        <div className={`key zone-a${shift === "left" ? " next" : ""}`}>shift</div>
        <div className={`key wide zone-d${next === " " ? " next" : ""}`}>space</div>
        <div className={`key zone-a${shift === "right" ? " next" : ""}`}>shift</div>
      </div>
      <div className="fingerHint">
        {finger ? (
          <>
            <b>{finger === "thumb" ? "either thumb" : finger}</b>
            {shift ? <> &nbsp;+&nbsp; <b>{shift} pinky</b> on shift</> : null}
          </>
        ) : (
          " "
        )}
      </div>
    </div>
  );
}
