import Link from "next/link";
import { formatDisplayDate, getBulletins, getEvents, getNewsItems } from "@/lib/content";

type Filter = "highlights" | "diary" | "bulletins";

const filters: { label: string; value: Filter }[] = [
  { label: "Highlights", value: "highlights" },
  { label: "Diary", value: "diary" },
  { label: "Bulletins", value: "bulletins" }
];

export default function ParishNewsPage({
  searchParams
}: {
  searchParams?: {
    filter?: Filter;
  };
}) {
  const rawFilter = searchParams?.filter;
  const selected: Filter =
    rawFilter === "highlights" || rawFilter === "diary" || rawFilter === "bulletins" ? rawFilter : "highlights";

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
            {filters.map((filter) => (
              <Link
                key={filter.value}
                href={`/parish-news?filter=${filter.value}`}
                className={`button${selected === filter.value ? " primary" : ""}`}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          {selected === "highlights" ? (
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
          ) : null}

          {selected === "diary" ? (
            <ul className="editorial-list" aria-label="Diary list">
              {events.map((event) => (
                <li key={event.slug}>
                  <span className="item-meta">{formatDisplayDate(event.date)} at {event.startTime}</span>
                  <Link href={`/parish-news/diary/${event.slug}`}>{event.title}</Link>
                  <span>{event.location}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {selected === "bulletins" ? (
            <ul className="editorial-list" aria-label="Bulletin list">
              {bulletins.map((bulletin) => (
                <li key={bulletin.slug}>
                  <span className="item-meta">{formatDisplayDate(bulletin.date)}</span>
                  <Link href={`/parish-news/bulletins/${bulletin.slug}`}>{bulletin.title}</Link>
                  <span>{bulletin.summary}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  );
}
