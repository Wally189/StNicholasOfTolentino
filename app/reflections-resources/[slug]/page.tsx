import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { formatDisplayDate, getReflectionBySlug, getReflections } from "@/lib/content";

export function generateStaticParams() {
  return getReflections().map((item) => ({ slug: item.slug }));
}

export default async function ReflectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reflection = getReflectionBySlug(slug);

  if (!reflection) {
    notFound();
  }

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>{reflection.frontmatter.title}</h1>
          <p className="muted">
            {reflection.frontmatter.author ? `${reflection.frontmatter.author} · ` : ""}
            {formatDisplayDate(reflection.frontmatter.date)}
          </p>
          <p>{reflection.frontmatter.summary}</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width aside-layout">
          <Markdown content={reflection.content} />
          <aside className="sidebar-list">
            <h2>Category</h2>
            <p>{reflection.frontmatter.category}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
