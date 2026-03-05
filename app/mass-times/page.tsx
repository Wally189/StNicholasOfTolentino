import Link from "next/link";

export default function MassTimesPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Mass Times</h1>
          <p>
            Weekly Mass schedule, reconciliation, and adoration times. Check Parish News for feast day changes and holy
            day updates.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>Weekly Schedule</h2>
            <p>Wednesday 09:30 - Morning Mass</p>
            <p>Thursday 09:30 - Morning Mass</p>
            <p>Saturday 18:00 - Vigil Mass</p>
            <p>Sunday 10:30 - Parish Mass (children's liturgy most weeks)</p>
          </div>
          <div className="typographic-block">
            <h2>Reconciliation and Adoration</h2>
            <p>Thursday 18:00 - Adoration</p>
            <p>Thursday 18:30-19:00 - Reconciliation</p>
            <p>Saturday 17:20-17:45 - Reconciliation before Vigil</p>
            <p>Home visits for confessions and Communion by arrangement.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width inline-grid">
          <div className="callout">
            <h3>Today</h3>
            <p>Wednesday 4 March 2026: Morning Mass at 09:30, followed by tea in the hall.</p>
          </div>
          <div className="callout">
            <h3>Next Sunday</h3>
            <p>Sunday 8 March 2026: Family Mass at 10:30. Readers and music teams arrive by 10:00.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width">
          <p>
            For holy days and funeral notices, visit <Link href="/parish-news">Parish News</Link> or contact the parish
            office.
          </p>
        </div>
      </section>
    </>
  );
}
