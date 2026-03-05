export default function AdminContentPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Parish Admin Content Guide</h1>
          <p>Where parish staff update text and schedules without changing templates.</p>
        </div>
      </header>

      <section className="section">
        <div className="site-width editorial-columns">
          <div className="typographic-block">
            <h2>Content Folders</h2>
            <p>`content/bulletins/*.md` - Bulletin entries</p>
            <p>`content/news/*.md` - News and highlights posts</p>
            <p>`content/events/*.md` - Parish diary events</p>
            <p>`content/reflections/*.md` - Reflections and resources</p>
            <p>`content/pages/*.md` - School, Borderlands, Diocese links</p>
          </div>
          <div className="typographic-block">
            <h2>Media</h2>
            <p>`public/images/` - Hero and key imagery</p>
            <p>`public/images/gallery/` - Gallery images</p>
            <p>`public/docs/bulletins/` - Bulletin PDFs referenced by `fileUrl`</p>
          </div>
        </div>
      </section>
    </>
  );
}
