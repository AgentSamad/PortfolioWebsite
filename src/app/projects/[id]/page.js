import { notFound } from "next/navigation";
import PageFade from "@/components/shared/PageFade";
import ProjectDetail from "@/components/portfolio/ProjectDetail";
import { getPortfolio, getPortfolioItem } from "@/lib/data";

export function generateStaticParams() {
  return getPortfolio().map((item) => ({ id: String(item.id) }));
}

export default async function ProjectDetailRoute({ params }) {
  const { id } = await params;
  const item = getPortfolioItem(id);
  if (!item) notFound();

  return (
    <PageFade>
      <ProjectDetail item={item} />
    </PageFade>
  );
}
