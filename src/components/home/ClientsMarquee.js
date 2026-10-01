"use client";

import { useEffect, useRef } from "react";

export default function ClientsMarquee({ clients }) {
  const trackRef = useRef(null);
  const positionRef = useRef(0);
  const scrollingRef = useRef(true);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!clients?.length) return undefined;

    const animate = () => {
      const track = trackRef.current;
      if (!track) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (scrollingRef.current) {
        const halfWidth = track.scrollWidth / 2;
        positionRef.current -= 0.5;
        if (Math.abs(positionRef.current) >= halfWidth) {
          positionRef.current = 0;
        }
        track.style.transform = `translateX(${positionRef.current}px)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [clients]);

  if (!clients?.length) return null;

  const items = [...clients, ...clients];

  return (
    <div className="relative">
      <div id="clients-container" className="overflow-hidden">
        <div
          id="clients-section"
          ref={trackRef}
          className="flex items-center"
          onMouseEnter={() => {
            scrollingRef.current = false;
          }}
          onMouseLeave={() => {
            scrollingRef.current = true;
          }}
        >
          {items.map((client, index) => (
            <a
              key={`${client.name}-${index}`}
              href={client.link}
              target="_blank"
              rel="noopener noreferrer"
              className="client-icon flex items-center justify-center flex-shrink-0 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-4"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-20 max-w-[230px] object-contain rounded-xl"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
