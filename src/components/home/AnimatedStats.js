"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 8, suffix: "+", label: "Years experience" },
  { value: 50, suffix: "+", label: "Games shipped" },
  { value: 50, suffix: "M+", label: "Total installs" },
];

export default function AnimatedStats() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    setProgress(0);
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const tick = now => {
        const elapsed = Math.min((now - started) / 1400, 1);
        setProgress(1 - Math.pow(1 - elapsed, 3));
        if (elapsed < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .35 });
    observer.observe(ref.current);
    const stop = () => { if (motion.matches) { observer.disconnect(); cancelAnimationFrame(frame); setProgress(1); } };
    motion.addEventListener("change", stop);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); motion.removeEventListener("change", stop); };
  }, []);
  return <div className="stats-strip" ref={ref}>{stats.map(stat => <div key={stat.label}><strong aria-label={`${stat.value}${stat.suffix}`}><span aria-hidden="true">{Math.round(stat.value * progress)}{stat.suffix}</span></strong><span>{stat.label}</span></div>)}</div>;
}
