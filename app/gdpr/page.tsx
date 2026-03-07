import Link from "next/link";

export default function GdprPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>GDPR</h1>
          <p>Data protection and GDPR summary for this website.</p>
        </div>
      </header>

      <section className="section">
        <div className="site-width typographic-block">
          <p>This page gives a simple summary of data protection and GDPR context for this website.</p>
          <p>
            <strong>Who receives messages:</strong> Messages sent using the contact route are processed via Formspree.
          </p>
          <p>
            <strong>What is collected:</strong> Name, email address, and message text.
          </p>
          <p>
            <strong>Purpose:</strong> To respond to direct enquiries.
          </p>
          <p>
            <strong>Retention:</strong> Data is retained only as long as needed for correspondence and basic records.
          </p>
          <p>
            <strong>Your rights:</strong> You may request access, correction, or deletion of personal data.
          </p>
          <p>
            <strong>Contact route:</strong> Use the <Link href="/contact-find-us">Contact page</Link> to make a
            request.
          </p>
          <p>
            <strong>Related pages:</strong> <Link href="/gdpr">GDPR</Link> | <Link href="/privacy">Privacy</Link> |{" "}
            <Link href="/terms">Terms</Link>.
          </p>
          <p>
            <strong>United Kingdom:</strong>{" "}
            <a href="https://www.legislation.gov.uk/eur/2016/679/contents" rel="noreferrer">
              UK GDPR text on legislation.gov.uk
            </a>{" "}
            and the{" "}
            <a href="https://www.legislation.gov.uk/ukpga/2018/12/contents" rel="noreferrer">
              Data Protection Act 2018 (UK)
            </a>
            .
          </p>
          <p>
            <strong>Ireland:</strong>{" "}
            <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng" rel="noreferrer">
              EU GDPR text on EUR-Lex
            </a>{" "}
            and the{" "}
            <a href="https://www.irishstatutebook.ie/eli/2018/act/7/enacted/en/html" rel="noreferrer">
              Data Protection Act 2018 (Ireland)
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
