"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useScreenshotsPerView() {
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 768 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return perView;
}

function isVideoMedia(media, itemType) {
  return (
    media.includes(".mp4") ||
    media.includes(".webm") ||
    media.includes(".mov") ||
    itemType === "video"
  );
}

export default function ProjectDetail({ item }) {
  const screenshots =
    item.screenshots?.length > 0
      ? item.screenshots
      : item.type === "video" && item.video
        ? [item.video]
        : [];

  const screenshotsPerView = useScreenshotsPerView();
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const maxIndex = Math.max(0, screenshots.length - screenshotsPerView);
  const showNav = screenshots.length > screenshotsPerView;
  const gapRem = screenshotsPerView === 1 ? 0 : 0.67;
  const itemWidthCalc = `calc(${100 / screenshotsPerView}% - ${gapRem}rem)`;

  useEffect(() => {
    setIndex(0);
  }, [item.id]);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container || screenshots.length === 0) return;

    const firstItem = slider.querySelector("div");
    if (!firstItem) return;

    const itemWidthPx = firstItem.offsetWidth;
    const gapPx = 16;
    const translateXPx = -(index * (itemWidthPx + gapPx));
    slider.style.transform = `translateX(${translateXPx}px)`;
  }, [index, screenshots.length]);

  const change = (direction) => {
    setIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next > maxIndex) return maxIndex;
      return next;
    });
  };

  const logoSrc = (() => {
    if (item.logo) {
      const isVideoFile =
        item.logo.includes(".mp4") ||
        item.logo.includes(".webm") ||
        item.logo.includes(".mov");
      if (isVideoFile && item.image) return item.image;
      if (!isVideoFile) return item.logo;
    }
    return item.image || null;
  })();

  const hasGoogle = Boolean(item.googlePlayLink);
  const hasAppStore = Boolean(item.appStoreLink);
  const hasCustom = Boolean(item.customLink);
  const hasAnyLink = hasGoogle || hasAppStore || hasCustom;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/projects"
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm">All Projects</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        {logoSrc && (
          <img
            id="project-logo"
            alt="Project Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl flex-shrink-0"
            src={logoSrc}
          />
        )}
        <h1
          id="project-title"
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-white"
        >
          {item.title}
        </h1>
      </div>

      {screenshots.length > 0 && (
        <div id="project-screenshots-section" className="mb-8">
          <div className="relative">
            <div
              id="project-screenshots-container"
              ref={containerRef}
              className="overflow-hidden rounded-2xl bg-gray-900"
            >
              <div
                id="project-screenshots-slider"
                ref={sliderRef}
                className={`flex gap-4 transition-transform duration-500 ease-in-out ${
                  screenshots.length === 1 ? "justify-center" : ""
                }`}
              >
                {screenshots.map((media, mediaIndex) => (
                  <div
                    key={`${media}-${mediaIndex}`}
                    className="flex-shrink-0 rounded-lg overflow-hidden"
                    style={{ width: itemWidthCalc, minWidth: 0 }}
                  >
                    {isVideoMedia(media, item.type) ? (
                      <video
                        className="w-full h-auto object-cover rounded-lg"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={media} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={media}
                        alt={`Screenshot ${mediaIndex + 1}`}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {showNav && (
              <>
                <button
                  type="button"
                  onClick={() => change(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => change(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </>
            )}

            {showNav && (
              <div
                id="project-screenshot-dots"
                className="flex justify-center gap-2 mt-4"
              >
                {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    className={`w-2 h-2 rounded-full transition ${
                      dotIndex === index ? "bg-primary" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {item.description && (
        <div id="project-description-section" className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">About This Game</h2>
          <p
            id="project-description"
            className="text-gray-300 leading-relaxed"
          >
            {item.description}
          </p>
        </div>
      )}

      {hasAnyLink && (
        <div id="project-links-section" className="mb-16 flex flex-wrap gap-4">
          {hasGoogle && (
            <a
              href={item.googlePlayLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F9D58] text-white rounded-xl font-medium hover:bg-[#0d8a4d] transition shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span>Google Play</span>
            </a>
          )}
          {hasAppStore && (
            <a
              href={item.appStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#007AFF] text-white rounded-xl font-medium hover:bg-[#0066cc] transition shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05,20.2C16.23,20.94 15.31,21.05 14.24,20.5C13.17,19.94 12.3,19.94 11.63,20.5C10.96,21.05 10.16,20.94 9.34,20.2C8.5,19.45 8.22,18.5 8.5,17.35L11.11,5.5C11.39,4.35 12.14,3.55 13.36,3.1C14.58,2.65 15.64,2.75 16.55,3.4C17.46,4.05 18.11,4.95 18.5,6.1L16,17.35C15.72,18.5 16,19.45 17.05,20.2M12.65,3.25C13.16,3.25 13.58,3.66 13.58,4.17C13.58,4.68 13.16,5.08 12.65,5.08C12.14,5.08 11.72,4.68 11.72,4.17C11.72,3.66 12.14,3.25 12.65,3.25Z" />
              </svg>
              <span>App Store</span>
            </a>
          )}
          {hasCustom && (
            <a
              href={item.customLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition shadow-lg shadow-primary/30"
            >
              <span className="material-symbols-outlined">link</span>
              <span>Visit Project</span>
            </a>
          )}
        </div>
      )}
    </>
  );
}
