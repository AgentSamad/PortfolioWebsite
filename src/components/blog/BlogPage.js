import Link from "next/link";
import { formatDate } from "@/lib/utils";
import CollaborateCTA from "@/components/shared/CollaborateCTA";

export default function BlogPage({ blogs }) {
  return (
    <>
      <section id="blog" className="mb-16 animate-on-scroll">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">Design Thoughts and</span>{" "}
            <span className="text-primary">Perspectives</span>
          </h1>
        </div>
        <div id="blog-grid" className="grid grid-cols-1 gap-6">
          {blogs.map((blog, index) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="bg-card-light dark:bg-card-dark rounded-2xl p-4 border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition card-hover block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="rounded-xl overflow-hidden h-40 mb-4 relative">
                <img
                  alt={blog.alt || blog.title}
                  className="w-full h-full object-cover"
                  src={blog.image}
                />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">
                  {formatDate(blog.date)}
                </div>
                <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">
                  {blog.category}
                </div>
              </div>
              <h3 className="font-bold text-lg leading-snug mb-1">{blog.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {blog.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <CollaborateCTA />
    </>
  );
}
