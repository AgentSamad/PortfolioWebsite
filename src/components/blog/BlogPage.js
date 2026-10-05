import Link from "next/link";
import { formatDate } from "@/lib/utils";
import CollaborateCTA from "@/components/shared/CollaborateCTA";
export default function BlogPage({ blogs }) {
  const [featured, ...posts] = blogs;
  return <>
    <section id="blog" className="blog-design">
      <div className="blog-heading"><p className="eyebrow">THE DEV LOG / NOTES FROM THE BUILD</p><h1>Ideas, experiments,<br />and <em>better games.</em></h1><p>Unity workflows, engine discoveries, and practical notes for the people who make games.</p></div>
      {featured && <article className="blog-feature">
        <Link href={`/blog/${featured.id}`} className="blog-feature-art"><img src={featured.image} alt={featured.alt || featured.title} fetchPriority="high" /><span>FEATURED NOTE ↗</span></Link>
        <div className="blog-feature-copy"><p className="eyebrow">{featured.category} / {featured.readingTime || "Developer notes"}</p><h2><Link href={`/blog/${featured.id}`}>{featured.title}</Link></h2><p>{featured.description}</p><span className="blog-date">{formatDate(featured.date)}</span><div className="blog-feature-actions"><Link className="button-primary" href={`/blog/${featured.id}`}>Read the article ↗</Link>{featured.watchUrl && <a className="text-link" href={featured.watchUrl} target="_blank" rel="noopener noreferrer">Watch Unity&apos;s walkthrough ↗</a>}</div></div>
      </article>}
      <div className="blog-archive-heading"><h2>More from the notebook</h2><span>{blogs.length} articles / Unity &amp; game development</span></div>
      <div className="blog-notebook">{posts.map(blog => <Link className="blog-note" key={blog.id} href={`/blog/${blog.id}`}><img src={blog.image} alt={blog.alt || blog.title} loading="lazy" /><div><p className="eyebrow">{blog.category}</p><h3>{blog.title}</h3><p>{blog.description}</p><span className="blog-date">{formatDate(blog.date)}</span></div><span className="blog-note-arrow" aria-hidden="true">↗</span></Link>)}</div>
    </section>
    <CollaborateCTA />
  </>;
}
