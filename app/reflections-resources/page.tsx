import Link from "next/link";
import { formatDisplayDate, getReflections } from "@/lib/content";

const categories = ["Spiritual Reflection", "Pope Francis' Words", "Penitential Rites", "Bidding Prayers"] as const;

type ReflectionCategory = (typeof categories)[number];

export default function ReflectionsPage({
  searchParams
}: {
  searchParams?: {
    category?: ReflectionCategory;
  };
}) {
  const rawCategory = searchParams?.category;
  const selected: ReflectionCategory = categories.includes(rawCategory as ReflectionCategory)
    ? (rawCategory as ReflectionCategory)
    : "Spiritual Reflection";

  const reflections = getReflections().filter((item) => item.category === selected);

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
            <ul className="editorial-list" aria-label="Reflection posts">
              {reflections.map((item) => (
                <li key={item.slug}>
                  <span className="item-meta">{formatDisplayDate(item.date)}</span>
                  <Link href={`/reflections-resources/${item.slug}`}>{item.title}</Link>
                  <span>{item.summary}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="sidebar-list" aria-label="Reflection categories">
            <h2>Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <Link href={`/reflections-resources?category=${encodeURIComponent(category)}`}>{category}</Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
