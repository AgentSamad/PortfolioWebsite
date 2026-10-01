"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const fontAwesomeMap = {
  email: "fas fa-envelope",
  github: "fab fa-github",
  linkedin: "fab fa-linkedin-in",
  instagram: "fab fa-instagram",
  facebook: "fab fa-facebook-f",
  twitter: "fab fa-twitter",
  "google-plus": "fab fa-google-plus-g",
};

export default function SidebarProfile({ sidebar }) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isHome = pathname === "/";
  const showSidebar = isDesktop || isHome;

  if (!sidebar || !showSidebar) {
    return null;
  }

  const allLinks = [];

  if (sidebar.contacts) {
    sidebar.contacts.forEach((contact) => {
      if (
        contact.type === "email" ||
        contact.type === "github" ||
        contact.type === "linkedin"
      ) {
        allLinks.push({
          link: contact.link,
          type: contact.type,
          platform: contact.type,
        });
      }
    });
  }

  if (sidebar.social) {
    sidebar.social.forEach((social) => allLinks.push(social));
  }

  return (
    <aside
      id="sidebar-profile"
      className="w-full lg:w-80 xl:w-96 flex-shrink-0 mb-8 lg:mb-0"
    >
      <div className="lg:sticky lg:top-28">
        <div className="bg-card-light dark:bg-card-dark rounded-3xl p-6 lg:p-8 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
          <div className="w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden mb-6 relative aspect-[3/4]">
            <img
              id="sidebar-avatar"
              alt={`Profile of ${sidebar.name}`}
              className="object-cover w-full h-full"
              src={sidebar.avatar}
            />
          </div>
          <h2
            id="sidebar-name"
            className="text-2xl lg:text-3xl font-bold mb-2 text-white dark:text-white"
          >
            {sidebar.name}
          </h2>
          <p
            id="sidebar-title"
            className="text-base lg:text-lg text-white dark:text-white mb-2"
          >
            {sidebar.title}
          </p>
          <p
            id="sidebar-location"
            className="text-sm text-gray-400 dark:text-gray-400 mb-6"
          >
            Lahore, Pakistan
          </p>
          <div id="sidebar-social" className="flex justify-center gap-4 mb-6">
            <ul className="social-icons-list">
              {allLinks.map((item, index) => {
                const platform = (
                  item.platform ||
                  item.type ||
                  "email"
                ).toLowerCase();
                const iconClass =
                  fontAwesomeMap[platform] || fontAwesomeMap.email;
                return (
                  <li key={`${platform}-${index}`}>
                    <a
                      href={item.link}
                      aria-label={platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-platform={platform}
                    >
                      <i className={`${iconClass} icon`} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="w-1/2 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-hover transition shadow-lg shadow-primary/30 text-center"
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
