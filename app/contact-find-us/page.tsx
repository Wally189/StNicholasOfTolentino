export default function ContactFindUsPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Contact / Find Us</h1>
          <p>Phone, email, office times, presbytery details, map, and local travel information.</p>
        </div>
      </header>

      <section className="section">
        <div className="site-width inline-grid">
          <div className="typographic-block">
            <h2>Contact Details</h2>
            <p>Parish Office: 0117 955 1123</p>
            <p>Email: stnicks.easton@cliftondiocese.com</p>
            <p>Address: Lawfords Gate, Easton, Bristol BS5 0RE</p>
            <p>Presbytery: located beside the main church entrance.</p>
          </div>

          <div className="typographic-block">
            <h2>Office Hours and Priest Availability</h2>
            <p>Office opening: Tuesday-Friday, 10:00-14:00</p>
            <p>Priest availability: by appointment, or after weekday Mass.</p>
            <p>Parking: limited on-site spaces and nearby street parking.</p>
            <p>Transport: bus routes via Stapleton Road and Old Market.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width">
          <iframe
            title="Map to St Nicholas of Tolentino RC Church"
            className="map-frame"
            loading="lazy"
            src="https://www.google.com/maps?q=St+Nicholas+of+Tolentino+RC+Church+Easton+Bristol&output=embed"
          />
        </div>
      </section>
    </>
  );
}
