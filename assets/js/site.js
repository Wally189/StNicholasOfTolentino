// Editable site content lives in /content. The public HTML files are only layout
// shells; this script loads the shared JSON content and maps it into those shells.
// Decap CMS writes to the same JSON files, so the admin collections map directly
// to the render functions below.

const CONTENT_FILES = {
  site: "content/settings/site.json",
  parish: "content/settings/parish.json",
  home: "content/pages/home.json",
  massServices: "content/pages/mass-services.json",
  parishLife: "content/pages/parish-life.json",
  newsReflections: "content/pages/news-reflections.json",
  gallery: "content/pages/gallery.json",
  newsletterArchive: "content/pages/newsletter-archive.json",
  aboutParish: "content/pages/about-the-parish.json",
  visitContact: "content/pages/visit-contact.json",
  donations: "content/pages/donations.json",
  safeguarding: "content/pages/safeguarding.json",
  legal: "content/pages/legal.json",
  news: "content/news/items.json",
  newsletters: "content/newsletters/items.json",
  documents: "content/documents/items.json"
};

const HERO_ROTATION_MS = 7000;
const GALLERY_ROTATION_MS = 5000;

const siteMap = [
  {
    id: "mass-services",
    label: "Mass & Services",
    href: "mass-services.html",
    children: [
      { label: "Mass Times", href: "mass-services.html#mass-times" },
      { label: "Livestream", href: "mass-services.html#livestream" },
      { label: "Confession / Sacraments", href: "mass-services.html#confession-sacraments" },
      { label: "Special Liturgies", href: "mass-services.html#special-liturgies" },
      { label: "Deaf Community Mass", href: "mass-services.html#deaf-community-mass" },
      { label: "LGBTQ+ Mass", href: "mass-services.html#lgbtq-mass" }
    ]
  },
  {
    id: "parish-life",
    label: "Parish Life",
    href: "parish-life.html",
    children: [
      { label: "Parish Groups", href: "parish-life.html#parish-groups" },
      { label: "Foodbank", href: "parish-life.html#foodbank" },
      { label: "Refugee / Borderlands Work", href: "parish-life.html#refugee-borderlands" },
      { label: "Parish Activities", href: "parish-life.html#parish-activities" },
      { label: "Gallery", href: "gallery.html" }
    ]
  },
  {
    id: "news-reflections",
    label: "News & Reflections",
    href: "news-reflections.html",
    children: [
      { label: "Weekly Highlights", href: "news-reflections.html#weekly-highlights" },
      { label: "Parish Newsletters", href: "newsletter-archive.html" },
      { label: "Bidding Prayers", href: "news-reflections.html#bidding-prayers" },
      { label: "Reflections", href: "news-reflections.html#reflections" },
      { label: "Vatican News / Pope", href: "news-reflections.html#vatican-news" }
    ]
  },
  {
    id: "about-parish",
    label: "About the Parish",
    href: "about-the-parish.html",
    children: [
      { label: "Mission and Ethos", href: "about-the-parish.html#mission-ethos" },
      { label: "St Nicholas of Tolentino", href: "about-the-parish.html#st-nicholas-of-tolentino" },
      { label: "Parish History", href: "about-the-parish.html#parish-history" },
      { label: "Parish Leadership", href: "about-the-parish.html#parish-leadership" },
      { label: "Synod Information", href: "about-the-parish.html#synod-information" },
      { label: "Safeguarding", href: "safeguarding.html" }
    ]
  },
  {
    id: "visit-contact",
    label: "Visit / Contact",
    href: "visit-contact.html",
    children: [
      { label: "Location & Map", href: "visit-contact.html#location-map" },
      { label: "Office Hours", href: "visit-contact.html#office-hours" },
      { label: "Contact Details", href: "visit-contact.html#contact-details" },
      { label: "Donations", href: "donations.html" }
    ]
  }
];

const jsonCache = new Map();

function createNode(tagName, options = {}) {
  const {
    className = "",
    text = null,
    attrs = {}
  } = options;
  const node = document.createElement(tagName);

  if (className) {
    node.className = className;
  }

  if (text !== null) {
    node.textContent = text;
  }

  Object.entries(attrs).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      node.setAttribute(name, value);
    }
  });

  return node;
}

function clearNode(node) {
  if (node) {
    node.replaceChildren();
  }
}

function normalizeTextList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter((value) => typeof value === "string" && value.trim() !== "");
}

function parseDateParts(dateValue) {
  if (typeof dateValue !== "string" || !dateValue.includes("-")) {
    return null;
  }

  const parts = dateValue.split("-").map((part) => Number.parseInt(part, 10));

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }

  return parts;
}

function formatDate(dateValue) {
  const parts = parseDateParts(dateValue);

  if (!parts) {
    return "";
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function sortByDateDesc(items) {
  return [...items].sort((left, right) => {
    const leftDate = left.date || "";
    const rightDate = right.date || "";
    return rightDate.localeCompare(leftDate);
  });
}

function isExternalUrl(href) {
  return /^https?:\/\//i.test(href);
}

function resolveSiteUrl(url) {
  if (typeof url !== "string") {
    return "";
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return "";
  }

  if (
    isExternalUrl(trimmedUrl) ||
    trimmedUrl.startsWith("mailto:") ||
    trimmedUrl.startsWith("tel:") ||
    trimmedUrl.startsWith("#") ||
    trimmedUrl.startsWith("data:")
  ) {
    return trimmedUrl;
  }

  return trimmedUrl.replace(/^\/+/, "");
}

function createLink(label, href, className = "inline-link") {
  const resolvedHref = resolveSiteUrl(href);
  const link = createNode("a", {
    className,
    text: label,
    attrs: { href: resolvedHref }
  });

  if (isExternalUrl(resolvedHref)) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  }

  return link;
}

function createActionButton(action) {
  return createLink(action.label, action.href, `button ${action.style || "button-primary"}`);
}

function createList(items, className = "clean-list") {
  const listItems = normalizeTextList(items);

  if (!listItems.length) {
    return null;
  }

  const list = createNode("ul", { className });

  listItems.forEach((item) => {
    list.append(createNode("li", { text: item }));
  });

  return list;
}

function appendParagraphs(host, paragraphs, className = "") {
  normalizeTextList(paragraphs).forEach((paragraph) => {
    host.append(createNode("p", { className, text: paragraph }));
  });
}

function createLinksBlock(links) {
  if (!Array.isArray(links) || !links.length) {
    return null;
  }

  const wrapper = createNode("div", { className: "link-stack" });

  links.forEach((linkData) => {
    if (!linkData || !linkData.label || !linkData.url) {
      return;
    }

    wrapper.append(createLink(linkData.label, linkData.url));
  });

  return wrapper;
}

function buildPhoneHref(phone) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

function resolveFileUrl(item) {
  if (!item) {
    return "";
  }

  if (typeof item.file === "string" && item.file.trim() !== "") {
    return resolveSiteUrl(item.file);
  }

  if (typeof item.externalUrl === "string" && item.externalUrl.trim() !== "") {
    return resolveSiteUrl(item.externalUrl);
  }

  return "";
}

function getDocumentLinkLabel(item) {
  const href = resolveFileUrl(item);

  if (href.toLowerCase().endsWith(".pdf")) {
    return "Download PDF";
  }

  return "Open document";
}

function createResourceList(items, emptyMessage) {
  const resources = Array.isArray(items) ? items.filter((item) => item && item.href) : [];

  if (!resources.length) {
    return createNode("p", { className: "note", text: emptyMessage || "No items available yet." });
  }

  const wrapper = createNode("div", { className: "resource-list" });

  resources.forEach((item) => {
    const entry = createNode("article", { className: "resource-item" });
    const metaValue = item.meta || item.date || "";

    if (metaValue) {
      entry.append(createNode("p", { className: "resource-date", text: metaValue }));
    }

    entry.append(createNode("h4", { className: "resource-title", text: item.title }));

    if (item.description) {
      entry.append(createNode("p", { className: "note", text: item.description }));
    }

    entry.append(createLink(item.linkLabel || "Open item", item.href));
    wrapper.append(entry);
  });

  return wrapper;
}

function createAddressBlock(lines) {
  const addressLines = normalizeTextList(lines);

  if (!addressLines.length) {
    return null;
  }

  const address = createNode("address");
  addressLines.forEach((line, index) => {
    if (index > 0) {
      address.append(document.createElement("br"));
    }
    address.append(document.createTextNode(line));
  });

  return address;
}

function createInfoCard(options) {
  const {
    className = "surface-card",
    id = "",
    meta = "",
    title = "",
    body = "",
    note = "",
    addressLines = [],
    items = [],
    links = []
  } = options;
  const card = createNode("article", {
    className,
    attrs: id ? { id } : {}
  });

  if (meta) {
    card.append(createNode("p", { className: "eyebrow", text: meta }));
  }

  if (title) {
    card.append(createNode("h3", { text: title }));
  }

  if (body) {
    card.append(createNode("p", { text: body }));
  }

  const address = createAddressBlock(addressLines);
  if (address) {
    card.append(address);
  }

  const list = createList(items);
  if (list) {
    card.append(list);
  }

  const linksBlock = createLinksBlock(links);
  if (linksBlock) {
    card.append(linksBlock);
  }

  if (note) {
    card.append(createNode("p", { className: "note", text: note }));
  }

  return card;
}

function setBackgroundImage(host, imageUrl) {
  if (!host || !imageUrl) {
    return;
  }

  const safeUrl = resolveSiteUrl(imageUrl).replace(/"/g, '\\"');
  host.style.setProperty("--page-image", `url("${safeUrl}")`);
}

function setTextContent(selector, value) {
  const node = document.querySelector(selector);

  if (node && typeof value === "string") {
    node.textContent = value;
  }
}

async function fetchJson(path) {
  if (jsonCache.has(path)) {
    return jsonCache.get(path);
  }

  const request = fetch(path).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Unable to load ${path} (${response.status})`);
    }

    return response.json();
  });

  jsonCache.set(path, request);
  return request;
}

function renderSiteHeader(siteSettings) {
  const host = document.querySelector("[data-site-header]");

  if (!host) {
    return;
  }

  const currentPage = document.body.dataset.navSection || document.body.dataset.page || "";
  const navMarkup = siteMap.map((item) => {
    const current = item.id === currentPage ? ' aria-current="page"' : "";
    const submenu = item.children.map((child) => (
      `<a href="${child.href}">${child.label}</a>`
    )).join("");

    return `
      <li class="nav-item has-children">
        <a class="nav-link" href="${item.href}"${current}>${item.label}</a>
        <div class="submenu">
          ${submenu}
        </div>
      </li>
    `;
  }).join("");

  host.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="shell header-shell">
        <a class="brand" href="index.html" aria-label="Parish homepage">
          <img class="brand-mark" src="assets/images/brand-mark.svg" alt="">
          <span class="brand-copy">
            <span class="brand-name"></span>
            <span class="brand-meta"></span>
          </span>
        </a>

        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          Menu
        </button>

        <nav class="site-nav" id="site-nav" aria-label="Primary">
          <ul class="nav-list">
            ${navMarkup}
          </ul>
        </nav>

        <div class="header-actions">
          <a class="button button-secondary" href="donations.html">Donate</a>
        </div>
      </div>
    </header>
  `;

  host.querySelector(".brand-name").textContent = siteSettings.brand.name;
  host.querySelector(".brand-meta").textContent = siteSettings.brand.meta;
}

function renderFooterColumn(host, title, links) {
  const heading = createNode("h3", { text: title });
  const list = createNode("ul");

  links.forEach((item) => {
    const listItem = createNode("li");
    listItem.append(createLink(item.label, item.href, ""));
    list.append(listItem);
  });

  host.append(heading, list);
}

function renderSiteFooter(siteSettings, parishSettings) {
  const host = document.querySelector("[data-site-footer]");

  if (!host) {
    return;
  }

  host.innerHTML = `
    <footer class="site-footer">
      <div class="shell">
        <div class="footer-grid">
          <div class="footer-brand">
            <img class="brand-mark" src="assets/images/brand-mark.svg" alt="">
            <div>
              <h2 data-footer-brand-name></h2>
              <p class="section-copy" data-footer-description></p>
              <div class="footer-contact-stack">
                <p class="footer-contact-line" data-footer-address></p>
                <p class="footer-contact-line" data-footer-contact-line></p>
                <p class="footer-meta" data-footer-hours></p>
              </div>
            </div>
          </div>

          <div class="footer-links" data-footer-worship></div>
          <div class="footer-links" data-footer-community></div>
          <div class="footer-links" data-footer-visit></div>
        </div>

        <div class="footer-legal">
          <nav class="footer-policy-nav" aria-label="Footer policies">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="cookie-policy.html">Cookie Policy</a>
            <a href="safeguarding.html">Safeguarding</a>
            <a href="terms-of-use.html">Terms of Use</a>
          </nav>
          <div class="footer-legal-meta">
            <p class="footer-credit">
              <a data-footer-credit href="" target="_blank" rel="noreferrer"></a>
            </p>
            <p class="footer-meta">&copy; <span data-current-year></span> <span data-footer-copyright></span></p>
          </div>
        </div>
      </div>
    </footer>
  `;

  setTextContent("[data-footer-brand-name]", siteSettings.brand.name);
  setTextContent("[data-footer-description]", siteSettings.footer.description);
  setTextContent("[data-footer-address]", siteSettings.footer.address);
  setTextContent("[data-footer-hours]", parishSettings.contact.officeHoursSummary);
  setTextContent("[data-footer-copyright]", `${siteSettings.brand.name} RC Church`);

  const contactLine = host.querySelector("[data-footer-contact-line]");
  contactLine.append(document.createTextNode(`${siteSettings.footer.officeLabel} `));
  contactLine.append(createLink(siteSettings.footer.phone, buildPhoneHref(siteSettings.footer.phone), ""));
  contactLine.append(document.createTextNode(" | "));
  contactLine.append(createLink("Email parish office", `mailto:${siteSettings.footer.email}`, "footer-email-link"));

  const credit = host.querySelector("[data-footer-credit]");
  credit.textContent = siteSettings.footer.supportLabel;
  credit.href = siteSettings.footer.supportUrl;

  renderFooterColumn(host.querySelector("[data-footer-worship]"), "Worship", [
    { label: "Mass Times", href: "mass-services.html#mass-times" },
    { label: "Livestream", href: "mass-services.html#livestream" },
    { label: "Special Liturgies", href: "mass-services.html#special-liturgies" }
  ]);

  renderFooterColumn(host.querySelector("[data-footer-community]"), "Parish Life", [
    { label: "Parish Life", href: "parish-life.html" },
    { label: "Newsletters", href: "newsletter-archive.html" },
    { label: "Foodbank", href: "parish-life.html#foodbank" }
  ]);

  renderFooterColumn(host.querySelector("[data-footer-visit]"), "Visit / Contact", [
    { label: "Contact Details", href: "visit-contact.html#contact-details" },
    { label: "Office Hours", href: "visit-contact.html#office-hours" },
    { label: "Donations", href: "donations.html" }
  ]);
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

function setupHeroSlideshow() {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length < 2) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeIndex < 0) {
    activeIndex = 0;
    slides[0].classList.add("is-active");
  }

  const setActiveSlide = (nextIndex) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === nextIndex);
    });

    dots.forEach((dot, index) => {
      const selected = index === nextIndex;
      dot.classList.toggle("is-active", selected);
      dot.setAttribute("aria-pressed", String(selected));
    });

    activeIndex = nextIndex;
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index);
    });
  });

  if (reducedMotion) {
    return;
  }

  window.setInterval(() => {
    const nextIndex = (activeIndex + 1) % slides.length;
    setActiveSlide(nextIndex);
  }, HERO_ROTATION_MS);
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear().toString();
  });
}

function renderPageHero(hero) {
  const heroHost = document.querySelector("[data-page-hero]");

  if (!heroHost || !hero) {
    return;
  }

  setBackgroundImage(heroHost, hero.image);
  setTextContent("[data-page-hero-eyebrow]", hero.eyebrow || "");
  setTextContent("[data-page-hero-title]", hero.title || "");
  setTextContent("[data-page-hero-lede]", hero.lede || "");
}

function renderPageIntro(intro, renderAside) {
  setTextContent("[data-page-intro-eyebrow]", intro.eyebrow || "");
  setTextContent("[data-page-intro-title]", intro.title || "");
  setTextContent("[data-page-intro-body]", intro.body || "");

  const aside = document.querySelector("[data-page-intro-aside]");
  if (aside) {
    clearNode(aside);
    renderAside?.(aside, intro);
  }
}

function createSubpageCard(card) {
  const article = createNode("article", {
    className: "subpage-card",
    attrs: card.id ? { id: card.id } : {}
  });

  if (card.meta) {
    article.append(createNode("p", { className: "eyebrow", text: card.meta }));
  }

  if (card.title) {
    article.append(createNode("h3", { text: card.title }));
  }

  appendParagraphs(article, card.paragraphs);

  const list = createList(card.items);
  if (list) {
    article.append(list);
  }

  if (Array.isArray(card.resources)) {
    article.append(createResourceList(card.resources, card.emptyMessage));
  }

  const linksBlock = createLinksBlock(card.links);
  if (linksBlock) {
    article.append(linksBlock);
  }

  if (card.note) {
    article.append(createNode("p", { className: "note", text: card.note }));
  }

  return article;
}

function renderCardGrid(cards) {
  const host = document.querySelector("[data-page-cards]");

  if (!host) {
    return;
  }

  clearNode(host);
  cards.forEach((card) => host.append(createSubpageCard(card)));
}

function mapDocumentResources(items) {
  return sortByDateDesc(Array.isArray(items) ? items : [])
    .map((item) => {
      const href = resolveFileUrl(item);
      if (!href) {
        return null;
      }

      return {
        title: item.title,
        date: formatDate(item.date),
        description: item.description,
        href,
        linkLabel: getDocumentLinkLabel(item)
      };
    })
    .filter(Boolean);
}

function mapNewsResources(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      if (!item.linkUrl) {
        return null;
      }

      return {
        title: item.title,
        date: item.meta,
        description: item.summary,
        href: item.linkUrl,
        linkLabel: item.linkLabel || "Read more"
      };
    })
    .filter(Boolean);
}

function createHomeNewsCard(item, className = "surface-card") {
  const card = createNode("article", { className });

  if (item.meta) {
    card.append(createNode("p", { className: "eyebrow", text: item.meta }));
  }

  card.append(createNode("h3", { text: item.title }));

  if (item.summary) {
    card.append(createNode("p", { text: item.summary }));
  }

  const linkLabel = item.linkLabel || "Read more";
  const href = item.linkUrl || item.href;

  if (href) {
    card.append(createLink(linkLabel, href));
  }

  return card;
}

function createNewsletterHighlight(newsletters) {
  const latestNewsletter = mapDocumentResources(newsletters)[0];

  if (!latestNewsletter) {
    return null;
  }

  return {
    meta: latestNewsletter.date ? `Latest Newsletter | ${latestNewsletter.date}` : "Latest Newsletter",
    title: latestNewsletter.title,
    summary: latestNewsletter.description,
    href: latestNewsletter.href,
    linkLabel: latestNewsletter.linkLabel
  };
}

function renderHomePage(homeContent, parishSettings, newsContent, newsletterContent) {
  const slideHost = document.querySelector("[data-home-hero-slides]");
  const dotHost = document.querySelector("[data-home-hero-dots]");
  clearNode(slideHost);
  clearNode(dotHost);

  (homeContent.hero.slides || []).forEach((slide, index) => {
    const slideNode = createNode("div", {
      className: `hero-slide${index === 0 ? " is-active" : ""}`,
      attrs: {
        role: "img",
        "aria-label": slide.alt || ""
      }
    });
    slideNode.style.backgroundImage = `url("${resolveSiteUrl(slide.image).replace(/"/g, '\\"')}")`;
    slideHost.append(slideNode);

    const dot = createNode("button", {
      className: `hero-dot${index === 0 ? " is-active" : ""}`,
      attrs: {
        type: "button",
        "aria-label": `Show hero image ${index + 1}`,
        "aria-pressed": index === 0 ? "true" : "false",
        "data-hero-dot": "true"
      }
    });
    dotHost.append(dot);
  });

  setTextContent("[data-home-hero-eyebrow]", homeContent.hero.eyebrow);
  setTextContent("[data-home-hero-title]", homeContent.hero.title);
  setTextContent("[data-home-hero-welcome]", homeContent.hero.welcome);

  const actionHost = document.querySelector("[data-home-hero-actions]");
  clearNode(actionHost);
  (homeContent.hero.buttons || []).forEach((action) => {
    actionHost.append(createActionButton(action));
  });

  const featureHost = document.querySelector("[data-home-feature-panels]");
  clearNode(featureHost);
  featureHost.append(
    createInfoCard({
      className: "schedule-card",
      meta: parishSettings.nextMass.eyebrow,
      title: parishSettings.nextMass.title,
      body: parishSettings.nextMass.meta,
      items: [parishSettings.nextMass.body],
      note: parishSettings.nextMass.note,
      links: [
        { label: "Full Mass & Services page", url: "mass-services.html" }
      ]
    }),
    createInfoCard({
      className: "surface-card",
      meta: "Visit / Contact",
      title: parishSettings.contact.visitHighlightTitle,
      body: parishSettings.contact.visitHighlightMeta,
      items: [parishSettings.contact.visitHighlightBody],
      links: [
        { label: "Visit / Contact", url: "visit-contact.html#contact-details" },
        { label: "Watch the livestream", url: "mass-services.html#livestream" }
      ]
    })
  );

  setTextContent("[data-home-quick-eyebrow]", homeContent.quickMassIntro.eyebrow);
  setTextContent("[data-home-quick-title]", homeContent.quickMassIntro.title);
  setTextContent("[data-home-quick-copy]", homeContent.quickMassIntro.copy);

  const quickMassHost = document.querySelector("[data-home-quick-mass]");
  clearNode(quickMassHost);
  (parishSettings.massTimes.quickCards || []).forEach((card) => {
    quickMassHost.append(createInfoCard({
      className: "schedule-card",
      title: card.title,
      items: card.items,
      links: card.links || []
    }));
  });

  const homeNewsHost = document.querySelector("[data-home-news-grid]");
  clearNode(homeNewsHost);

  const orderedNews = Array.isArray(newsContent.items) ? [...newsContent.items] : [];
  const homepageItems = orderedNews.filter((item) => item.featured);
  const backupItems = orderedNews.filter((item) => !item.featured);
  const spotlight = homepageItems[0] || backupItems[0];
  const followUp = homepageItems[1] || backupItems.find((item) => item !== spotlight);
  const latestNewsletter = createNewsletterHighlight(newsletterContent.items || []);

  if (spotlight) {
    homeNewsHost.append(createHomeNewsCard(spotlight, "surface-card feature-card"));
  }

  if (latestNewsletter) {
    homeNewsHost.append(createHomeNewsCard(latestNewsletter));
  }

  if (followUp) {
    homeNewsHost.append(createHomeNewsCard(followUp));
  }

  setTextContent("[data-home-mission-eyebrow]", homeContent.mission.eyebrow);
  setTextContent("[data-home-mission-title]", homeContent.mission.title);
  const missionParagraphHost = document.querySelector("[data-home-mission-paragraphs]");
  clearNode(missionParagraphHost);
  appendParagraphs(missionParagraphHost, homeContent.mission.paragraphs);

  const missionListHost = document.querySelector("[data-home-mission-bullets]");
  clearNode(missionListHost);
  normalizeTextList(homeContent.mission.bullets).forEach((item) => {
    missionListHost.append(createNode("li", { text: item }));
  });

  const missionImage = document.querySelector("[data-home-mission-image]");
  if (missionImage) {
    missionImage.src = resolveSiteUrl(homeContent.mission.image);
    missionImage.alt = homeContent.mission.imageAlt || "";
  }
  setTextContent("[data-home-mission-caption]", homeContent.mission.caption);

  setTextContent("[data-home-life-eyebrow]", homeContent.parishLife.eyebrow);
  setTextContent("[data-home-life-title]", homeContent.parishLife.title);
  setTextContent("[data-home-life-copy]", homeContent.parishLife.copy);
  const lifeHost = document.querySelector("[data-home-life-cards]");
  clearNode(lifeHost);

  (homeContent.parishLife.cards || []).forEach((card) => {
    if (card.type === "image") {
      const article = createNode("article", { className: "image-card" });
      const image = createNode("img", {
        attrs: { src: resolveSiteUrl(card.image), alt: card.imageAlt || "" }
      });
      const copy = createNode("div", { className: "image-card-copy" });
      copy.append(
        createNode("p", { className: "eyebrow", text: card.meta }),
        createNode("h3", { text: card.title }),
        createNode("p", { text: card.body })
      );
      article.append(image, copy);
      lifeHost.append(article);
      return;
    }

    const article = createNode("article", { className: "surface-card" });
      article.append(
        createNode("p", { className: "eyebrow", text: card.meta }),
        createNode("h3", { text: card.title }),
        createNode("p", { text: card.body })
      );

      if (card.image) {
        article.append(createNode("img", {
          className: "inline-logo",
          attrs: {
            src: resolveSiteUrl(card.image),
            alt: card.imageAlt || ""
          }
        }));
      }

    if (card.linkLabel && card.linkUrl) {
      article.append(createLink(card.linkLabel, card.linkUrl));
    }

    lifeHost.append(article);
  });

  setTextContent("[data-home-contact-eyebrow]", homeContent.contactHighlight.eyebrow);
  setTextContent("[data-home-contact-title]", homeContent.contactHighlight.title);
  setTextContent("[data-home-contact-copy]", homeContent.contactHighlight.copy);

  const contactHost = document.querySelector("[data-home-contact-cards]");
  clearNode(contactHost);
  contactHost.append(
    createInfoCard({
      meta: "Church",
      title: parishSettings.contact.churchName,
      addressLines: parishSettings.contact.churchAddressLines,
      items: [`Parking: ${parishSettings.contact.parking}`]
    }),
    createInfoCard({
      meta: "Parish Office",
      title: "Office details",
      body: parishSettings.contact.officeHoursSummary,
      addressLines: parishSettings.contact.officeAddressLines,
      links: [
        { label: `Call parish office: ${parishSettings.contact.officePhone}`, url: buildPhoneHref(parishSettings.contact.officePhone) },
        { label: "Email parish office", url: `mailto:${parishSettings.contact.officeEmail}` }
      ]
    }),
    createInfoCard({
      meta: "Clergy",
      title: parishSettings.contact.priestName,
      body: parishSettings.contact.priestAvailability,
      links: [
        { label: `Call Fr Richard: ${parishSettings.contact.priestPhone}`, url: buildPhoneHref(parishSettings.contact.priestPhone) },
        { label: `Emergency mobile: ${parishSettings.contact.priestEmergency}`, url: buildPhoneHref(parishSettings.contact.priestEmergency) },
        { label: "Email Fr Richard", url: `mailto:${parishSettings.contact.priestEmail}` }
      ]
    }),
    createInfoCard({
      meta: "Safeguarding",
      title: "Local and diocesan contacts",
      items: (parishSettings.safeguarding.parishRepresentatives || []).map((representative) => (
        `${representative.name} - ${representative.role}`
      )),
      links: [
        { label: "Open safeguarding page", url: "safeguarding.html" },
        { label: "Email diocesan safeguarding", url: `mailto:${parishSettings.safeguarding.diocesanEmail}` }
      ]
    })
  );

  setupHeroSlideshow();
}

function renderMassServicesPage(pageContent, parishSettings) {
  renderPageHero(pageContent.hero);
  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: pageContent.intro.asideMeta || "" }),
      createNode("h3", { text: pageContent.intro.asideTitle || "" })
    );
    const list = createList(pageContent.intro.asideItems || []);
    if (list) {
      aside.append(list);
    }
  });

  renderCardGrid(parishSettings.massTimes.serviceCards || []);
}

function renderParishLifePage(pageContent, parishSettings) {
  renderPageHero(pageContent.hero);
  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: pageContent.intro.asideMeta || "" }),
      createNode("h3", { text: "Borderlands" }),
      createNode("p", { text: pageContent.intro.asideBody || "" })
    );
    aside.append(createLink("Borderlands website", "https://www.borderlands.uk.com"));
    aside.append(createLink("Email Borderlands", `mailto:${parishSettings.contact.borderlandsEmail}`));
  });

  renderCardGrid(pageContent.cards || []);
}

function createGalleryAlbum(album, index) {
  const images = Array.isArray(album.images)
    ? album.images.filter((item) => item && typeof item.image === "string" && item.image.trim() !== "")
    : [];

  const article = createNode("article", {
    className: "surface-card gallery-album",
    attrs: album.id ? { id: album.id } : {}
  });
  const shell = createNode("div", { className: "gallery-album-shell" });
  const stage = createNode("div", { className: "gallery-album-stage" });
  const image = createNode("img", {
    className: "gallery-album-image",
    attrs: {
      alt: "",
      loading: index === 0 ? "eager" : "lazy"
    }
  });
  const controls = createNode("div", { className: "gallery-album-controls" });
  const previousButton = createNode("button", {
    className: "gallery-control",
    text: "Previous",
    attrs: { type: "button", "aria-label": `Previous image in ${album.title || "gallery album"}` }
  });
  const nextButton = createNode("button", {
    className: "gallery-control",
    text: "Next",
    attrs: { type: "button", "aria-label": `Next image in ${album.title || "gallery album"}` }
  });
  controls.append(previousButton, nextButton);

  const overlay = createNode("div", { className: "gallery-album-overlay" });
  const overlayCopy = createNode("div", { className: "gallery-album-overlay-copy" });
  const counter = createNode("p", { className: "gallery-album-counter" });
  const caption = createNode("p", { className: "gallery-album-caption" });
  overlayCopy.append(counter, caption);
  overlay.append(overlayCopy);

  if (images.length > 1) {
    stage.append(controls);
  }

  stage.append(image, overlay);

  const copy = createNode("div", { className: "gallery-album-copy" });

  if (album.meta) {
    copy.append(createNode("p", { className: "eyebrow", text: album.meta }));
  }

  copy.append(createNode("h2", { text: album.title || "Gallery album" }));

  if (album.body) {
    copy.append(createNode("p", { text: album.body }));
  }

  copy.append(createNode("p", {
    className: "note",
    text: images.length === 1 ? "1 photograph" : `${images.length} photographs`
  }));

  if (album.note) {
    copy.append(createNode("p", { className: "note", text: album.note }));
  }

  shell.append(stage, copy);
  article.append(shell);

  if (!images.length) {
    stage.append(createNode("p", {
      className: "note gallery-empty",
      text: "No photographs have been added to this album yet."
    }));
    controls.remove();
    return article;
  }

  let activeIndex = 0;
  let intervalId = null;

  const updateImage = (nextIndex) => {
    activeIndex = (nextIndex + images.length) % images.length;
    const activeImage = images[activeIndex];
    image.src = resolveSiteUrl(activeImage.image);
    image.alt = activeImage.imageAlt || `${album.title || "Gallery album"} photograph ${activeIndex + 1}`;
    counter.textContent = images.length === 1 ? album.title || "Gallery image" : `${activeIndex + 1} / ${images.length}`;
    caption.textContent = activeImage.caption || activeImage.imageAlt || album.title || "";
  };

  const stopRotation = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startRotation = () => {
    if (images.length <= 1 || intervalId) {
      return;
    }

    intervalId = window.setInterval(() => {
      updateImage(activeIndex + 1);
    }, GALLERY_ROTATION_MS);
  };

  previousButton.addEventListener("click", () => {
    stopRotation();
    updateImage(activeIndex - 1);
    startRotation();
  });

  nextButton.addEventListener("click", () => {
    stopRotation();
    updateImage(activeIndex + 1);
    startRotation();
  });

  article.addEventListener("mouseenter", stopRotation);
  article.addEventListener("mouseleave", startRotation);
  article.addEventListener("focusin", stopRotation);
  article.addEventListener("focusout", startRotation);

  updateImage(0);
  startRotation();

  return article;
}

function renderGalleryPage(pageContent) {
  renderPageHero(pageContent.hero);
  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: pageContent.intro.asideMeta || "" }),
      createNode("h3", { text: pageContent.intro.asideTitle || "" })
    );

    const list = createList(pageContent.intro.asideItems || []);
    if (list) {
      aside.append(list);
    }
  });

  const galleryHost = document.querySelector("[data-gallery-albums]");
  clearNode(galleryHost);

  (pageContent.albums || []).forEach((album, index) => {
    galleryHost.append(createGalleryAlbum(album, index));
  });

  renderCardGrid(pageContent.cards || []);
}

function renderNewsReflectionsPage(pageContent, newsContent, newsletterContent, documentContent) {
  renderPageHero(pageContent.hero);
  const newsletterResources = mapDocumentResources(newsletterContent.items || []);
  const latestNewsletter = newsletterResources[0];

  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: pageContent.intro.asideMeta || "" }),
      createNode("h3", { text: latestNewsletter ? latestNewsletter.title : "No bulletin uploaded yet" })
    );

    if (latestNewsletter) {
      if (latestNewsletter.date) {
        aside.append(createNode("p", { className: "note", text: latestNewsletter.date }));
      }
      if (latestNewsletter.description) {
        aside.append(createNode("p", { text: latestNewsletter.description }));
      }
      aside.append(createLink(latestNewsletter.linkLabel, latestNewsletter.href));
    } else {
      aside.append(createNode("p", { text: "Upload a newsletter PDF in the CMS and it will appear here automatically." }));
    }
  });

  const cards = (pageContent.cards || []).map((card) => {
    if (card.id === "weekly-highlights") {
      return {
        ...card,
        resources: mapNewsResources(newsContent.items || []),
        emptyMessage: "No current news items have been added yet."
      };
    }

    if (card.id === "parish-newsletters") {
      return {
        ...card,
        resources: newsletterResources,
        emptyMessage: "No newsletters have been uploaded yet."
      };
    }

    return card;
  });

  const documentResources = mapDocumentResources(documentContent.items || []);
  if (documentResources.length) {
    cards.push({
      id: "parish-documents",
      meta: "Documents",
      title: "Parish Documents",
      paragraphs: [
        "Synod reports, parish papers, and prayer resources can be uploaded through the CMS and will appear here automatically."
      ],
      resources: documentResources
    });
  }

  renderCardGrid(cards);
}

function renderNewsletterArchivePage(pageContent, newsletterContent, documentContent) {
  renderPageHero(pageContent.hero);

  const newsletterResources = mapDocumentResources(newsletterContent.items || []);
  const documentResources = mapDocumentResources(documentContent.items || []);
  const latestNewsletter = newsletterResources[0];

  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: pageContent.intro.asideMeta || "" }),
      createNode("h3", {
        text: latestNewsletter ? latestNewsletter.title : pageContent.intro.asideTitle || "No bulletin uploaded yet"
      })
    );

    if (latestNewsletter) {
      if (latestNewsletter.date) {
        aside.append(createNode("p", { className: "note", text: latestNewsletter.date }));
      }
      if (latestNewsletter.description) {
        aside.append(createNode("p", { text: latestNewsletter.description }));
      }
      aside.append(createActionButton({
        label: latestNewsletter.linkLabel,
        href: latestNewsletter.href,
        style: "button-secondary"
      }));
      return;
    }

    aside.append(createNode("p", {
      text: pageContent.intro.asideBody || "Upload a newsletter PDF in the CMS and it will appear here automatically."
    }));
  });

  const cards = (pageContent.cards || []).map((card) => {
    if (card.id === "latest-newsletter") {
      return {
        ...card,
        resources: latestNewsletter ? [latestNewsletter] : [],
        emptyMessage: "No newsletter has been uploaded yet."
      };
    }

    if (card.id === "newsletter-archive") {
      return {
        ...card,
        resources: newsletterResources,
        emptyMessage: "No newsletters have been uploaded yet."
      };
    }

    if (card.id === "parish-documents") {
      return {
        ...card,
        resources: documentResources,
        emptyMessage: "No parish documents have been added yet."
      };
    }

    return card;
  });

  renderCardGrid(cards);
}

function renderAboutParishPage(pageContent, parishSettings, documentContent) {
  renderPageHero(pageContent.hero);
  renderPageIntro(pageContent.intro, (aside) => {
    const image = createNode("img", {
      attrs: {
        src: resolveSiteUrl(pageContent.intro.image),
        alt: pageContent.intro.imageAlt || ""
      }
    });
    const caption = createNode("p", { className: "note", text: pageContent.intro.caption || "" });
    aside.append(image, caption);
  });

  const documentResources = mapDocumentResources(documentContent.items || []);
  const cards = (pageContent.cards || []).map((card) => {
    if (card.id === "parish-leadership") {
      return {
        ...card,
        items: [
          `Parish priest: ${parishSettings.contact.priestName}`,
          `Parish Office: ${parishSettings.contact.officePhone}`,
          parishSettings.contact.priestAvailability
        ],
        links: [
          { label: "Visit / Contact", url: "visit-contact.html#contact-details" },
          { label: "Email parish office", url: `mailto:${parishSettings.contact.officeEmail}` }
        ]
      };
    }

    if (card.id === "synod-information") {
      return {
        ...card,
        resources: documentResources,
        emptyMessage: "No parish documents have been uploaded yet."
      };
    }

    if (card.id === "safeguarding") {
      return {
        ...card,
        items: (parishSettings.safeguarding.parishRepresentatives || []).map((representative) => (
          `${representative.name} - ${representative.role}`
        ))
      };
    }

    return card;
  });

  renderCardGrid(cards);
}

function renderVisitContactPage(pageContent, parishSettings) {
  renderPageHero(pageContent.hero);
  const donationLinks = Array.isArray(parishSettings.contact.donationLinks) ? parishSettings.contact.donationLinks : [];
  const [primaryDonation, ...missionSupportLinks] = donationLinks;

  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: "Parish office" }),
      createNode("h3", { text: parishSettings.contact.churchName }),
      createAddressBlock(parishSettings.contact.officeAddressLines),
      createNode("p", { className: "note", text: parishSettings.contact.officeHoursSummary })
    );
    aside.append(createLink(parishSettings.contact.officePhone, buildPhoneHref(parishSettings.contact.officePhone)));
    aside.append(createLink("Email parish office", `mailto:${parishSettings.contact.officeEmail}`));
  });

  const cards = (pageContent.cards || []).map((card) => {
    if (card.id === "location-map") {
      return {
        ...card,
        items: [
          `Church: ${parishSettings.contact.churchAddressLines.join(", ")}`,
          `Presbytery: ${parishSettings.contact.presbyteryAddressLines.join(", ")}`,
          `Parish Office: ${parishSettings.contact.officeAddressLines.join(", ")}`,
          `Parking: ${parishSettings.contact.parking}`
        ],
        links: [
          { label: "Contact details on this site", url: parishSettings.contact.contactPageUrl }
        ]
      };
    }

    if (card.id === "office-hours") {
      return {
        ...card,
        items: parishSettings.contact.officeHoursDetailed
      };
    }

    if (card.id === "contact-details-page") {
      return {
        ...card,
        items: [
          `Parish Office: ${parishSettings.contact.officePhone}`,
          `Parish priest: ${parishSettings.contact.priestName}`,
          `Telephone: ${parishSettings.contact.priestPhone}`,
          `Emergency mobile: ${parishSettings.contact.priestEmergency}`,
          parishSettings.contact.priestAvailability
        ],
        links: [
          { label: "Email parish office", url: `mailto:${parishSettings.contact.officeEmail}` },
          { label: "Email Fr Richard", url: `mailto:${parishSettings.contact.priestEmail}` }
        ]
      };
    }

    if (card.id === "donations") {
      return {
        ...card,
        links: [
          ...(primaryDonation ? [{ label: primaryDonation.label, url: primaryDonation.url }] : []),
          { label: "Open the donations page", url: "donations.html" },
          ...missionSupportLinks.map((link) => ({
            label: link.label,
            url: link.url
          }))
        ]
      };
    }

    return card;
  });

  renderCardGrid(cards);
}

function renderDonationsPage(pageContent, parishSettings) {
  renderPageHero(pageContent.hero);

  const donationLinks = Array.isArray(parishSettings.contact.donationLinks) ? parishSettings.contact.donationLinks : [];
  const [primaryDonation, ...missionSupportLinks] = donationLinks;

  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: pageContent.intro.asideMeta || "" }),
      createNode("h3", { text: pageContent.intro.asideTitle || "" }),
      createNode("p", { text: pageContent.intro.asideBody || "" })
    );

    if (primaryDonation) {
      aside.append(createActionButton({
        label: primaryDonation.label,
        href: primaryDonation.url,
        style: "button-secondary"
      }));
    }

    aside.append(createNode("p", { className: "note", text: parishSettings.contact.officeHoursSummary }));
  });

  const cards = (pageContent.cards || []).map((card) => {
    if (card.id === "parish-giving") {
      return {
        ...card,
        links: primaryDonation ? [{ label: primaryDonation.label, url: primaryDonation.url }] : [],
        note: primaryDonation ? card.note : "Add the parish giving link in the parish settings to show it here."
      };
    }

    if (card.id === "support-parish-outreach") {
      return {
        ...card,
        links: missionSupportLinks.map((link) => ({
          label: link.label,
          url: link.url
        }))
      };
    }

    if (card.id === "contact-giving") {
      return {
        ...card,
        items: [
          `Parish Office: ${parishSettings.contact.officePhone}`,
          parishSettings.contact.officeHoursSummary
        ],
        links: [
          { label: `Call parish office: ${parishSettings.contact.officePhone}`, url: buildPhoneHref(parishSettings.contact.officePhone) },
          { label: "Email parish office", url: `mailto:${parishSettings.contact.officeEmail}` }
        ]
      };
    }

    return card;
  });

  renderCardGrid(cards);
}

function renderSafeguardingPage(pageContent, parishSettings) {
  renderPageHero(pageContent.hero);
  renderPageIntro(pageContent.intro, (aside) => {
    aside.append(
      createNode("p", { className: "eyebrow", text: "Immediate parish contacts" }),
      createNode("h3", { text: "Parish Safeguarding Representatives" })
    );

    const representativesList = createList((parishSettings.safeguarding.parishRepresentatives || []).map((representative) => (
      `${representative.name} - ${representative.email}`
    )));
    if (representativesList) {
      aside.append(representativesList);
    }
  });

  renderCardGrid([
    {
      id: "local-safeguarding",
      meta: "Parish safeguarding",
      title: "Parish representatives",
      paragraphs: [
        "Use the parish safeguarding representatives for local safeguarding concerns or to ask how to report a matter appropriately."
      ],
      items: (parishSettings.safeguarding.parishRepresentatives || []).map((representative) => (
        `${representative.name} - ${representative.role}`
      )),
      links: (parishSettings.safeguarding.parishRepresentatives || []).map((representative) => ({
        label: `Email ${representative.name}`,
        url: `mailto:${representative.email}`
      }))
    },
    {
      id: "diocesan-safeguarding",
      meta: "Diocese of Clifton",
      title: "Diocesan Safeguarding Team",
      paragraphs: [
        `Address: ${parishSettings.safeguarding.diocesanOfficeAddress}`
      ],
      items: [
        `General enquiries phone: ${parishSettings.safeguarding.diocesanPhone}`,
        `General enquiries email: ${parishSettings.safeguarding.diocesanEmail}`,
        `Coordinator: ${parishSettings.safeguarding.coordinatorName}`,
        `Coordinator phone: ${parishSettings.safeguarding.coordinatorPhone}`,
        `Coordinator email: ${parishSettings.safeguarding.coordinatorEmail}`
      ],
      links: [
        { label: "Clifton diocesan safeguarding page", url: parishSettings.safeguarding.diocesanUrl },
        { label: "Email diocesan safeguarding", url: `mailto:${parishSettings.safeguarding.diocesanEmail}` }
      ]
    },
    {
      id: "safeguarding-documents",
      meta: "Policies and downloads",
      title: "Safeguarding documents",
      paragraphs: [
        "The parish safeguarding page and related safeguarding resources remain available here for quick access."
      ],
      links: [
        { label: "Parish safeguarding contacts on this site", url: parishSettings.safeguarding.parishPageUrl },
        { label: "Bishops' safeguarding statement PDF", url: parishSettings.safeguarding.bishopStatementUrl },
        { label: "Domestic abuse booklet PDF", url: parishSettings.safeguarding.domesticAbuseBookletUrl }
      ]
    }
  ]);
}

function renderLegalPage(legalContent) {
  const pageKey = document.body.dataset.contentPage || "privacy";
  const pageData = legalContent[pageKey];

  if (!pageData) {
    return;
  }

  const hero = document.querySelector("[data-legal-hero]");
  setBackgroundImage(hero, "/uploads/hero-interior.jpg");
  setTextContent("[data-legal-eyebrow]", pageData.eyebrow || "");
  setTextContent("[data-legal-title]", pageData.title || "");
  setTextContent("[data-legal-lede]", pageData.lede || "");

  const reviewHost = document.querySelector("[data-legal-review]");
  clearNode(reviewHost);
  reviewHost.append(
    createNode("p", { className: "eyebrow", text: "Review before launch" }),
    createNode("h2", { text: "Approval needed" }),
    createNode("p", { text: pageData.reviewNotice || "" })
  );

  const sectionHost = document.querySelector("[data-legal-sections]");
  clearNode(sectionHost);
  (pageData.sections || []).forEach((section) => {
    const article = createNode("article", { className: "surface-card" });
    article.append(
      createNode("h2", { text: section.title }),
      createNode("p", { text: section.body })
    );
    sectionHost.append(article);
  });
}

function showLoadError(error) {
  const main = document.querySelector("main");

  if (!main) {
    return;
  }

  const shell = createNode("div", { className: "shell" });
  const card = createNode("article", { className: "surface-card" });
  card.append(
    createNode("p", { className: "eyebrow", text: "Content error" }),
    createNode("h2", { text: "The page content could not be loaded." }),
    createNode("p", {
      text: "Check that the site is being served through a web server and that the JSON content files are available."
    }),
    createNode("p", { className: "note", text: error.message })
  );
  shell.append(card);
  main.prepend(shell);
}

async function renderCurrentPage() {
  const page = document.body.dataset.page || "";

  switch (page) {
    case "home": {
      const [homeContent, parishSettings, newsContent, newsletterContent] = await Promise.all([
        fetchJson(CONTENT_FILES.home),
        fetchJson(CONTENT_FILES.parish),
        fetchJson(CONTENT_FILES.news),
        fetchJson(CONTENT_FILES.newsletters)
      ]);
      renderHomePage(homeContent, parishSettings, newsContent, newsletterContent);
      break;
    }
    case "mass-services": {
      const [pageContent, parishSettings] = await Promise.all([
        fetchJson(CONTENT_FILES.massServices),
        fetchJson(CONTENT_FILES.parish)
      ]);
      renderMassServicesPage(pageContent, parishSettings);
      break;
    }
    case "parish-life": {
      const [pageContent, parishSettings] = await Promise.all([
        fetchJson(CONTENT_FILES.parishLife),
        fetchJson(CONTENT_FILES.parish)
      ]);
      renderParishLifePage(pageContent, parishSettings);
      break;
    }
    case "gallery": {
      const pageContent = await fetchJson(CONTENT_FILES.gallery);
      renderGalleryPage(pageContent);
      break;
    }
    case "news-reflections": {
      const [pageContent, newsContent, newsletterContent, documentContent] = await Promise.all([
        fetchJson(CONTENT_FILES.newsReflections),
        fetchJson(CONTENT_FILES.news),
        fetchJson(CONTENT_FILES.newsletters),
        fetchJson(CONTENT_FILES.documents)
      ]);
      renderNewsReflectionsPage(pageContent, newsContent, newsletterContent, documentContent);
      break;
    }
    case "newsletter-archive": {
      const [pageContent, newsletterContent, documentContent] = await Promise.all([
        fetchJson(CONTENT_FILES.newsletterArchive),
        fetchJson(CONTENT_FILES.newsletters),
        fetchJson(CONTENT_FILES.documents)
      ]);
      renderNewsletterArchivePage(pageContent, newsletterContent, documentContent);
      break;
    }
    case "about-parish": {
      const [pageContent, parishSettings, documentContent] = await Promise.all([
        fetchJson(CONTENT_FILES.aboutParish),
        fetchJson(CONTENT_FILES.parish),
        fetchJson(CONTENT_FILES.documents)
      ]);
      if (document.body.dataset.contentPage === "safeguarding") {
        const safeguardingContent = await fetchJson(CONTENT_FILES.safeguarding);
        renderSafeguardingPage(safeguardingContent, parishSettings);
      } else {
        renderAboutParishPage(pageContent, parishSettings, documentContent);
      }
      break;
    }
    case "visit-contact": {
      const [pageContent, parishSettings] = await Promise.all([
        fetchJson(CONTENT_FILES.visitContact),
        fetchJson(CONTENT_FILES.parish)
      ]);
      renderVisitContactPage(pageContent, parishSettings);
      break;
    }
    case "donations": {
      const [pageContent, parishSettings] = await Promise.all([
        fetchJson(CONTENT_FILES.donations),
        fetchJson(CONTENT_FILES.parish)
      ]);
      renderDonationsPage(pageContent, parishSettings);
      break;
    }
    case "legal": {
      const legalContent = await fetchJson(CONTENT_FILES.legal);
      renderLegalPage(legalContent);
      break;
    }
    default:
      break;
  }
}

async function init() {
  try {
    const [siteSettings, parishSettings] = await Promise.all([
      fetchJson(CONTENT_FILES.site),
      fetchJson(CONTENT_FILES.parish)
    ]);

    renderSiteHeader(siteSettings);
    renderSiteFooter(siteSettings, parishSettings);
    setupNavigation();
    await renderCurrentPage();
    setCurrentYear();
  } catch (error) {
    console.error(error);
    showLoadError(error);
  }
}

init();
