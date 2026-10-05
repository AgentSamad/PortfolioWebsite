import PageFade from "@/components/shared/PageFade";
import HomePage from "@/components/home/HomePage";
import { getContent, getPortfolio, getBlogs } from "@/lib/data";

export default function Page() {
  const content = getContent();

  return (
    <PageFade>
      <HomePage content={content} items={getPortfolio()} blogs={getBlogs()} />
    </PageFade>
  );
}
