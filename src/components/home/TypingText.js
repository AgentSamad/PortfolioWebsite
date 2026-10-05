"use client";
import { useEffect, useState } from "react";
const PHRASES = ["keep playing.", "keep loving.", "keep exploring.", "keep enjoying."];
export default function TypingText() {
  const [text, setText] = useState(PHRASES[0]);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let phraseIndex = 0;
    let charIndex = PHRASES[0].length;
    let deleting = true;
    let active = true;
    const tick = () => {
      if (!active || preference.matches || paused) return;
      const phrase = PHRASES[phraseIndex];
      charIndex += deleting ? -1 : 1;
      setText(phrase.slice(0, charIndex));
      let delay = deleting ? 45 : 85;
      if (deleting && charIndex === 0) {
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        deleting = false;
        delay = 300;
      } else if (!deleting && charIndex === phrase.length) {
        deleting = true;
        delay = 2200;
      }
      timer = setTimeout(tick, delay);
    };
    const start = () => {
      clearTimeout(timer);
      phraseIndex = 0; charIndex = PHRASES[0].length; deleting = true;
      setText(PHRASES[0]);
      if (!preference.matches && !paused) timer = setTimeout(tick, 2200);
    };
    start();
    preference.addEventListener("change", start);
    return () => { active = false; clearTimeout(timer); preference.removeEventListener("change", start); };
  }, [paused]);
  return <span className="hero-typing">
    <span className="sr-only">keep playing, keep loving, keep exploring, and keep enjoying.</span>
    <span aria-hidden="true">{text}<span className="hero-typing-cursor">|</span></span>
    <button className="headline-motion-toggle" type="button" aria-label={paused ? "Play headline animation" : "Pause headline animation"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "▶" : "Ⅱ"}</button>
  </span>;
}
