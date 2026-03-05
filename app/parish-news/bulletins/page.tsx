import Link from "next/link";
import { formatDisplayDate, getBulletins } from "@/lib/content";

export default function BulletinsIndexPage() {
  const bulletins = getBulletins();

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Newsletters / Bulletins</h1>
          <p>Archive of weekly parish bulletins listed by date.</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <ul className="editorial-list" aria-label="Bulletin archive">
            {bulletins.map((bulletin) => (
              <li key={bulletin.slug}>
                <span className="item-meta">{formatDisplayDate(bulletin.date)}</span>
                <Link href={`/parish-news/bulletins/${bulletin.slug}`}>{bulletin.title}</Link>
                <span>{bulletin.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
