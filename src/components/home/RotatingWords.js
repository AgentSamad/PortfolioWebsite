"use client";

import { useEffect, useState } from "react";

const WORDS = ["Innovation", "Creativity", "Craftsmanship", "Curiosity"];

export default function RotatingWords() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => setIndex(current => (current + 1) % WORDS.length), 2800);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  return <span className="rotating-values">
    <span className="sr-only">Innovation, creativity, craftsmanship, and curiosity.</span>
    <span className="rotating-word-slot" aria-hidden="true"><span key={index} className="rotating-word">{WORDS[index]}<span className="word-cursor">_</span></span></span>
    <button type="button" className="motion-toggle" aria-label={paused ? "Play changing words" : "Pause changing words"} aria-pressed={paused} onClick={() => setPaused(current => !current)}>{paused ? "▶" : "Ⅱ"}</button>
  </span>;
}
