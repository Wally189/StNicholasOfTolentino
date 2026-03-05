import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { formatDisplayDate, getStaticPageBySlug } from "@/lib/content";

interface StaticPageContentProps {
  slug: string;
}

export function StaticPageContent({ slug }: StaticPageContentProps) {
  const page = getStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>{page.frontmatter.title}</h1>
          <p className="muted">Updated {formatDisplayDate(page.frontmatter.date)}</p>
          <p>{page.frontmatter.summary}</p>
        </div>
      </header>

      <section className="section">
        <div className="site-width">
          <Markdown content={page.content} />
        </div>
      </section>
    </>
  );
}
