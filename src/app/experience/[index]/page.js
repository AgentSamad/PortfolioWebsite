import { notFound } from "next/navigation";
import PageFade from "@/components/shared/PageFade";
import ExperienceDetail from "@/components/resume/ExperienceDetail";
import { getContent, getExperience } from "@/lib/data";

export function generateStaticParams() {
  const content = getContent();
  return (content.resume?.experience || []).map((_, index) => ({
    index: String(index),
  }));
}

export default async function ExperienceRoute({ params }) {
  const { index } = await params;
  const experience = getExperience(index);
  if (!experience) notFound();

  return (
    <PageFade>
      <ExperienceDetail experience={experience} index={Number(index)} />
    </PageFade>
  );
}
