# St Nicholas of Tolentino Website

Static parish website built with plain HTML, CSS, and JavaScript, with editable content managed through Decap CMS.

This repository is a portfolio-quality parish website example. It is intended to demonstrate practical digital support for a real-world community setting: clear public information, easy content updates, sensible governance, and documentation that non-technical parish staff or volunteers could understand.

It is not primarily intended to show advanced software development. It is intended to show that Alan W Gallagher can understand an organisation's information needs, structure content clearly, support maintainability, and translate technical setup into ordinary operational guidance.

## Portfolio position

- **Classification:** Portfolio
- **Project type:** parish/community website example
- **Primary audience:** parish teams, small organisations, community volunteers, recruiters, collaborators, and hiring managers
- **Core message:** clear, maintainable, people-centred website structure for a small community organisation
- **Public status:** showcase candidate, subject to final checks and production authentication decisions

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

## What this demonstrates

- ability to organise public-facing information for a non-technical organisation
- understanding of editable content and basic content governance
- ability to document what staff or volunteers can safely edit
- awareness that website work is operational, not just visual
- ability to use GitHub, static hosting, CMS configuration, and AI-supported workflows without presenting the work as magic

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

## Repository management

- `README.md` explains the repository and technical/content structure.
- `PROJECT-STATUS.md` records portfolio classification and showcase rules.
- Public-facing content should remain clear, respectful, and suitable for a Catholic parish setting.
- No private parish, safeguarding, staff, volunteer, donor, or parishioner personal data should be committed.