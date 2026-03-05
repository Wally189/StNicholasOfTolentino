import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { formatDisplayDate, getBulletinBySlug, getBulletins } from "@/lib/content";

export function generateStaticParams() {
  return getBulletins().map((item) => ({ slug: item.slug }));
}

export default async function BulletinDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bulletin = getBulletinBySlug(slug);

  if (!bulletin) {
    notFound();
  }

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>{bulletin.frontmatter.title}</h1>
          <p className="muted">{formatDisplayDate(bulletin.frontmatter.date)}</p>
          <p>{bulletin.frontmatter.summary}</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <div className="typographic-block">
            {bulletin.frontmatter.fileUrl ? (
              <p>
                <Link href={bulletin.frontmatter.fileUrl}>Download bulletin PDF</Link>
              </p>
            ) : null}
          </div>
          <Markdown content={bulletin.content} />
        </div>
      </section>
    </>
  );
}
