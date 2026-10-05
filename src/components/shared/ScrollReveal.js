"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function revealVisibleElements(observer) {
  const candidates = document.querySelectorAll(
    ".reveal-ready:not(.animated), .animate-on-scroll:not(.animated), .animate-stagger:not(.animated), .home-section:not(.animated), .partners-section:not(.animated), .stats-strip:not(.animated), .game-card:not(.animated), .portfolio-item:not(.animated), .experience-preview-item:not(.animated), .partner-logo:not(.animated), .journal-card:not(.animated), .developer-intro:not(.animated), .contact-form-panel:not(.animated), #experience-list > a:not(.animated), #education-list > div:not(.animated)"
  );

  candidates.forEach((el) => {
    if (el.closest(".home-design") && el.matches(".home-section, .partners-section")) return;
    if (!el.matches(".animate-on-scroll, .animate-stagger")) el.classList.add("reveal-ready");
    if (el.closest(".home-design") && !el.dataset.reveal) {
      const siblings = Array.from(el.parentElement.children);
      el.dataset.reveal = el.matches(".game-card, .partner-logo, .stats-strip")
        ? "scale"
        : siblings.indexOf(el) % 2 === 0 ? "left" : "right";
    }
    if (el.matches(".game-card, .portfolio-item, .partner-logo, .experience-preview-item")) {
      const siblings = Array.from(el.parentElement.children);
      el.style.transitionDelay = `${(siblings.indexOf(el) % 3) * 80}ms`;
    }
    const rect = el.getBoundingClientRect();
    const inView =
      rect.height > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0;

    if (inView) {
      el.classList.add("animated");
    } else {
      observer.observe(el);
    }
  });
}

export default function ScrollReveal({ children, className = "" }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    // Wait for the new route's DOM to paint before measuring visibility.
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      document.querySelectorAll(".home-design .section-heading, .home-design .journal, .home-design .about-developer, .home-design .specialty-card, .home-design .specialty-detail, .home-design .home-contact > div:first-child, .home-design .partners-section > p").forEach((el, index) => {
        el.classList.add("reveal-ready");
        if (!el.dataset.reveal) el.dataset.reveal = el.matches(".specialty-card") ? "scale" : index % 2 === 0 ? "left" : "right";
      });
      revealVisibleElements(observer);
    };

    // Filters insert new cards without changing routes: observe those too.
    let mutationFrame;
    const updates = new MutationObserver((records) => {
      const insertedCards = records.some(record => Array.from(record.addedNodes).some(node =>
        node.nodeType === 1 && (node.matches(".game-card, .portfolio-item") || node.querySelector(".game-card, .portfolio-item"))
      ));
      if (!insertedCards) return;
      cancelAnimationFrame(mutationFrame);
      mutationFrame = requestAnimationFrame(run);
    });
    const main = document.querySelector(".site-main");
    if (main) updates.observe(main, { childList: true, subtree: true });

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        run();
        setTimeout(run, 50);
        setTimeout(run, 200);
        setTimeout(run, 500);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(mutationFrame);
      updates.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return <div className={className}>{children}</div>;
}
