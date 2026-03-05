import Link from "next/link";

export default function SafeguardingPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Safeguarding</h1>
          <p>
            Safeguarding children and vulnerable adults is a core responsibility of our parish and an essential part of
            our mission.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="site-width inline-grid">
          <div className="callout callout-priority">
            <h2>Immediate Concern</h2>
            <p>If someone is in immediate danger, call emergency services on 999.</p>
          </div>
          <div className="typographic-block">
            <h2>Parish Reporting Route</h2>
            <p>Parish Safeguarding Representative: safeguarding.stnicks@cliftondiocese.com</p>
            <p>Parish Office: 0117 955 1123</p>
            <p>Please report concerns as soon as possible. You will be listened to respectfully and confidentially.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>Diocesan Reporting Route</h2>
            <p>Clifton Diocese Safeguarding Office</p>
            <p>Email: safeguarding@cliftondiocese.com</p>
            <p>Tel: 0117 954 0993</p>
            <p>
              <a href="https://cliftondiocese.com/safeguarding" target="_blank" rel="noreferrer">
                Diocesan safeguarding guidance
              </a>
            </p>
          </div>
          <div className="typographic-block">
            <h2>Parish Statement</h2>
            <p>
              St Nicholas of Tolentino RC Church is committed to creating a safe environment for all. We follow diocesan
              safeguarding policy, safer recruitment standards, and training requirements for volunteers and staff.
            </p>
            <p>
              <Link href="/diocese-links">View diocesan links and policy resources</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
