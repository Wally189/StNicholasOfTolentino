import Link from "next/link";

export default function FoodbankPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Foodbank - St Nicholas Bread</h1>
          <p>
            St Nicholas Bread supports local households with food parcels, welcome, and signposting to practical help.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>How to Access Support</h2>
            <p>Collection point: Parish Hall, Lawfords Gate entrance.</p>
            <p>Opening times: Tuesday and Friday, 11:00-13:00.</p>
            <p>Referral: self-referral accepted; partner agency referrals welcome.</p>
            <p>Please contact the parish office if a home delivery is needed.</p>
          </div>
          <div className="typographic-block">
            <h2>How to Help</h2>
            <ul>
              <li>Donate long-life food and toiletries at church collection points.</li>
              <li>Volunteer for sorting, packing, and hospitality.</li>
              <li>Contribute financially for fresh produce and emergency essentials.</li>
            </ul>
            <p>
              <a href="https://www.justgiving.com" target="_blank" rel="noreferrer">
                Donation page (replace with parish link)
              </a>
            </p>
            <p>
              See parish partners: <Link href="/borderlands">Borderlands</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
