# St Nicholas of Tolentino Website

Static parish website built with plain HTML, CSS, and JavaScript, with editable content managed through Decap CMS.

## Deployment

- The public site is deployed from `main` with GitHub Pages via `.github/workflows/deploy-pages.yml`.
- Once GitHub Pages is enabled for this repository, the expected public URL is `https://wally189.github.io/StNicholasOfTolentino/`.
- GitHub Pages will publish the public website, but Decap CMS login still needs a production authentication layer before `/admin` can be used live by parish staff.

## How the CMS is wired in

- Public page layouts live in the root HTML files such as `index.html`, `mass-services.html`, and `visit-contact.html`.
- Shared editable content lives in `content/settings`.
- Page-specific editable text lives in `content/pages`.
- News, newsletters, and downloadable documents live in:
  - `content/news/items.json`
  - `content/newsletters/items.json`
  - `content/documents/items.json`
- Uploaded images and PDFs are stored in `uploads`.
- The Decap CMS entry point is `admin/index.html`.
- The Decap CMS collections are configured in `admin/config.yml`.
- The shared front-end renderer is `assets/js/site.js`.

## What can be edited without code

- Homepage welcome text
- Hero slideshow images
- Next Mass panel
- Mass times and livestream links
- Contact details and office hours
- Safeguarding contacts
- Homepage feature cards
- News items
- Newsletter PDFs
- Parish documents
- Footer contact details
- Privacy Policy, Cookie Policy, and Terms of Use starter text

## What still needs developer support

- Production authentication for Decap CMS on the live site
- Any design or layout change
- New pages or navigation changes
- Form integrations
- Analytics or cookie tooling
- Final legal text review before launch

## Local support workflow

Serve the site through a local web server before testing public pages, because the pages load JSON content with `fetch`.

Example local support commands:

```powershell
npx http-server . -p 8080 -c-1
npx decap-server
```

Then open:

- `http://localhost:8080/`
- `http://localhost:8080/admin/`

The public editing guide for non-technical users is:

- `how-to-update.html`
- `HOW-TO-UPDATE-THIS-WEBSITE.md`
