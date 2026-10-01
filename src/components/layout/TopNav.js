"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", section: "home", icon: "home", label: "Home" },
  {
    href: "/projects",
    section: "projects",
    icon: "folder_open",
    label: "Projects",
  },
  { href: "/resume", section: "resume", icon: "work", label: "Resume" },
  { href: "/blog", section: "blog", icon: "edit", label: "Blog" },
  { href: "/contact", section: "contact", icon: "mail", label: "Contact" },
];

function resolveActiveSection(pathname) {
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/experience") || pathname.startsWith("/resume")) {
    return "resume";
  }
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
}

export default function TopNav() {
  const pathname = usePathname();
  const active = resolveActiveSection(pathname);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card-light dark:bg-[#1E293B] dark:bg-opacity-80 backdrop-blur-md px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="nav-icons-list">
          {navItems.map((item) => (
            <Link
              key={item.section}
              href={item.href}
              className={`nav-icon-item ${active === item.section ? "active" : ""}`}
              data-section={item.section}
              style={{ "--i": "#3B82F6", "--j": "#2563EB" }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="title">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
