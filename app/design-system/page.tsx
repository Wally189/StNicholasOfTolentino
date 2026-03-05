import Link from "next/link";

export default function DesignSystemPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Design System</h1>
          <p>Editorial visual language for St Nicholas of Tolentino parish website.</p>
        </div>
      </header>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>Typography Scale</h2>
            <p>Heading serif: Cormorant Garamond.</p>
            <p>Body sans: Source Sans 3.</p>
            <p>Body size: 17px base (mobile and desktop legible range 16-18px).</p>
            <p>H1: 2rem to 3.4rem, H2: 1.6rem to 2.3rem, H3: 1.2rem to 1.5rem.</p>
          </div>
          <div className="typographic-block">
            <h2>Color System</h2>
            <p>Background: warm stone tint.</p>
            <p>Primary ink: deep charcoal for readability.</p>
            <p>Accent tones: burgundy, indigo, stone (used sparingly for markers and emphasis).</p>
            <p>Dividers: soft line color to maintain calm hierarchy.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>Spacing and Layout</h2>
            <p>Site width: 1120px max with generous outer gutters.</p>
            <p>Section rhythm: 2.2rem to 4rem vertical spacing.</p>
            <p>Editorial lists and typographic blocks are preferred over repeated cards.</p>
          </div>
          <div className="typographic-block">
            <h2>Core Components</h2>
            <ul>
              <li>Buttons: primary and outline.</li>
              <li>Section headings with liturgical marker text.</li>
              <li>Editorial lists for diary, news, and bulletin archives.</li>
              <li>Priority safeguarding callout strip.</li>
              <li>Masonry gallery with keyboard-dismiss lightbox.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width">
          <p>
            Admin editing guide: <Link href="/admin-content">Parish Admin Content Guide</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
