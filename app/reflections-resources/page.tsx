import Link from "next/link";
import { formatDisplayDate, getReflections } from "@/lib/content";

const categories = ["Spiritual Reflection", "Pope Francis' Words", "Penitential Rites", "Bidding Prayers"] as const;

export default function ReflectionsPage() {
  const reflections = getReflections();

  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Reflections and Resources</h1>
          <p>
            Spiritual Reflection, Pope Francis' Words, Penitential Rites, and Bidding Prayers in a readable, prayerful
            format.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="site-width aside-layout">
          <div>
            {categories.map((category) => (
              <section key={category} id={encodeURIComponent(category)} className="typographic-block">
                <h2>{category}</h2>
                <ul className="editorial-list" aria-label={`${category} posts`}>
                  {reflections
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <li key={item.slug}>
                        <span className="item-meta">{formatDisplayDate(item.date)}</span>
                        <Link href={`/reflections-resources/${item.slug}`}>{item.title}</Link>
                        <span>{item.summary}</span>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>

          <aside className="sidebar-list" aria-label="Reflection categories">
            <h2>Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <a href={`#${encodeURIComponent(category)}`}>{category}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
