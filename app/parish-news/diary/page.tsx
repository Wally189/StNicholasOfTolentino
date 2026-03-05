import Link from "next/link";
import { formatDisplayDate, getEvents } from "@/lib/content";

export default function DiaryIndexPage() {
  const events = getEvents().sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Parish Diary</h1>
          <p>Upcoming liturgy, prayer, and community events.</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <ul className="editorial-list" aria-label="Parish diary events">
            {events.map((event) => (
              <li key={event.slug}>
                <span className="item-meta">{formatDisplayDate(event.date)} at {event.startTime}</span>
                <Link href={`/parish-news/diary/${event.slug}`}>{event.title}</Link>
                <span>{event.location}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
