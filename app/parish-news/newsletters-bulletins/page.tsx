import { redirect } from "next/navigation";

export default function NewslettersRedirectPage() {
  redirect("/parish-news/bulletins");
}
