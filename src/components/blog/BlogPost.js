import Link from "next/link";
import { formatDate } from "@/lib/utils";
import CollaborateCTA from "@/components/shared/CollaborateCTA";

export default function BlogPost({ blog, html, related }) {
  return (
    <>
      <div className="mb-6">
        <Link
          href="/blog"
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm">All Thoughts</span>
        </Link>
      </div>

      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <img
          id="blog-post-image"
          alt={blog.alt || blog.title}
          className="w-full h-[400px] md:h-[500px] object-cover"
          src={blog.image}
        />
      </div>

      <div className="mb-4">
        <p className="eyebrow">{blog.category}{blog.readingTime ? ` / ${blog.readingTime}` : ""}</p>
        <span id="blog-post-date" className="text-sm text-gray-400">
          {formatDate(blog.date)}
        </span>
      </div>

      <h1
        id="blog-post-title"
        className="text-4xl md:text-5xl font-bold mb-8 text-white"
      >
        {blog.title}
      </h1>

      <div
        id="blog-post-content"
        className="mb-16 text-gray-300 prose prose-lg dark:prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-primary prose-code:text-gray-200 prose-pre:bg-gray-900 prose-blockquote:text-gray-400"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {blog.watchUrl && <aside className="blog-watch-panel"><div><p className="eyebrow">LEARN BY WATCHING</p><h2>See Unity 6 in action</h2><p>Follow the official Unity Learn rendering course alongside these notes.</p></div><a href={blog.watchUrl} className="button-primary" target="_blank" rel="noopener noreferrer">Watch the walkthrough ↗</a></aside>}

      {related.length > 0 && (
        <div id="blog-post-related" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Related <span className="text-primary">Posts</span>
          </h2>
          <div
            id="blog-post-related-grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {related.map((relatedBlog) => (
              <Link
                key={relatedBlog.id}
                href={`/blog/${relatedBlog.id}`}
                className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition card-hover block"
              >
                <div className="rounded-t-2xl overflow-hidden h-48 relative">
                  <img
                    alt={relatedBlog.alt || relatedBlog.title}
                    className="w-full h-full object-cover"
                    src={relatedBlog.image}
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-400 mb-2">
                    {formatDate(relatedBlog.date)}
                  </div>
                  <h3 className="font-bold text-lg leading-snug text-white">
                    {relatedBlog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <CollaborateCTA />
    </>
  );
}
