import Link from "next/link";
import { formatDisplayDate, getBulletins, getEvents, getNewsItems } from "@/lib/content";

const sections = [
  { label: "Highlights", value: "highlights" },
  { label: "Diary", value: "diary" },
  { label: "Bulletins", value: "bulletins" }
];

export default function ParishNewsPage() {
  const highlights = getNewsItems();
  const events = getEvents().sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const bulletins = getBulletins();

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Parish News</h1>
          <p>
            Highlights of the Week, Parish Diary, and Newsletters/Bulletins. Use the filters to move quickly to the
            section you need.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="site-width">
          <div className="cta-row" aria-label="News filters">
            {sections.map((section) => (
              <a key={section.value} href={`#${section.value}`} className="button">
                {section.label}
              </a>
            ))}
          </div>

          <section id="highlights" className="typographic-block">
            <h2>Highlights</h2>
            <ul className="editorial-list" aria-label="Highlights list">
              {highlights.map((item) => (
                <li key={item.slug}>
                  <span className="item-meta">{formatDisplayDate(item.date)}</span>
                  <Link href={`/parish-news/${item.slug}`}>{item.title}</Link>
                  <span className="muted">
                    {item.category === "highlights" ? "Highlights of the Week" : "Parish update"}
                  </span>
                  <span>{item.summary}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="diary" className="typographic-block">
            <h2>Diary</h2>
            <ul className="editorial-list" aria-label="Diary list">
              {events.map((event) => (
                <li key={event.slug}>
                  <span className="item-meta">{formatDisplayDate(event.date)} at {event.startTime}</span>
                  <Link href={`/parish-news/diary/${event.slug}`}>{event.title}</Link>
                  <span>{event.location}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="bulletins" className="typographic-block">
            <h2>Bulletins</h2>
            <ul className="editorial-list" aria-label="Bulletin list">
              {bulletins.map((bulletin) => (
                <li key={bulletin.slug}>
                  <span className="item-meta">{formatDisplayDate(bulletin.date)}</span>
                  <Link href={`/parish-news/bulletins/${bulletin.slug}`}>{bulletin.title}</Link>
                  <span>{bulletin.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </>
  );
}
