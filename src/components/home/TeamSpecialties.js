"use client";

import { useState } from "react";
import Link from "next/link";
import RotatingWords from "./RotatingWords";

const DETAILS = {
  "Game Development": { icon: "sports_esports", label: "Built for the player", copy: "From the first prototype to the final build, I focus on responsive mechanics, reusable gameplay systems, and an experience that feels good to play." },
  "Mobile Development": { icon: "smartphone", label: "Small screen. Big possibilities.", copy: "Cross-platform games for iOS, Android, and Amazon, with careful profiling, responsive UI, and performance tuned for real devices." },
  "Editor Tooling": { icon: "view_in_ar", label: "Make building feel effortless", copy: "Custom Unity Editor tools, ScriptableObject workflows, and content pipelines that help designers and developers spend more time creating." },
  "Technical Leadership": { icon: "hub", label: "Better games start with a team", copy: "Clear architecture, thoughtful code reviews, and hands-on collaboration. I help engineers own features and move confidently from ideas to release." },
};

export default function TeamSpecialties({ services }) {
  const [active, setActive] = useState(0);
  if (!services.length) return null;
  const selected = services[active];
  const detail = DETAILS[selected.title] || { label: selected.title, copy: selected.description };
  return <section className="home-section team-section">
    <div className="section-heading"><div><p className="eyebrow">FROM IDEA TO RELEASE</p><h2>What I bring to the team</h2><p className="team-values">A blend of <RotatingWords /></p></div><span className="interaction-hint">Pick a skill. Explore the possibilities. ↙</span></div>
    <div className="specialties interactive-specialties" role="group" aria-label="Explore my specialties">
      {services.map((service, index) => <button type="button" key={service.title} className={active === index ? "specialty-card is-selected" : "specialty-card"} aria-pressed={active === index} aria-controls="specialty-detail" onClick={() => setActive(index)} style={{ "--card-delay": `${index * 80}ms` }}>
        <span className="specialty-number">0{index + 1}</span><span className="material-symbols-outlined" aria-hidden="true">{DETAILS[service.title]?.icon || "code"}</span><h3>{service.title}</h3><p>{service.description}</p><span className="specialty-affordance">{active === index ? "Exploring" : "Explore skill"} <span aria-hidden="true">↗</span></span>
      </button>)}
    </div>
    <div id="specialty-detail" className="specialty-detail" role="region" aria-label="Selected specialty" aria-live="polite"><div key={selected.title} className="specialty-detail-copy"><span className="eyebrow">{selected.title}</span><h3>{detail.label}</h3><p>{detail.copy}</p></div><Link className="text-link" href="/projects">See it in my work ↗</Link></div>
  </section>;
}
