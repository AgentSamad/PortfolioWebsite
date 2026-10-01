import { notFound } from "next/navigation";
import PageFade from "@/components/shared/PageFade";
import BlogPost from "@/components/blog/BlogPost";
import { getBlog, getBlogs } from "@/lib/data";
import { convertMarkdownToHTML, loadMarkdownFile } from "@/lib/markdown";

export function generateStaticParams() {
  return getBlogs().map((blog) => ({ id: String(blog.id) }));
}

export default async function BlogPostRoute({ params }) {
  const { id } = await params;
  const blog = getBlog(id);
  if (!blog) notFound();

  const markdown = loadMarkdownFile(blog.markdown);
  const html = convertMarkdownToHTML(markdown);
  const related = getBlogs()
    .filter((item) => String(item.id) !== String(id))
    .slice(0, 2);

  return (
    <PageFade>
      <BlogPost blog={blog} html={html} related={related} />
    </PageFade>
  );
}
