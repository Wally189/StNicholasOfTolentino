interface SectionHeadingProps {
  marker: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ marker, title, intro }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <p className="section-marker">{marker}</p>
      <h2>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </header>
  );
}
