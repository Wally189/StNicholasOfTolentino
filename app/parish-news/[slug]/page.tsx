import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { formatDisplayDate, getNewsBySlug, getNewsItems } from "@/lib/content";

export function generateStaticParams() {
  return getNewsItems().map((item) => ({ slug: item.slug }));
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>{item.frontmatter.title}</h1>
          <p className="muted">{formatDisplayDate(item.frontmatter.date)}</p>
          <p>{item.frontmatter.summary}</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <Markdown content={item.content} />
        </div>
      </section>
    </>
  );
}
