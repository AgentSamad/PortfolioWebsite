import PageFade from "@/components/shared/PageFade";
import BlogPage from "@/components/blog/BlogPage";
import { getBlogs } from "@/lib/data";

export default function BlogRoute() {
  const blogs = getBlogs();

  return (
    <PageFade>
      <BlogPage blogs={blogs} />
    </PageFade>
  );
}
