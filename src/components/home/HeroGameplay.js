"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/utils";

export default function HeroGameplay() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(null);
  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const sync = () => {
      if ((motion.matches && paused === null) || paused === true || !visible || document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(video);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer.disconnect(); motion.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); video.pause(); };
  }, [paused]);
  return <div className="hero-gameplay">
    <video ref={videoRef} muted loop playsInline preload="none" poster={assetPath("./assets/images/hero-gameplay-poster.jpg")} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Treasure Hunter gameplay preview">
      <source src={assetPath("./assets/videos/hero-gameplay.mp4")} type="video/mp4" />
    </video>
    <button className="gameplay-toggle" type="button" aria-label={playing ? "Pause gameplay" : "Play gameplay"} onClick={() => setPaused(playing)}>{playing ? "Ⅱ Pause gameplay" : "▶ Gameplay preview"}</button>
  </div>;
}
