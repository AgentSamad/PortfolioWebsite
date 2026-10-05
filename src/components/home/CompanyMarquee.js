"use client";

import { useState } from "react";
import { assetPath } from "@/lib/utils";

const publishers = [
  { name: "Voodoo", logo: "./assets/images/voodoo-logo.svg", link: "https://voodoo.io/" },
  { name: "Supersonic", logo: "./assets/images/SupersonicLogo.jfif", link: "https://supersonic.com/" },
  { name: "Rollic", logo: "./assets/images/rollic-logo.png", link: "https://rollicgames.com/" },
  { name: "Azur Games", logo: "./assets/images/azur-games-logo.svg", link: "https://azurgames.com/" },
  { name: "ZPLAY", logo: "./assets/images/zplay-logo.png", link: "https://zplay.com/" },
  { name: "Zynga", logo: "./assets/images/ZyngaLogo.png", link: "https://www.zynga.com/" },
  { name: "Lion Studios", logo: "./assets/images/Lion Studios Logo.jfif", link: "https://lionstudios.cc/" },
];

export default function CompanyMarquee({ clients }) {
  const [paused, setPaused] = useState(false);
  const companies = [...clients, ...publishers];
  return <section className="partners-section company-marquee">
    <div className="marquee-heading"><p>Teams &amp; publishers<br /><strong>around the world</strong></p><button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume logos ▶" : "Pause logos Ⅱ"}</button></div>
    <div className="marquee-window" data-paused={paused}>
      <div className="marquee-track">
        {[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {companies.map(company => <a className="company-logo" href={company.link} target="_blank" rel="noopener noreferrer" key={company.name} tabIndex={copy === 1 ? -1 : undefined} aria-label={`Visit ${company.name} website`}><img src={assetPath(company.logo)} alt="" /><span>{company.name} ↗</span></a>)}
        </div>)}
      </div>
    </div>
  </section>;
}

