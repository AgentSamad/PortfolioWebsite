"use client";

import { useState } from "react";

export default function Testimonials({ testimonials }) {
  const [index, setIndex] = useState(0);

  if (!testimonials?.length) return null;

  const current = testimonials[index];

  const change = (direction) => {
    setIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  };

  return (
    <section className="mb-16 animate-on-scroll">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl font-bold leading-tight">
          What are my <span className="text-primary">Testimonials</span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => change(-1)}
            className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <button
            type="button"
            onClick={() => change(1)}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
      <div
        id="testimonial-container"
        className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden group card-hover"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-primary transition-all duration-300 group-hover:w-72 group-hover:h-1 rounded-full" />
        <div className="flex items-center gap-3 mb-4">
          <img
            id="testimonial-img"
            alt={`Client ${current.name}`}
            className="w-12 h-12 rounded-full object-cover"
            src={current.avatar}
          />
          <h4 id="testimonial-name" className="font-bold">
            {current.name}
          </h4>
        </div>
        <p
          id="testimonial-text"
          className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed"
        >
          {current.text}
        </p>
      </div>
    </section>
  );
}
