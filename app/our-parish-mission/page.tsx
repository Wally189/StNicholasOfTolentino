import Link from "next/link";

export default function MissionPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Our Parish Mission</h1>
          <p>
            Our mission is rooted in the Gospel: to worship God faithfully, serve our neighbours generously, and grow as
            one body in Christ.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>Mission Statements</h2>
            <p>To be a welcoming church where every person is known, heard, and accompanied.</p>
            <p>To celebrate reverent liturgy and nourish faith through Scripture, catechesis, and prayer.</p>
            <p>To stand with the poor, migrants, and those who feel forgotten in our city.</p>
            <p>To work for healing, unity, and reconciliation across cultures and generations.</p>
          </div>
          <div className="typographic-block">
            <h2>How We Live It</h2>
            <ul>
              <li>Weekly Eucharist, adoration, and sacramental life.</li>
              <li>Foodbank and practical support through St Nicholas Bread.</li>
              <li>Partnership with school families and youth formation.</li>
              <li>Outreach with Borderlands and local community groups.</li>
            </ul>
            <p>
              See related pages: <Link href="/foodbank">Foodbank</Link>, <Link href="/borderlands">Borderlands</Link>,{" "}
              <Link href="/school">School</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
