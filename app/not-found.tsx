import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="site-width">
        <h1>Page not found</h1>
        <p>The requested page could not be found.</p>
        <p>
          <Link href="/">Return to homepage</Link>
        </p>
      </div>
    </section>
  );
}
