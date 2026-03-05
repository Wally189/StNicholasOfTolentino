import { notFound } from "next/navigation";
import { StaticPageContent } from "@/components/static-page-content";
import { getStaticPages } from "@/lib/content";

export function generateStaticParams() {
  return getStaticPages().map((item) => ({ slug: item.slug }));
}

export default async function GenericStaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const valid = getStaticPages().some((item) => item.slug === slug);
  if (!valid) {
    notFound();
  }

  return <StaticPageContent slug={slug} />;
}
