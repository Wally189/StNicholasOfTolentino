# Parish Content Admin Notes

This project uses Markdown content files with frontmatter models so parish staff can update text without editing layout code.

## Where to edit content

- Bulletins: `content/bulletins/*.md` (`Bulletin` model)
- Parish News / Highlights: `content/news/*.md` (`NewsItem` model)
- Diary events: `content/events/*.md` (`Event` model)
- Reflections/Resources: `content/reflections/*.md` (`Reflection` model)
- Simple static pages: `content/pages/*.md` (`StaticPage` model), used for School, Borderlands, Diocese links

## Frontmatter fields by model

- `Bulletin`: `model`, `title`, `date`, `summary`, `slug`, `fileUrl`
- `NewsItem`: `model`, `title`, `date`, `summary`, `slug`, `category`
- `Event`: `model`, `title`, `date`, `summary`, `slug`, `startTime`, `location`
- `Reflection`: `model`, `title`, `date`, `summary`, `slug`, `category`, `author`
- `StaticPage`: `model`, `title`, `date`, `summary`, `slug`, `section`

## Route mapping

- Home: `/`
- Mass Times: `/mass-times`
- News index + filters: `/parish-news?filter=highlights|diary|bulletins`
- Bulletin list/detail: `/parish-news/bulletins` and `/parish-news/bulletins/[slug]`
- Diary list/detail: `/parish-news/diary` and `/parish-news/diary/[slug]`
- News detail: `/parish-news/[slug]`
- Mission: `/our-parish-mission`
- Safeguarding: `/safeguarding`
- Foodbank: `/foodbank`
- Reflections index/detail: `/reflections-resources` and `/reflections-resources/[slug]`
- Live Stream: `/live-stream`
- Contact/Find Us: `/contact-find-us`
- Gallery: `/gallery`
- School / Borderlands / Diocese links: `/school`, `/borderlands`, `/diocese-links`

## Media and assets

- Hero and page imagery: `public/images/`
- Gallery images: `public/images/gallery/`
- Bulletin PDF files can be placed in `public/docs/bulletins/` and linked from `fileUrl`.

## Running locally

```bash
npm install
npm run dev
```

