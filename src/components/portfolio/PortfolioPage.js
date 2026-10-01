"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCategoryFilter } from "@/lib/utils";
import CollaborateCTA from "@/components/shared/CollaborateCTA";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "steam", label: "PC / Steam" },
  { id: "casual", label: "Mobile" },
  { id: "tools", label: "Tools" },
];

function PortfolioCard({ item, index }) {
  const categoryFilter = getCategoryFilter(item.category, item.type);

  const onMouseEnter = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (video) video.play();
  };

  const onMouseLeave = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/projects/${item.id}`}
      className="portfolio-item group cursor-pointer card-hover bg-card-dark dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-700/50 dark:border-gray-700/50 flex flex-col"
      data-category={categoryFilter}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-[#0F172A] rounded-t-2xl overflow-hidden relative aspect-[4/3]">
        {item.type === "video" ? (
          <>
            <video
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              muted
              loop
              playsInline
            >
              <source src={item.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
              <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition">
                play_circle
              </span>
            </div>
          </>
        ) : (
          <img
            alt={item.alt || item.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            src={item.image}
          />
        )}
      </div>
      <div className="bg-card-dark dark:bg-card-dark p-4 flex flex-col justify-center">
        <h3 className="font-bold text-lg text-white dark:text-white mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-400">{item.category}</p>
      </div>
    </Link>
  );
}

export default function PortfolioPage({ items }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter(
      (item) => getCategoryFilter(item.category, item.type) === filter
    );
  }, [filter, items]);

  return (
    <>
      <section id="projects" className="mb-16 animate-on-scroll">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">Recent Projects and</span>{" "}
            <span className="text-primary">Achievements</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                data-filter={tab.id}
                className={`filter-tab px-4 py-2 rounded-full text-sm font-medium transition ${
                  active
                    ? "active bg-primary text-white hover:bg-primary-hover"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          id="portfolio-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>
      <CollaborateCTA />
    </>
  );
}
