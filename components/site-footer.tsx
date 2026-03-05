import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Parish footer">
      <div className="site-width footer-grid">
        <section>
          <h2>St Nicholas of Tolentino RC Church</h2>
          <p>Lawfords Gate, Easton, Bristol BS5 0RE</p>
          <p>Parish Office: 0117 955 1123</p>
          <p>Email: stnicks.easton@cliftondiocese.com</p>
          <p>Presbytery: next to church entrance on Lawfords Gate.</p>
        </section>
        <section>
          <h2>Office and Priest Availability</h2>
          <p>Office: Tuesday to Friday, 10:00-14:00</p>
          <p>Priest appointments: by arrangement after weekday Mass or by phone.</p>
          <p>Confessions and pastoral visits available for housebound parishioners.</p>
        </section>
        <section>
          <h2>Find Us and Parking</h2>
          <p>Bus routes stop on Stapleton Road and Old Market within walking distance.</p>
          <p>Limited on-site parking at the church and nearby street parking.</p>
          <Link href="/contact-find-us">Travel details and map</Link>
        </section>
        <section>
          <h2>Diocese and Community Links</h2>
          <ul className="footer-links">
            <li>
              <Link href="/diocese-links">Diocese of Clifton links</Link>
            </li>
            <li>
              <Link href="/school">St Nicholas Parish School</Link>
            </li>
            <li>
              <Link href="/borderlands">Borderlands outreach</Link>
            </li>
            <li>
              <Link href="/safeguarding">Safeguarding reporting routes</Link>
            </li>
          </ul>
        </section>
      </div>
      <div className="site-width legal-line">
        <p>
          Part of the Catholic Diocese of Clifton. Registered charity details, privacy notice, and safeguarding policy
          are available via diocesan links.
        </p>
        <p>
          A{" "}
          <a href="https://www.waylight-atlantic.co.uk" target="_blank" rel="noreferrer">
            Waylight-Atlantic
          </a>{" "}
          website
        </p>
      </div>
    </footer>
  );
}
