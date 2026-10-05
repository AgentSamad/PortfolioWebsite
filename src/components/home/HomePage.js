import Link from "next/link";
import Testimonials from "./Testimonials";
import FeaturedProjects from "./FeaturedProjects";
import ContactForm from "@/components/contact/ContactForm";
import { assetPath } from "@/lib/utils";
import TeamSpecialties from "./TeamSpecialties";
import TypingText from "./TypingText";
export default function HomePage({ content, items, blogs }) {
  const { about, resume, sidebar } = content;
  const blog = blogs[0];
  return <div className="home-design">
    <section className="hero">
      <img className="hero-art" src={assetPath("./assets/images/portfolio-hero.webp")} alt="" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-copy"><p className="eyebrow">UNITY / C# / GAMEPLAY ENGINEERING</p><h1>I build games<br /><span className="hero-second-line">people <em><TypingText /></em></span></h1><p className="hero-description">Senior Game Developer crafting gameplay systems, tools, and multiplayer experiences for PC and mobile.</p><div className="hero-actions"><Link href="/projects" className="button-primary">Explore projects <span>↗</span></Link><Link href="/resume" className="button-outline">View resume</Link></div></div>
      <span className="hero-caption">GAMEPLAY. SYSTEMS. EXPERIENCE.</span>
    </section>
    <div className="stats-strip"><div><strong>8+</strong><span>Years experience</span></div><div><strong>50+</strong><span>Games shipped</span></div><div><strong>50M+</strong><span>Total installs</span></div></div>
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">THE PORTFOLIO</p><h2>Selected work</h2><p>A few worlds I helped bring to life.</p></div><Link className="text-link" href="/projects">View all {items.length} projects ↗</Link></div><FeaturedProjects items={items} /></section>
    <TeamSpecialties services={about.services} />
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">THE JOURNEY</p><h2>Experience that ships.</h2><p>From core gameplay to live games, I focus on what players love.</p></div><Link className="text-link" href="/resume">Explore my resume ↗</Link></div><div className="experience-preview">{resume.experience.slice(0, 3).map((exp, index) => <Link href={`/experience/${index}`} key={exp.company} className="experience-preview-item"><span className="experience-number">0{index + 1}</span><div><span className="experience-period">{exp.period}</span><h3>{exp.company}</h3><p>{exp.position}</p><span className="text-link">My role &amp; impact ↗</span></div></Link>)}</div></section>
    <section className="partners-section"><p>Built with teams<br /><strong>around the world</strong></p><div className="partner-logos">{about.clients.map(client => <div key={client.name} className="partner-logo"><img src={client.logo} alt={client.name} loading="lazy" /><span>{client.name}</span></div>)}</div></section>
    <section className="home-section about-journal"><div className="journal"><p className="eyebrow">THOUGHTS &amp; FIELD NOTES</p><h2>From the dev log</h2>{blog && <Link href={`/blog/${blog.id}`} className="journal-card"><img src={blog.image} alt={blog.alt} loading="lazy" /><div><span className="eyebrow">UNITY / DEVELOPMENT</span><h3>{blog.title}</h3><p>Practical lessons and workflows from building games with Unity.</p><span className="text-link">Read the blog ↗</span></div></Link>}</div><div className="about-developer"><p className="eyebrow">BEHIND THE GAMES</p><h2>Meet the developer</h2><div className="developer-intro"><img src={sidebar.avatar} alt={sidebar.name} loading="lazy" /><div><h3>{sidebar.name}</h3><span>Senior Game Developer · Unity &amp; C#</span></div></div><p>{about.description[0]}</p><Link className="text-link" href="/resume">More about my experience ↗</Link></div></section>
    <Testimonials testimonials={about.testimonials} />
    <section className="home-section home-contact" id="start-a-conversation"><div><p className="eyebrow">LET&apos;S CONNECT</p><h2>Let&apos;s build<br />something <em>playable.</em></h2><p>Have a project in mind or a team that needs a game developer? I&apos;d love to hear from you.</p><div className="social-links">{sidebar.contacts.map(contact => <a href={contact.link} key={contact.type} {...(contact.type !== "email" ? {target:"_blank",rel:"noopener noreferrer"} : {})}>{contact.title} ↗</a>)}</div></div><ContactForm /></section>
  </div>;
}
