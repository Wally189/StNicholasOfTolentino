import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { formatDisplayDate, getEventBySlug, getEvents } from "@/lib/content";

export function generateStaticParams() {
  return getEvents().map((item) => ({ slug: item.slug }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>{event.frontmatter.title}</h1>
          <p className="muted">{formatDisplayDate(event.frontmatter.date)} at {event.frontmatter.startTime}</p>
          <p>{event.frontmatter.location}</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <Markdown content={event.content} />
        </div>
      </section>
    </>
  );
}
