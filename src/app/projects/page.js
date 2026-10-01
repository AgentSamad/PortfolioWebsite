import PageFade from "@/components/shared/PageFade";
import PortfolioPage from "@/components/portfolio/PortfolioPage";
import { getPortfolio } from "@/lib/data";

export default function ProjectsRoute() {
  const items = getPortfolio();

  return (
    <PageFade>
      <PortfolioPage items={items} />
    </PageFade>
  );
}
