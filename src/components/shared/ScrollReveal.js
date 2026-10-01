"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function revealVisibleElements(observer) {
  const candidates = document.querySelectorAll(
    ".animate-on-scroll:not(.animated), .animate-stagger:not(.animated)"
  );

  candidates.forEach((el) => {
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
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Wait for the new route's DOM to paint before measuring visibility.
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      revealVisibleElements(observer);
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        run();
        // Second pass catches late-layout content (grids/images).
        setTimeout(run, 50);
        setTimeout(run, 200);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return <div className={className}>{children}</div>;
}
