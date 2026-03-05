export type ContentType = "bulletin" | "news" | "event" | "reflection" | "static-page";

interface BaseFrontmatter {
  title: string;
  date: string;
  summary: string;
  slug: string;
  draft?: boolean;
}

export interface Bulletin extends BaseFrontmatter {
  model: "Bulletin";
  fileUrl?: string;
}

export interface NewsItem extends BaseFrontmatter {
  model: "NewsItem";
  category: "highlights" | "general";
}

export interface Event extends BaseFrontmatter {
  model: "Event";
  startTime: string;
  location: string;
}

export interface Reflection extends BaseFrontmatter {
  model: "Reflection";
  category: "Spiritual Reflection" | "Pope Francis' Words" | "Penitential Rites" | "Bidding Prayers";
  author?: string;
}

export interface StaticPage extends BaseFrontmatter {
  model: "StaticPage";
  section: string;
}

export type ParishContent = Bulletin | NewsItem | Event | Reflection | StaticPage;

export interface ParsedItem<T extends ParishContent> {
  frontmatter: T;
  content: string;
}
