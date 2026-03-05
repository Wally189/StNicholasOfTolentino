import type { ReactNode } from "react";

interface CalloutProps {
  title: string;
  children: ReactNode;
  tone?: "default" | "priority";
}

export function Callout({ title, children, tone = "default" }: CalloutProps) {
  return (
    <section className={`callout callout-${tone}`} aria-label={title}>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}
