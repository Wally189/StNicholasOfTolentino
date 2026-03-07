import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Bulletin,
  Event,
  NewsItem,
  ParishContent,
  ParsedItem,
  Reflection,
  StaticPage
} from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content");

function readMarkdownFiles(folder: string) {
  const fullFolder = path.join(contentRoot, folder);
  return fs
    .readdirSync(fullFolder)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({ file, raw: fs.readFileSync(path.join(fullFolder, file), "utf8") }));
}

function sortByDateDesc<T extends { date: string }>(items: T[]) {
  return items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function parseCollection<T>(folder: string): T[] {
  return readMarkdownFiles(folder)
    .map(({ raw }) => matter(raw).data as T)
    .filter((item) => !(item as { draft?: boolean }).draft);
}

export function getBulletins(): Bulletin[] {
  return sortByDateDesc(parseCollection<Bulletin>("bulletins"));
}

export function getNewsItems(): NewsItem[] {
  return sortByDateDesc(parseCollection<NewsItem>("news"));
}

export function getEvents(): Event[] {
  return sortByDateDesc(parseCollection<Event>("events"));
}

export function getReflections(): Reflection[] {
  return sortByDateDesc(parseCollection<Reflection>("reflections"));
}

export function getStaticPages(): StaticPage[] {
  return sortByDateDesc(parseCollection<StaticPage>("pages"));
}

function readBySlug<T extends ParishContent>(folder: string, slug: string): ParsedItem<T> | null {
  const filePath = path.join(contentRoot, folder, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);

  return {
    frontmatter: parsed.data as T,
    content: parsed.content
  };
}

export function getBulletinBySlug(slug: string) {
  return readBySlug<Bulletin>("bulletins", slug);
}

export function getNewsBySlug(slug: string) {
  return readBySlug<NewsItem>("news", slug);
}

export function getEventBySlug(slug: string) {
  return readBySlug<Event>("events", slug);
}

export function getReflectionBySlug(slug: string) {
  return readBySlug<Reflection>("reflections", slug);
}

export function getStaticPageBySlug(slug: string) {
  return readBySlug<StaticPage>("pages", slug);
}
