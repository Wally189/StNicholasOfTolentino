import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Callout } from "@/components/callout";
import { formatDisplayDate, getBulletins, getEvents, getNewsItems } from "@/lib/content";

export default function HomePage() {
  const events = getEvents()
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 4);
  const latestBulletin = getBulletins()[0];
  const highlights = getNewsItems()
    .filter((item) => item.category === "highlights")
    .slice(0, 2);

  return (
    <>
      <section className="hero">
        <div className="site-width hero-grid">
          <div>
            <p className="hero-kicker">Parish Church in Easton, Bristol</p>
            <h1>St Nicholas of Tolentino RC Church, Easton (Bristol)</h1>
            <p>
              A welcoming Catholic parish rooted in prayer, service, and hope. We gather for liturgy, accompany one
              another in faith, and work for dignity among the poor and those on the margins.
            </p>
            <div className="quick-times" aria-label="Next service times">
              <p>
                <strong>Next Service:</strong> Thursday 18:00 Adoration and Reconciliation
              </p>
              <p>
                <strong>Sunday Mass:</strong> 10:30 Family Mass
              </p>
            </div>
            <div className="cta-row">
              <Link href="/mass-times" className="button primary">
                Mass Times
              </Link>
              <Link href="/contact-find-us" className="button">
                Contact / Find Us
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/images/church-exterior.jpg"
              alt="St Nicholas of Tolentino RC Church exterior"
              width={1200}
              height={900}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width editorial-columns">
          <div>
            <SectionHeading marker="Welcome" title="Welcome to St Nick's" />
            <p>
              Whether you are a long-standing parishioner, new to Easton, or visiting, you are warmly welcome. We are
              a praying community centred on the Eucharist, the Word of God, and care for one another.
            </p>
          </div>
          <div>
            <SectionHeading marker="Community" title="Our Community" />
            <p>
              We are a diverse and inclusive parish serving many cultures and generations. Our mission is unity in
              Christ, practical support for people in hardship, and the work of healing and hope across our
              neighbourhood.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width">
          <SectionHeading marker="This Week" title="This Week at a Glance" intro="Diary and liturgy updates" />
          <ul className="editorial-list" aria-label="Weekly events list">
            {events.map((event) => (
              <li key={event.slug}>
                <span className="item-meta">{formatDisplayDate(event.date)} at {event.startTime}</span>
                <strong>{event.title}</strong>
                <span>{event.location}</span>
                <Link href={`/parish-news/diary/${event.slug}`}>View event details</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="site-width inline-grid">
          <div>
            <SectionHeading marker="Liturgy" title="Mass Times" />
            <div className="typographic-block">
              <p>Saturday Vigil 18:00</p>
              <p>Sunday 10:30 (Family Mass)</p>
              <p>Weekdays: Wednesday and Thursday 09:30 (see full schedule)</p>
              <Link href="/mass-times">Full Mass and sacrament schedule</Link>
            </div>
          </div>
          <div>
            <SectionHeading marker="News" title="Parish News and Bulletin" />
            <div className="typographic-block">
              {latestBulletin ? (
                <p>
                  <strong>Latest Bulletin:</strong>{" "}
                  <Link href={`/parish-news/bulletins/${latestBulletin.slug}`}>{latestBulletin.title}</Link>
                </p>
              ) : null}
              {highlights.map((item) => (
                <p key={item.slug}>
                  <Link href={`/parish-news/${item.slug}`}>{item.title}</Link>
                </p>
              ))}
              <Link href="/parish-news">All news, diary, and bulletins</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width">
          <Callout title="Safeguarding" tone="priority">
            <p>
              Safeguarding is central to our parish mission. If you are worried about a child or vulnerable adult,
              please report concerns immediately through parish and diocesan routes.
            </p>
            <p>
              <Link href="/safeguarding">Safeguarding contacts and reporting information</Link>
            </p>
          </Callout>
        </div>
      </section>

      <section className="section">
        <div className="site-width inline-grid">
          <div>
            <SectionHeading marker="Foodbank" title="Foodbank / Support - St Nicholas Bread" />
            <p>
              St Nicholas Bread offers emergency support and community food parcels for local families and individuals.
              Find opening times, referral guidance, and ways to volunteer or donate.
            </p>
            <p>
              <Link href="/foodbank">Foodbank access and support options</Link>
            </p>
          </div>
          <div>
            <SectionHeading marker="Live" title="Live Stream" />
            <p>Join liturgy online when you cannot attend in person.</p>
            <div className="cta-row">
              <Link href="/live-stream" className="button">
                Open live stream page
              </Link>
              <a href="https://www.youtube.com" className="button" target="_blank" rel="noreferrer">
                Watch in new window
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
