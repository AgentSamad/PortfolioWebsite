import Link from "next/link";
import TypingText from "./TypingText";
import ClientsMarquee from "./ClientsMarquee";
import Testimonials from "./Testimonials";
import CollaborateCTA from "@/components/shared/CollaborateCTA";

const serviceIcons = {
  "Game Development": "sports_esports",
  "Editor Tooling": "build",
  "Mobile Development": "phone_android",
  "Technical Leadership": "groups",
};

export default function HomePage({ content }) {
  const about = content?.about;

  return (
    <>
      <section id="home" className="space-y-8 mb-16 animate-on-scroll">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Transforming Your
            <br />
            Ideas into <TypingText />
          </h1>
          <p
            id="hero-description"
            className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
          >
            Unity and C# engineer with 8 years of commercial game development
            across PC and mobile. Specializing in gameplay systems, editor
            tooling, and multiplayer architecture.
          </p>

          <div className="grid grid-cols-3 pt-6 statistics-grid">
            <div>
              <div
                id="stat-years"
                className="text-4xl md:text-5xl font-bold text-white dark:text-white"
              >
                +8
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400 mt-2">
                Years
                <br />
                of Experience
              </div>
            </div>
            <div>
              <div
                id="stat-projects"
                className="text-4xl md:text-5xl font-bold text-white dark:text-white"
              >
                +50
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400 mt-2">
                Games
                <br />
                Shipped
              </div>
            </div>
            <div>
              <div
                id="stat-clients"
                className="text-4xl md:text-5xl font-bold text-white dark:text-white"
              >
                50M+
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400 mt-2">
                Total
                <br />
                Installs
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <Link
              href="/resume"
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-hover transition shadow-lg shadow-primary/30"
            >
              Resume
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-1 text-sm font-medium text-white dark:text-white hover:text-primary transition cursor-pointer"
            >
              My Work{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
          <p className="text-lg text-white dark:text-white mb-4">
            Relied on by companies near, far, and worldwide
          </p>
          <ClientsMarquee clients={about?.clients || []} />
        </div>
      </section>

      <section id="about" className="mb-16 animate-on-scroll">
        <h2 className="text-3xl font-bold mb-6" id="about-title">
          {about?.title || "About me"}
        </h2>
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(about?.services || []).map((service, index) => (
            <div
              key={service.title}
              className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 card-hover animate-stagger"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {serviceIcons[service.title] || "code"}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">{service.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials testimonials={about?.testimonials || []} />
      <CollaborateCTA />
    </>
  );
}
