"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { assetPath } from "@/lib/utils";
const links = [["/", "Home"], ["/projects", "Projects"], ["/resume", "Resume"], ["/blog", "Blog"], ["/contact", "Contact"]];
export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="site-header-inner">
    <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="Abdus Samad home"><img className="brand-avatar" src={assetPath("./assets/images/my-profile.jpg")} alt="" width={46} height={46} /><span className="brand-copy">Abdus Samad<small>Senior Game Developer</small></span></Link>
    <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation" id="main-navigation">{links.map(([href,label]) => {
      const active = href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/resume" && pathname.startsWith("/experience"));
      return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={active ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>;
    })}</nav>
    <Link href="/contact" className="header-contact">Let&apos;s build together <span aria-hidden="true">↗</span></Link>
    <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
  </div></header>;
}
