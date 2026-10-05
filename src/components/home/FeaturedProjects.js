"use client";
import { useState } from "react";
import Link from "next/link";
export default function FeaturedProjects({ items }) {
  const [filter, setFilter] = useState("all");
  const eligible = items.filter(item => item.type !== "video" && item.title !== "Scary Teacher 3D");
  const tabs = [["all", "All"], ...(eligible.some(item => item.category === "PC Steam") ? [["steam", "PC / Steam"]] : []), ["mobile", "Mobile"]];
  const featured = eligible.filter(item => filter === "all" || (filter === "steam" ? item.category === "PC Steam" : item.category.startsWith("Mobile"))).slice(0, 3);
  return <><div className="featured-filters" aria-label="Filter featured projects">{tabs.map(([id,label]) => <button type="button" key={id} aria-pressed={filter === id} className={filter === id ? "selected" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div><div className="featured-grid">{featured.map(item => <Link className="game-card" href={`/projects/${item.id}`} key={item.id}><div className="game-card-image"><img src={item.image} alt={item.alt || item.title} loading="lazy" /><span>{item.category === "PC Steam" ? "PC / STEAM" : "MOBILE"}</span></div><div className="game-card-copy"><h3>{item.title}</h3>{item.publisher && <p className="game-publisher">{item.publisher}</p>}<p>{item.category} · Unity development</p><span className="text-link">View project ↗</span><span className="card-arrow" aria-hidden="true">↗</span></div></Link>)}</div></>;
}


