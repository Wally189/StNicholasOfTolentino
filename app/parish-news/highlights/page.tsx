import { redirect } from "next/navigation";

export default function HighlightsRedirectPage() {
  redirect("/parish-news?filter=highlights");
}
