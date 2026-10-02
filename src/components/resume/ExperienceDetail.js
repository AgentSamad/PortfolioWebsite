import Link from "next/link";
import { getCompanyName } from "@/lib/utils";

export default function ExperienceDetail({ experience, index }) {
  const company = getCompanyName(experience);
  const hasOverview = Boolean(experience.overview);
  const hasRole = Boolean(experience.myRole);
  const hasSkills = Boolean(experience.skillsAcquired);
  const hasImpact = Boolean(experience.impact);
  const hasLink = Boolean(experience.link);
  const useFallback = !hasOverview && experience.description?.length;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/resume"
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm">All Experiences</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        {experience.logo && (
          <img
            id="experience-logo"
            alt="Company Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl flex-shrink-0"
            src={experience.logo}
          />
        )}
        <h1
          id="experience-company"
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-white"
        >
          {company}
        </h1>
      </div>

      <div className="mb-8">
        <span id="experience-period" className="text-sm text-gray-400">
          {experience.period}
        </span>
      </div>

      {hasOverview && (
        <div id="experience-overview-section" className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">Overview</h2>
          <p id="experience-overview" className="text-gray-300 leading-relaxed">
            {experience.overview}
          </p>
        </div>
      )}

      {hasRole && (
        <div id="experience-role-section" className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">My Role</h2>
          <p id="experience-role" className="text-gray-300 leading-relaxed">
            {experience.myRole}
          </p>
        </div>
      )}

      {hasSkills && (
        <div id="experience-skills-section" className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">Skills Acquired</h2>
          <p id="experience-skills" className="text-gray-300 leading-relaxed">
            {experience.skillsAcquired}
          </p>
        </div>
      )}

      {hasImpact && (
        <div id="experience-impact-section" className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">Impact</h2>
          <p id="experience-impact" className="text-gray-300 leading-relaxed">
            {experience.impact}
          </p>
        </div>
      )}

      {useFallback && (
        <div
          id="experience-description"
          className="mb-16 text-gray-300 prose prose-lg dark:prose-invert max-w-none"
        >
          {experience.description
            .filter((item) => item && item.trim())
            .map((item, i) => {
              if (item.match(/^[A-Z][^•\-\*]*:$/)) {
                return (
                  <h3
                    key={`${index}-h-${i}`}
                    className="text-xl font-bold mt-6 mb-3 text-white"
                  >
                    {item.replace(":", "")}
                  </h3>
                );
              }
              return (
                <p
                  key={`${index}-p-${i}`}
                  className="mb-4 text-gray-300 leading-relaxed"
                >
                  {item.replace(/^[•\-\*]\s*/, "").trim()}
                </p>
              );
            })}
        </div>
      )}

      {hasLink && (
        <div id="experience-link-section" className="mb-16">
          <a
            id="experience-link"
            href={experience.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition shadow-lg shadow-primary/30"
          >
            Company Link
          </a>
        </div>
      )}
    </>
  );
}
