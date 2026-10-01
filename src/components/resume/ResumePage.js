"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  getCompanyName,
  getExperienceSummary,
} from "@/lib/utils";
import CollaborateCTA from "@/components/shared/CollaborateCTA";

function SkillsList({ skills }) {
  const listRef = useRef(null);

  useEffect(() => {
    const skillsList = listRef.current;
    if (!skillsList) return undefined;

    const skillBars = skillsList.querySelectorAll(".skill-bar");
    const skillPercentages = skillsList.querySelectorAll(".skill-percentage");
    if (!skillBars.length) return undefined;

    const animateSkills = () => {
      if (skillsList.classList.contains("skills-animated")) return;
      skillsList.classList.add("skills-animated");

      skillBars.forEach((bar, index) => {
        const percentage = parseInt(bar.getAttribute("data-percentage"), 10);
        const percentageEl = skillPercentages[index];

        setTimeout(() => {
          bar.style.width = `${percentage}%`;
          let current = 0;
          const increment = percentage / 50;
          const interval = setInterval(() => {
            current += increment;
            if (current >= percentage) {
              current = percentage;
              clearInterval(interval);
            }
            if (percentageEl) {
              percentageEl.textContent = `${Math.round(current)}%`;
            }
          }, 20);
        }, index * 100);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
    );

    const rect = skillsList.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      setTimeout(animateSkills, 100);
    } else {
      observer.observe(skillsList);
    }

    return () => observer.disconnect();
  }, [skills]);

  return (
    <div
      id="skills-list"
      ref={listRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {skills.map((skill, index) => (
        <div
          key={skill.name}
          className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">{skill.name}</span>
            <span className="skill-percentage text-xs text-gray-500 dark:text-gray-400">
              0%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="skill-bar bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "0%" }}
              data-percentage={skill.percentage}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResumePage({ resume }) {
  return (
    <>
      <section id="resume" className="mb-16 animate-on-scroll">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span id="resume-main-title" className="text-white">
              {resume?.mainTitle || "Over 8 Years of Game Development"}
            </span>{" "}
            <span className="text-primary">Expertise</span>
          </h1>
        </div>

        <div className="mb-12">
          <div id="experience-list" className="space-y-6">
            {(resume?.experience || []).map((exp, index) => {
              const company = getCompanyName(exp);
              const description = getExperienceSummary(exp);
              return (
                <Link
                  key={`${company}-${index}`}
                  href={`/experience/${index}`}
                  className="block bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 relative cursor-pointer hover:shadow-lg transition card-hover group overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-primary transition-all duration-300 group-hover:w-72 group-hover:h-1 rounded-full" />
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      {exp.logo && (
                        <img
                          src={exp.logo}
                          alt={`${company} Logo`}
                          className="w-12 h-12 object-contain rounded-lg mr-4"
                        />
                      )}
                      <h4 className="text-2xl font-bold text-white dark:text-white">
                        {company}
                      </h4>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-primary/50 flex-shrink-0">
                      <span className="material-symbols-outlined text-lg transform -rotate-45">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 dark:text-gray-300 mb-5 leading-relaxed">
                    {description}
                  </p>
                  <div className="text-xs text-gray-400 dark:text-gray-400">
                    {exp.period}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Education</h3>
          <div id="education-list" className="space-y-6">
            {(resume?.education || []).map((edu, index) => (
              <div
                key={`${edu.degree}-${index}`}
                className="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden group hover:shadow-lg transition"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-primary transition-all duration-300 group-hover:w-72 group-hover:h-1 rounded-full" />
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {edu.logo && (
                      <img
                        src={edu.logo}
                        alt="Education Logo"
                        className="w-12 h-12 object-contain rounded-lg mr-4"
                      />
                    )}
                    <h4 className="font-bold text-base">{edu.degree}</h4>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                    {edu.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span id="skills-main-title" className="text-white">
                {resume?.skillsTitle || "Skills"}
              </span>
            </h2>
          </div>
          <SkillsList skills={resume?.skills || []} />
        </div>

        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">Top-Tier Tools for</span>
              <br />
              <span className="text-primary">Exceptional Results</span>
            </h2>
          </div>
          <div
            id="tools-grid"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {(resume?.tools || []).map((tool, index) => (
              <a
                key={tool.name}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card-light dark:bg-card-dark p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3 hover:border-primary transition group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm leading-tight">{tool.name}</h4>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <CollaborateCTA />
    </>
  );
}
