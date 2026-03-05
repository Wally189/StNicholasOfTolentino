import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/mass-times", label: "Mass Times" },
  { href: "/parish-news", label: "Parish News" },
  { href: "/our-parish-mission", label: "Our Parish Mission" },
  { href: "/safeguarding", label: "Safeguarding" },
  { href: "/foodbank", label: "Foodbank - St Nicholas Bread" },
  { href: "/reflections-resources", label: "Reflections & Resources" },
  { href: "/live-stream", label: "Live Stream" },
  { href: "/contact-find-us", label: "Contact / Find Us" },
  { href: "/gallery", label: "Gallery" }
];

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Site header">
      <div className="site-width header-inner">
        <Link href="/" className="brand">
          <span className="brand-kicker">RC Parish, Easton</span>
          <span className="brand-title">St Nicholas of Tolentino</span>
        </Link>
        <nav aria-label="Primary navigation" className="main-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
